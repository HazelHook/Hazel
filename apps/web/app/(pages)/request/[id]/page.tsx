import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode, Suspense } from "react"

import { Code } from "bright"
import { ExpandableList } from "@/components/ui/ExpandableList"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import tiny from "@/lib/tiny"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import { jsonToArray } from "@/lib/utils"

const ListItem = ({ name, description }: { name: string; description: ReactNode | string }) => {
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

const ResponsePage = async ({ params }: ResponsePageProps) => {
	const { userId } = auth()
	const { data } = await tiny.getReq({ request_id: params.id, customer_id: userId })

	if (data.length === 0) {
		notFound()
	}

	const req = data[0]

	// TODO: ADD ACCEPETED/REJECTED TO TINYBIRD => Wasnt valid

	const headers = JSON.parse(req.headers)

	return (
		<div className="p-6 container space-y-4">
			<div className="flex flex-row gap-2 items-center">
				<div className="h-5 w-5 bg-green-500 rounded-sm" />

				<h1 className="text-2xl uppercase">{req.request_id}</h1>
			</div>
			<Card>
				<CardContent className="pt-6">
					<div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
						<ListItem
							name="Source"
							description={
								<Link href={`/source/${"sourceID"}`}>
									<Button size="xs" variant="link">
										Source Name
									</Button>
								</Link>
							}
						/>
						<ListItem name="Status" description={"Accepted"} />
						<ListItem name="Created Events" description={"1"} />

						<ListItem
							name="Received"
							description={Intl.DateTimeFormat("en", {
								year: "numeric",
								month: "numeric",
								day: "numeric",
								hour: "numeric",
								minute: "numeric",
								second: "numeric",
							}).format(Date.now())}
						/>
						<ListItem name="Added Latency" description={"56ms"} />
						<ListItem name="Verified" description={"False"} />
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
						<Code lang="json">{req.body}</Code>
					</Suspense>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Events</CardTitle>
				</CardHeader>
				<CardContent>
					<Suspense>Events Here</Suspense>
				</CardContent>
			</Card>
		</div>
	)
}

export default ResponsePage
