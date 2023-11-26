import { ReactNode, Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { TBRequest } from "@hazel/tinybird"
import { Badge } from "@hazel/ui/badge"
import { Button } from "@hazel/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@hazel/ui/card"
import { ExpandableList } from "@hazel/ui/expandable-list"
import { Code } from "bright"

import { auth } from "@/lib/auth"
import { getCachedDestination, getCachedSource } from "@/lib/orm"
import tiny from "@hazel/tinybird"
import { jsonToArray } from "@/lib/utils"
import { Status } from "@/components/status"

const ListItem = ({
	name,
	description,
}: {
	name: string
	description: ReactNode | string
}) => {
	return (
		<div className="flex flex-row justify-between max-w-[250px]">
			<p className="text-muted-foreground">{name}</p>
			<p>{description}</p>
		</div>
	)
}

interface ResponsePageProps {
	params: {
		id: string
	}
}

const RequestLink = async ({
	request,
}: {
	request: Promise<{ data: TBRequest[] }>
}) => {
	const res = await request

	const req = res.data[0]

	return (
		<Link href={`/request/${req?.id}`}>
			<Button variant="link">
				{req?.id}
				<Badge className="ml-3">
					{Intl.DateTimeFormat("en", {
						day: "numeric",
						month: "numeric",
						year: "numeric",
						minute: "2-digit",
						hour: "2-digit",
						second: "2-digit",
					}).format(new Date(req.timestamp))}
				</Badge>
			</Button>
		</Link>
	)
}

const ResponsePage = async ({ params }: ResponsePageProps) => {
	const { workspaceId } = await auth()

	const { data } = await tiny.response.get({
		workspace_id: workspaceId,
		response_id: params.id,
		destination_id: undefined, // TODO
		source_id: undefined,
		request_id: undefined,
	})

	console.log(data)

	if (data.length === 0) {
		notFound()
	}

	const res = data[0]

	const req = tiny.request.get({
		workspace_id: workspaceId,
		request_id: res.request_id,
	})

	const source = await getCachedSource({ publicId: res.source_id, workspaceId })
	const destination = await getCachedDestination({
		publicId: res.destination_id,
	})

	const headers = JSON.parse(res.headers)

	return (
		<div className="p-6 container space-y-4">
			<div className="flex flex-row gap-2 items-center">
				<Status status={res.success ? "success" : "error"} />

				<h1 className="text-2xl uppercase">{res.id}</h1>
			</div>
			<Card>
				<CardContent className="pt-6">
					<div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
						<ListItem
							name="Source"
							description={
								<Link href={`/source/${res.source_id}`}>
									<Button size="xs" variant="link">
										{source?.name}
									</Button>
								</Link>
							}
						/>
						<ListItem
							name="Destination"
							description={
								<Link href={`/destination/${res.destination_id}`}>
									<Button size="xs" variant="link">
										{destination.name}
									</Button>
								</Link>
							}
						/>
						<ListItem
							name="Received"
							description={Intl.DateTimeFormat("en", {
								year: "numeric",
								month: "numeric",
								day: "numeric",
								hour: "numeric",
								minute: "numeric",
								second: "numeric",
							}).format(new Date(res.received_at))}
						/>
						<ListItem
							name="Added Hazel Latency"
							description={`${new Date(res.send_at).getTime() - new Date(res.received_at).getTime()}ms`}
						/>

						<ListItem name="Status" description={res.status} />
						<ListItem
							name="Your API Latency"
							description={`${new Date(res.response_at).getTime() - new Date(res.send_at).getTime()}ms`}
						/>
					</div>
				</CardContent>
			</Card>
			<Suspense>
				<ExpandableList title="Headers" maxItems={3} items={jsonToArray(headers)} />
			</Suspense>
			<Card>
				<CardHeader>
					<CardTitle>Response Body</CardTitle>
				</CardHeader>
				<CardContent>
					<Suspense>
						<Code lang="json">{res.body}</Code>
					</Suspense>
				</CardContent>
			</Card>
			<Suspense>
				<Card>
					<CardHeader>
						<CardTitle>Request</CardTitle>
					</CardHeader>
					<CardContent>
						<RequestLink request={req} />
					</CardContent>
				</Card>
			</Suspense>
		</div>
	)
}

export const runtime = "edge"

export default ResponsePage
