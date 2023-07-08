"use client"

import { columns } from "@/app/(pages)/(source)/source/[id]/events/column"
import { EventDataRowType } from "@/app/(pages)/(source)/source/[id]/events/page"
import { DataTable } from "@/components/DataTable"
import { Status } from "@/components/Status"
import { ExpandableList } from "@/components/ui/ExpandableList"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { CacheSource } from "@/lib/orm"
import { capitalizeFirstLetter, jsonToArray } from "@/lib/utils"
import Link from "next/link"
import { ReactNode, Suspense } from "react"

export const TableWrapper = ({
	data,
	maxItems,
	source,
}: { data: EventDataRowType[]; maxItems: number; source: CacheSource }) => {
	return (
		<DataTable
			columns={columns}
			data={data}
			maxItems={maxItems}
			renderSheet={(data) => <TableSheet data={data} source={source} />}
		/>
	)
}

const ListItem = ({ name, description }: { name: string; description: ReactNode | string }) => {
	return (
		<div className="flex flex-row justify-between">
			<p className="text-muted-foreground">{name}</p>
			<p>{description}</p>
		</div>
	)
}

const TableSheet = ({ data, source }: { data: EventDataRowType; source: CacheSource }) => {
	const successfulResponses = data.responses.filter((r) => r.success)
	const success = successfulResponses.length === data.responses.length

	const headers = JSON.parse(data.headers)

	return (
		<div>
			<SheetHeader>
				<SheetTitle>Request Overview</SheetTitle>
			</SheetHeader>

			<div className="p-6 container space-y-4 h-full w-full overflow-x-auto">
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
											{source.name}
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
								description={`${
									new Date(data.responses[0]?.send_timestamp).getTime() - new Date(data.timestamp).getTime()
								}ms`}
							/>
							<ListItem name="Verified" description={capitalizeFirstLetter(String(!!data.validated))} />
						</div>
					</CardContent>
				</Card>
				<Suspense>
					<ExpandableList title="Headers" maxItems={3} items={jsonToArray(headers)} />
				</Suspense>
				{/* <Card>
				<CardHeader>
					<CardTitle>Body</CardTitle>
				</CardHeader>
				<CardContent>
					<Suspense>
						<Code lang="json">{data.body}</Code>
					</Suspense>
				</CardContent>
			</Card> */}
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
			</div>
		</div>
	)
}
