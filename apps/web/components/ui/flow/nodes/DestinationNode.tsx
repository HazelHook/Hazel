import React, { memo, useState } from "react"
import { format, formatDistance } from "date-fns"
import { Destination } from "db/src/schema"
import { Position } from "reactflow"

import { dashboardNumberFormatter } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import { Card, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CopyButton } from "@/components/CopyButton"
import { AutomationIcon } from "@/components/icons/pika/automation"

import { Button } from "../../button"
import { Input } from "../../input"
import { Label } from "../../label"
import { Sheet, SheetContent, SheetFooter, SheetHeader } from "../../sheet"
import { Handle } from "../base/Handle"

interface DefaultNode {
	data: {
		stats: {
			day: number
			month: number
		}
		destination: Destination
	}
}

export const DestinationNode = memo(({ data }: DefaultNode) => {
	const [open, setOpen] = useState(false)

	return (
		<>
			<Card>
				<div className="py-1 px-2 flex flex-row justify-between items-center gap-4">
					<div className="flex flex-row gap-2 justify-center items-center">
						<AutomationIcon className="w-4 h-4" />
						<p className="text-sm text-muted-foreground">Destination</p>
					</div>
					<div className={cn("bg-green-500", "relative inline-flex h-3 w-3 rounded-full")} />
				</div>
				<Separator />

				{/* rome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div className="p-2 flex flex-col gap-4" onClick={() => setOpen(true)}>
					<div>
						<p className="text-xs text-muted-foreground">Name</p>
						<p className="text-sm">{data.destination.name}</p>
					</div>

					<div className="flex flex-row justify-between gap-4">
						<div>
							<p className="text-xs text-muted-foreground">Errors</p>
							<p className="text-sm">{dashboardNumberFormatter().format(data.stats.day)}</p>
						</div>
						<div>
							<p className="text-xs text-muted-foreground">Retries</p>
							<p className="text-sm">{dashboardNumberFormatter().format(data.stats.month)}</p>
						</div>
					</div>
				</div>

				<Separator />

				<CardFooter className="p-2">
					<CopyButton value={data.destination.url}>
						<p className="text-xs">Copy Target Url</p>
					</CopyButton>
				</CardFooter>
				<Handle type="target" position={Position.Left} />
			</Card>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent className="space-y-6">
					<SheetHeader className="space-y-6">
						<div>
							<div className="flex flex-row items-center">
								<AutomationIcon className="text-primary w-5 h-5 mr-2" />
								<p className="text-muted-foreground">Destination</p>
							</div>
							<h2 className="text-xl font-semibold">{data.destination.name}</h2>
						</div>

						<div className="w-full flex flex-col items-start gap-2">
							<div className="flex flex-row gap-2 items-center">
								<p className="text-muted-foreground text-sm w-24">ID</p>
								<p>{data.destination.publicId}</p>
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
								<p>{formatDistance(new Date(data.destination.updatedAt), new Date())}</p>
							</div>
							<div className="flex flex-row gap-2 items-center">
								<p className="text-muted-foreground text-sm w-24">Created</p>
								<p>{format(new Date(data.destination.updatedAt), "dd/MM/yyyy'")}</p>
							</div>
						</div>
					</SheetHeader>

					<Separator />

					<div className="space-y-4">
						<div>
							<p className="text-foreground text-lg font-medium">Settings</p>
							<p className="text-sm text-muted-foreground">
								Settings to enhance your webhook and make it work with your backend
							</p>
						</div>

						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="url" className="text-right">
									Target Url
								</Label>
								<Input id="url" value={data.destination.url} className="col-span-3" />
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
