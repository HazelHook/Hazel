import React, { memo, useState } from "react"
import { Position } from "reactflow"

import { Card, CardFooter } from "@/components/ui/card"
import { Handle } from "../base/Handle"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ChainIcon } from "@/components/icons/pika/chain"
import { CopyButton } from "@/components/CopyButton"
import { dashboardNumberFormatter } from "@/lib/formatters"
import { GitCommitIcon } from "@/components/icons/pika/gitCommit"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader } from "../../sheet"
import { Source } from "db/src/schema"
import { format, formatDistance, formatRelative } from "date-fns"
import { Input } from "../../input"
import { FormLabel } from "../../form"
import { Label } from "../../label"
import { Button } from "../../button"

interface DefaultNode {
	data: {
		stats: {
			day: number
			month: number
		}
		source: Source
		url: string
	}
}

export const SourceNode = memo(({ data }: DefaultNode) => {
	const [open, setOpen] = useState(false)
	return (
		<>
			<Card>
				<div className="py-1 px-2 flex flex-row justify-between items-center gap-4">
					<div className="flex flex-row gap-2 justify-center items-center">
						<GitCommitIcon className="w-4 h-4" />
						<p className="text-sm text-muted-foreground">Source</p>
					</div>
					<div className={cn("bg-green-500", "relative inline-flex h-3 w-3 rounded-full")} />
				</div>
				<Separator />

				{/* rome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div className="p-2 flex flex-col gap-4 cursor-pointer" onClick={() => setOpen(true)}>
					<div>
						<p className="text-xs text-muted-foreground">Name</p>
						<p className="text-sm">{data.source.name}</p>
					</div>
					<div className="flex flex-row justify-between gap-4">
						<div>
							<p className="text-xs text-muted-foreground">Last 24h</p>
							<p className="text-sm">{dashboardNumberFormatter().format(data.stats.day)}</p>
						</div>
						<div>
							<p className="text-xs text-muted-foreground">30d</p>
							<p className="text-sm">{dashboardNumberFormatter().format(data.stats.month)}</p>
						</div>
					</div>
				</div>

				<Separator />

				<CardFooter className="p-2">
					<CopyButton value={data.url}>
						<p className="text-xs">Copy Webhook Url</p>
					</CopyButton>
				</CardFooter>
				<Handle type="source" position={Position.Right} />
			</Card>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent className="space-y-6">
					<SheetHeader className="space-y-6">
						<div>
							<div className="flex flex-row items-center">
								<GitCommitIcon className="text-primary w-5 h-5 mr-2" />
								<p className="text-muted-foreground">Source</p>
							</div>
							<h2 className="text-xl font-semibold">{data.source.name}</h2>
						</div>

						<div className="w-full flex flex-col items-start gap-2">
							<div className="flex flex-row gap-2 items-center">
								<p className="text-muted-foreground text-sm w-24">ID</p>
								<p>{data.source.publicId}</p>
							</div>
							<div className="flex flex-row gap-2 items-center">
								<p className="text-muted-foreground text-sm w-24">Status</p>
								<div className="flex flex-row gap-2 items-center">
									<div className={cn("bg-green-500", "relative inline-flex h-3 w-3 rounded")} />
									<p>Working</p>
								</div>
							</div>
							<div className="flex flex-row gap-2 items-center">
								<p className="text-muted-foreground text-sm w-24">Last Update</p>
								<p>{formatDistance(new Date(data.source.updatedAt), new Date())}</p>
							</div>
							<div className="flex flex-row gap-2 items-center">
								<p className="text-muted-foreground text-sm w-24">Created</p>
								<p>{format(new Date(data.source.updatedAt), "dd/MM/yyyy'")}</p>
							</div>
						</div>
					</SheetHeader>

					<Separator />

					<div className="space-y-4">
						<div>
							<p className="text-foreground text-lg font-medium">Verification</p>
							<p className="text-sm text-muted-foreground">
								Verify the origin of your webhook by assigning a host or use one of our integrations for your provider
							</p>
						</div>

						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="host" className="text-right">
									Host
								</Label>
								<Input id="host" value={data.source.url} className="col-span-3" />
							</div>
							<div className="flex flex-row items-center gap-2">
								<Separator className="w-1/2" />
								<p className="flex-grow w-full text-xs text-muted-foreground">OR</p>
								<Separator className="w-full" />
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Button className="col-span-3" variant="default">
									Connect Provider
								</Button>
								<Button className="col-span-1" variant="outline">
									Custom
								</Button>
							</div>
						</div>
					</div>

					<SheetFooter>
						<Button variant="link">View Details</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</>
	)
})