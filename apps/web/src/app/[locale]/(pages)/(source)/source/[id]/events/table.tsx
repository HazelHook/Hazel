"use client"

import { ReactNode, Suspense } from "react"
import Link from "next/link"
import { Button } from "@hazel/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@hazel/ui/card"
import { ExpandableList } from "@hazel/ui/expandable-list"
import { ScrollArea } from "@hazel/ui/scroll-area"
import { SheetHeader, SheetTitle } from "@hazel/ui/sheet"

import { CacheSource } from "@/lib/orm"
import { capitalizeFirstLetter, jsonToArray } from "@/lib/utils"
import { DataTable } from "@/components/data-table"
import { Status } from "@/components/status"
import { columns } from "@/app/[locale]/(pages)/(source)/source/[id]/events/column"
import { EventDataRowType } from "@/app/[locale]/(pages)/(source)/source/[id]/events/page"

export const TableWrapper = ({
	data,
	maxItems,
	source,
}: {
	data: EventDataRowType[]
	maxItems: number
	source: CacheSource
}) => {
	return (
		<DataTable
			columns={columns}
			data={data}
			maxItems={maxItems}
			renderSheet={(data) => <TableSheet data={data} source={source} />}
		/>
	)
}

const ListItem = ({
	name,
	description,
}: {
	name: string
	description: ReactNode | string
}) => {
	return (
		<div className="flex flex-row justify-between">
			<p className="text-muted-foreground">{name}</p>
			<p>{description}</p>
		</div>
	)
}

const TableSheet = ({
	data,
	source,
}: {
	data: EventDataRowType
	source: CacheSource
}) => {
	const successfulResponses = data.responses.filter((r) => r.success)
	const success = successfulResponses.length === data.responses.length

	const headers = JSON.parse(data.headers)

	const firstResponse = data.responses[0]

	return (
		<div>
			<SheetHeader>
				<SheetTitle>Request Overview</SheetTitle>
			</SheetHeader>
			<ScrollArea>
				<div className="p-6 container space-y-4 max-h-full w-full h-screen overflow-x-scroll">
					<div className="flex flex-row gap-2 items-center">
						<Status status={success ? "success" : "error"} />

						<h1 className="text-2xl uppercase">{data.id}</h1>
					</div>
					<Card>
						<CardContent className="pt-6">
							<div className="flex flex-col gap-1 w-full">
								<ListItem
									name="Source"
									description={
										<Link href={`/source/${data.source_id}`}>
											<Button size="xs" variant="link">
												{source?.name}
											</Button>
										</Link>
									}
								/>
								<ListItem name="Status" description={success ? "Succeeded" : "Failed"} />
								<ListItem name="Created Events" description={data.responses.length} />

								<ListItem
									name="Received"
									description={Intl.DateTimeFormat("en", {
										year: "numeric",
										month: "numeric",
										day: "numeric",
										hour: "numeric",
										minute: "numeric",
										second: "numeric",
									}).format(new Date(data.timestamp))}
								/>
								<ListItem
									name="Added Latency"
									description={
										firstResponse
											? `${
													new Date(firstResponse.send_at).getTime() -
													new Date(data.timestamp).getTime()
											  }ms`
											: "-"
									}
								/>
								<ListItem
									name="Verified"
									description={capitalizeFirstLetter(String(!!data.validated))}
								/>
							</div>
						</CardContent>
					</Card>
					<Suspense>
						<ExpandableList title="Headers" maxItems={3} items={jsonToArray(headers)} />
					</Suspense>
					<Card>
						<CardHeader>
							<CardTitle>Events</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col gap-2">
								{data.responses.map((res) => (
									<Link href={`/response/${res.id}`}>
										<div className="flex flex-row items-center">
											<Status size={4} status={res.success ? "success" : "error"} />
											<Button variant="link" className="uppercase">
												{res.id}
											</Button>
										</div>
									</Link>
								))}
							</div>
						</CardContent>
					</Card>
					<div className="flex flex-row justify-end">
						<Link href={`/request/${data.id}`}>
							<Button>Open Detailed</Button>
						</Link>
					</div>
					<div className="w-full h-16" />
				</div>
			</ScrollArea>
		</div>
	)
}
