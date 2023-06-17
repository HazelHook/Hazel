import { notFound, redirect } from "next/navigation"
import { auth } from "@clerk/nextjs"
import { getSource } from "db/src/orm/source"

import db from "@/lib/db"
import { buttonVariants } from "@/components/ui/button"

const SourcePage = async ({
	params,
}: {
	params: {
		id: string
	}
}) => {
	const source = await getSource({ publicId: params.id, db })

	const { userId } = auth()

	if (!source) {
		notFound()
	}

	// if (source.customerId !== userId) {
	// 	redirect("/")
	// }

	return (
		<main className="p-4">
			<div className="flex flex-row justify-between mb-4">
				<div>
					<h3 className="text-xl font-semibold">Source</h3>
					<h4 className="text-lg text-muted-foreground">{source.name}</h4>
				</div>
				<div className={buttonVariants()}>Add Destination TODO:</div>
			</div>
		</main>
	)
}

export const runtime = "edge"

export default SourcePage
