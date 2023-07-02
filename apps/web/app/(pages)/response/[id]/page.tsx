import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode, Suspense } from "react"

import { Code } from "bright"
import { ExpandableList } from "@/app/(pages)/response/[id]/ExpandableList"

const ListItem = ({ name, description }: { name: string; description: ReactNode | string }) => {
	return (
		<div className="flex flex-row justify-between max-w-[250px]">
			<p className="text-muted-foreground">{name}</p>
			<p>{description}</p>
		</div>
	)
}

const ResponsePage = () => {
	return (
		<div className="p-6 container space-y-4">
			<h1 className="text-2xl">Reponse ID HERE</h1>
			<Card>
				<CardContent className="pt-6">
					<div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
						<ListItem name="Source" description={"Source Name"} />
						<ListItem name="Destination" description={"Dest Name"} />
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
						<ListItem name="Response Type" description={"JSON"} />
					</div>
				</CardContent>
			</Card>
			<Suspense>
				<ExpandableList
					title="Headers"
					maxItems={1}
					items={[
						{ title: "Test", description: "JSON/XML" },
						{ title: "Test", description: "JSON/XML" },
					]}
				/>
			</Suspense>
			<Card>
				<CardHeader>
					<CardTitle>Body</CardTitle>
				</CardHeader>
				<CardContent>
					<Suspense>
						<Code lang="json">{"{ name: 'WOW'}"}</Code>
					</Suspense>
				</CardContent>
			</Card>
		</div>
	)
}

export default ResponsePage
