import { ReactNode, Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { auth } from "@/lib/auth"
import { getCachedSource } from "@/lib/orm"
import { capitalizeFirstLetter, getVariantForLatency, jsonToArray } from "@/lib/utils"
import { Status } from "@/components/status"

import tiny from "@hazel/tinybird"
import { Await } from "@hazel/ui/await"
import { Button, buttonVariants } from "@hazel/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@hazel/ui/card"
import { ExpandableList } from "@hazel/ui/expandable-list"
import { Code } from "bright"
import { formatCode } from "@/lib/formatters"
import { SourceIcon } from "@/components/source-icon"
import { ListItem } from "../../../_component/list-item"
import { Badge } from "@hazel/ui/badge"

Code.theme = "material-palenight"

interface ResponsePageProps {
	params: {
		id: string
	}
}

const ResponsePage = async ({ params }: ResponsePageProps) => {
	const { workspaceId } = await auth()

	const { data } = await tiny.request.get({
		request_id: params.id,
		workspace_id: workspaceId,
	})

	const req = data[0]

	if (!req) {
		notFound()
	}

	const { data: resData } = await tiny.response.get({
		workspace_id: workspaceId,
		request_id: params.id,
	})

	const firstRes = resData[0]

	// TODO: ADD ACCEPETED/REJECTED TO TINYBIRD => Wasnt valid

	const headers = JSON.parse(req.headers)
	const source = getCachedSource({ publicId: req.source_id, workspaceId })

	const addedHazelLatency = new Date(firstRes.send_at).getTime() - new Date(firstRes.received_at).getTime()

	return (
		<div className="p-6 container space-y-4">
			<div className="flex flex-row gap-2 items-center">
				<Status status={req.rejected ? "error" : "success"} />

				<h1 className="text-2xl uppercase">{req.id}</h1>
			</div>
			<Card>
				<CardContent className="pt-6">
					<div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
						<ListItem
							name="Source"
							description={
								<Await promise={source}>
									{(data) => (
										<Link
											className={buttonVariants({
												variant: "link",
												size: "none",
												className: "flex items-center gap-1",
											})}
											href={`/source/${req.source_id}`}
										>
											<SourceIcon slug={data?.integration?.tool} className="w-5 h-5" />

											{data?.name}
										</Link>
									)}
								</Await>
							}
						/>
						<ListItem
							name="Status"
							description={
								<Badge variant={req.rejected ? "destructive" : "success"}>
									{req.rejected ? "Rejected" : "Accepted"}
								</Badge>
							}
						/>
						<ListItem name="Created Events" description={resData.length} />

						<ListItem
							name="Received"
							description={Intl.DateTimeFormat("en", {
								year: "numeric",
								month: "numeric",
								day: "numeric",
								hour: "numeric",
								minute: "numeric",
								second: "numeric",
							}).format(new Date(req.timestamp))}
						/>
						<ListItem
							name="Added Hazel Latency"
							description={
								<Badge variant={getVariantForLatency(addedHazelLatency)}>{addedHazelLatency}ms</Badge>
							}
						/>
						<ListItem
							name="Verified"
							description={
								<Badge variant={req.validated ? "success" : "destructive"}>
									{capitalizeFirstLetter(String(!!req.validated))}
								</Badge>
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
					<CardTitle>Body</CardTitle>
				</CardHeader>
				<CardContent>
					<Suspense>
						<Code lang="json">{formatCode(req.body, "json")}</Code>
					</Suspense>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Events</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-2">
						<Suspense>
							{resData.map((res) => (
								<Link href={`/response/${res.id}`} key={res.id}>
									<div className="flex flex-row items-center">
										<Status size={4} status={res.success ? "success" : "error"} />
										<Button variant="link" className="uppercase">
											{res.id}
										</Button>
									</div>
								</Link>
							))}
						</Suspense>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

// export const runtime = "edge"

export default ResponsePage
