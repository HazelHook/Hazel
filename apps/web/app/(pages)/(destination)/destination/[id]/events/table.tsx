"use client"

import { columns } from "@/app/(pages)/(destination)/destination/[id]/events/column"
import { EventDataRowType } from "@/app/(pages)/(destination)/destination/[id]/events/page"
import { DataTable } from "@/components/DataTable"
import { CacheDestination } from "@/lib/orm"
import { ReactNode } from "react"

export const TableWrapper = ({
	data,
	maxItems,
	destination,
}: { data: EventDataRowType; maxItems: number; destination: CacheDestination }) => {
	return (
		<DataTable
			columns={columns}
			data={data}
			maxItems={maxItems}
			// renderSheet={(data) => <TableSheet data={data}  />}
		/>
	)
}

const ListItem = ({ name, description }: { name: string; description: ReactNode | string }) => {
	return (
		<div className="flex flex-row justify-between max-w-[250px]">
			<p className="text-muted-foreground">{name}</p>
			<p>{description}</p>
		</div>
	)
}

// const TableSheet = ({ data, destination }: { data: EventDataRowType[]; destination: CacheDestination }) => {
// 	const successfulResponses = data.filter((r) => r.success)
// 	const success = successfulResponses.length === data.length

// 	return (
// 		<div className="p-6 container space-y-4">
// 			<div className="flex flex-row gap-2 items-center">
// 				<Status status={success ? "error" : "success"} />

// 				<h1 className="text-2xl uppercase">{destination.id}</h1>
// 			</div>
// 			<Card>
// 				<CardContent className="pt-6">
// 					<div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
// 						<ListItem
// 							name="Destination"
// 							description={
// 								<Link href={`/destination/${destination.publicId}`}>
// 									<Button size="xs" variant="link">
// 										{destination.name}
// 									</Button>
// 								</Link>
// 							}
// 						/>
// 						<ListItem name="Status" description={success ? "Succeeded" : "Failed"} />
// 					</div>
// 				</CardContent>
// 			</Card>

// 			<Card>
// 				<CardHeader>
// 					<CardTitle>Body</CardTitle>
// 				</CardHeader>
// 				<CardContent>
// 					{/* <Suspense>
// 						<Code lang="json">{data.body}</Code>
// 					</Suspense> */}
// 				</CardContent>
// 			</Card>
// 			<Card>
// 				<CardHeader>
// 					<CardTitle>Events</CardTitle>
// 				</CardHeader>
// 				<CardContent>
// 					<div className="flex flex-col gap-2">
// 						{data.map((res) => (
// 							<Link href={`/response/${res.id}`}>
// 								<div className="flex flex-row items-center">
// 									<Status size={4} status={res.success ? "success" : "error"} />
// 									<Button variant="link" className="uppercase">
// 										{res.id}
// 									</Button>
// 								</div>
// 							</Link>
// 						))}
// 					</div>
// 				</CardContent>
// 			</Card>
// 		</div>
// 	)
// }
