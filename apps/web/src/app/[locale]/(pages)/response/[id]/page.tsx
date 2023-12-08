import { ReactNode, Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { auth } from "@/lib/auth"
import { getCachedDestination, getCachedSource } from "@/lib/orm"
import { getVariantForLatency, jsonToArray } from "@/lib/utils"
import { Status } from "@/components/status"

import tiny, { TBRequest } from "@hazel/tinybird"
import { Badge } from "@hazel/ui/badge"
import { Button, buttonVariants } from "@hazel/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@hazel/ui/card"
import { ExpandableList } from "@hazel/ui/expandable-list"
import { Code } from "bright"
import { formatCode } from "@/lib/formatters"
import { Await } from "@hazel/ui/await"
import { SourceIcon } from "@/components/source-icon"
import { Spinner } from "@hazel/ui/spinner"
import { StatusCodeBadge } from "@/components/status-code-badge"
import { ListItem } from "../../_component/list-item"

Code.theme = "poimandres"

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
	})

	if (data.length === 0) {
		notFound()
	}

	const res = data[0]

	const req = tiny.request.get({
		workspace_id: workspaceId,
		request_id: res.request_id,
	})

	const source = getCachedSource({
		publicId: res.source_id,
		workspaceId,
	})
	const destination = await getCachedDestination({
		publicId: res.destination_id,
	})

	const headers = JSON.parse(res.headers)

	const addedHazelLatency = new Date(res.send_at).getTime() - new Date(res.received_at).getTime()
	const destinationLatency = new Date(res.response_at).getTime() - new Date(res.send_at).getTime()

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
								<Await promise={source} fallback={<Spinner />}>
									{(data) => (
										<Link
											className={buttonVariants({
												variant: "link",
												size: "none",
												className: "flex items-center gap-1",
											})}
											href={`/source/${res.source_id}`}
										>
											<SourceIcon slug={data?.integration?.tool} className="w-5 h-5" />

											{data?.name}
										</Link>
									)}
								</Await>
							}
						/>
						<ListItem
							name="Destination"
							description={
								<Link
									className={buttonVariants({
										variant: "link",
										size: "none",
									})}
									href={`/destination/${res.destination_id}`}
								>
									{destination.name}
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
							description={
								<Badge variant={getVariantForLatency(addedHazelLatency)}>{addedHazelLatency}ms</Badge>
							}
						/>

						<ListItem name="Status" description={<StatusCodeBadge statusCode={res.status} />} />
						<ListItem
							name="Your API Latency"
							description={
								<Badge variant={getVariantForLatency(destinationLatency)}>{destinationLatency}ms</Badge>
							}
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
						<Code lang="json">{formatCode(res.body, "json")}</Code>
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
