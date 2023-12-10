"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { retryRequestAction } from "@/server/actions/retry"
import { calcDiffInMillis } from "@/lib/date-helpers"
import { dataTableTimestampFormatter } from "@/lib/formatters"

import type { Destination, Integration, Source } from "@hazel/db"
import { useAction } from "@hazel/server/actions/client"
import { TBRequest, TBResponse } from "@hazel/tinybird"
import { Badge, badgeVariants } from "@hazel/ui/badge"
import { Button, buttonVariants } from "@hazel/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@hazel/ui/dropdown-menu"
import { SimpleTooltip } from "@hazel/ui/tooltip"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { IconDotsVertical, IconLogin } from "@tabler/icons-react"
import { Separator } from "@hazel/ui/separator"
import { getVariantForLatency } from "@/lib/utils"
import { StatusCodeBadge } from "@/components/status-code-badge"
import { ListItem } from "./list-item"

type Column = TBRequest & {
	responses: TBResponse[]
}

const columnHelper = createColumnHelper<Column>()

export const requestColumns = (
	sources: (Source & {
		integration: Integration | null
	})[],
	destinations: Destination[],
	retryAction: typeof retryRequestAction,
) =>
	[
		columnHelper.accessor("timestamp", {
			id: "timestamp",
			header: "Timestamp",
			cell: ({ cell }) => {
				const timestamp = cell.getValue()

				return dataTableTimestampFormatter().format(new Date(timestamp))
			},
		}),

		columnHelper.accessor("id", {
			id: "request_id",
			header: "Request ID",
			cell: ({ cell }) => {
				const requestId = cell.getValue()

				return (
					<Link className={buttonVariants({ variant: "link", size: "none" })} href={`/request/${requestId}`}>
						{requestId}
					</Link>
				)
			},
		}),

		columnHelper.accessor("source_id", {
			header: "Source",
			cell: ({ cell }) => {
				const sourceId = cell.getValue()

				const source = sources.find((dest) => dest.publicId === sourceId)

				if (!source) {
					return <Badge variant="destructive">Deleted</Badge>
				}

				return (
					<Link
						className={buttonVariants({ variant: "outline", size: "xs", className: "gap-2" })}
						href={`/source/${sourceId}`}
					>
						{source.integration ? (
							<img
								src={`/assets/integrations/${source.integration.tool}.svg`}
								alt={source.integration.tool}
								className="w-5 h-5"
							/>
						) : (
							<IconLogin className="w-5 h-5 text-muted-foreground" />
						)}
						{source.name}
					</Link>
				)
			},
		}),

		columnHelper.accessor("rejected", {
			header: "Status",
			cell: ({ cell }) => {
				const rejected = cell.getValue() === 1
				const responses = cell.row.original.responses
				const timestamp = cell.row.original.timestamp

				if (responses.length > 4) {
					return (
						<div className="flex gap-0.5 w-[100px]">
							{responses.map((res) => (
								<SimpleTooltip key={res.id} content={<ResponseTooltipContent res={res} />}>
									<Link
										className={badgeVariants({
											variant: res.success ? "success" : "destructive",
											className: "p-0 w-full h-6 max-w-[12px] rounded-lg",
										})}
										href={`/response/${res.id}`}
									/>
								</SimpleTooltip>
							))}
						</div>
					)
				}

				if (responses.length > 1 && responses.length < 4) {
					return (
						<div className="flex gap-1 max-w-[200px]">
							{responses.map((res) => (
								<SimpleTooltip key={res.id} content={<ResponseTooltipContent res={res} />}>
									<Link href={`/response/${res.id}`}>
										<Badge
											className="cursor-pointer"
											variant={res.success === 1 ? "success" : "destructive"}
										>
											{res.success === 1 ? "S" : "E"}
										</Badge>
									</Link>
								</SimpleTooltip>
							))}
						</div>
					)
				}

				if (responses.length === 1) {
					const response = responses[0]

					return (
						<SimpleTooltip content={<ResponseTooltipContent res={response} key={response.id} />}>
							<Link href={`/response/${response.id}`}>
								<Badge
									className="cursor-pointer"
									variant={response.success === 1 ? "success" : "destructive"}
								>
									{response.success === 1 ? "Success" : "Error"}
								</Badge>
							</Link>
						</SimpleTooltip>
					)
				}

				if (rejected) {
					return <Badge variant={"destructive"}>Unauthorized</Badge>
				}

				const timeAgo = new Date().getTime() - new Date(timestamp).getTime()

				const oneHourInMilliseconds = 3600000

				if (timeAgo > oneHourInMilliseconds) {
					return (
						<SimpleTooltip
							content={
								<div>
									Please retry this event manually,
									<br /> after making sure your Server is reachable again.
								</div>
							}
						>
							<div>
								<Badge variant={"destructive"}>Couldnt Reach</Badge>
							</div>
						</SimpleTooltip>
					)
				}

				return <Badge variant={"outline"}>Delivering</Badge>
			},
		}),

		columnHelper.accessor("rejected", {
			id: "verified",
			header: "Verified",
			cell: ({ cell, row }) => {
				const rejected = cell.getValue() === 1
				const validated = row.original.validated === 1

				if (!validated) {
					return "-"
				}

				return (
					<Badge variant={rejected ? "destructive" : "success"}>{rejected ? "Unauthorized" : "Valid"}</Badge>
				)
			},
		}),

		columnHelper.display({
			id: "actions",
			cell: ({ row }) => {
				const router = useRouter()
				const request = row.original

				const handleRetry = useAction(retryAction, {
					onSuccess: () => {
						router.refresh()
					},
				})

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<IconDotsVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem asChild>
								<Link prefetch={false} href={`/request/${request.id}`}>
									View Request
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => navigator.clipboard.writeText(request.id)}>
								Copy request ID
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => {
									toast.promise(handleRetry.mutateAsync({ id: request.id }), {
										success: "Retried action",
										loading: "Sending retry request...",
										error: "There was an error, please try again",
									})
								}}
							>
								Resend
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			},
		}),
	] as ColumnDef<Column>[]

const ResponseTooltipContent = ({ res }: { res: TBResponse }) => {
	const hazelDelay = calcDiffInMillis(new Date(res.received_at), new Date(res.send_at))
	const responseDelay = calcDiffInMillis(new Date(res.received_at), new Date(res.response_at))
	return (
		<div className="flex flex-col gap-4">
			<h5 className="text-base font-bold">{res.id}</h5>

			<ListItem name="Status" description={<StatusCodeBadge statusCode={res.status} />} />
			<ListItem
				name="Added Hazel Delay"
				description={<Badge variant={getVariantForLatency(hazelDelay)}>{hazelDelay}ms</Badge>}
			/>
			<ListItem
				name="Response Time"
				description={<Badge variant={getVariantForLatency(responseDelay)}>{responseDelay}ms</Badge>}
			/>
			<Separator />
			<p className="text-sm text-muted-foreground">
				{formatDistanceToNow(new Date(res.response_at), { addSuffix: true })}
			</p>
		</div>
	)
}
