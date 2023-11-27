"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { retryRequestAction } from "@/server/actions/retry"
import { calcDiffInMillis } from "@/lib/date-helpers"
import { dataTableTimestampFormatter } from "@/lib/formatters"
import { cn } from "@/lib/utils"

import type { Destination, Source } from "@hazel/db"
import { FilterVerticalIcon } from "@hazel/icons"
import { useAction } from "@hazel/server/actions/client"
import { TBRequest, TBResponse } from "@hazel/tinybird"
import { Badge } from "@hazel/ui/badge"
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

type Column = TBRequest & {
	responses: TBResponse[]
}

const columnHelper = createColumnHelper<Column>()

export const requestColumns = (
	sources: Source[],
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
					<Link className={buttonVariants({ variant: "link", size: "none" })} href={`/source/${sourceId}`}>
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

				if (responses.length > 0) {
					return (
						<div className="flex gap-0.5 w-[100px]">
							{responses.map((res) => (
								<SimpleTooltip key={res.id} content={<ResponseTooltipContent res={res} />}>
									<Link
										href={`/response/${res.id}`}
										className={cn(
											"w-full h-6 rounded-md max-w-[12px]",
											res.success === 1 ? "bg-emerald-500" : "bg-red-500",
										)}
									/>
								</SimpleTooltip>
							))}
						</div>
					)
				}

				return (
					<Badge variant={rejected ? "destructive" : "outline"}>
						{rejected ? "Unauthorized" : "Delivering"}
					</Badge>
				)
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
								<FilterVerticalIcon className="h-4 w-4" />
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
	return (
		<div className="flex flex-col gap-2">
			<p className="font-semibold text-base">
				{formatDistanceToNow(new Date(res.response_at), { addSuffix: true })}
			</p>
			<div className="flex flex-row gap-2 items-center">
				<p className="font-semibold text-base">Status </p>
				<p className="text-sm">{res.status}</p>
			</div>
			<div className="flex flex-row gap-2 items-center">
				<p className="font-semibold text-base">Hazel Delay</p>
				<p className="text-sm">
					{calcDiffInMillis(new Date(res.received_at), new Date(res.send_at))}
					ms
				</p>
			</div>
			<div className="flex flex-row gap-2 items-center">
				<p className="font-semibold text-base">Response Time</p>
				<p className="text-sm">
					{calcDiffInMillis(new Date(res.received_at), new Date(res.response_at))}
					ms
				</p>
			</div>
		</div>
	)
}
