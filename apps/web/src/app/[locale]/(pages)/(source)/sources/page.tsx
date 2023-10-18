import Link from "next/link"
import { notFound } from "next/navigation"
import { buttonVariants } from "@hazel/ui/button"
import { Container } from "@hazel/ui/container"
import { DataTable } from "@hazel/ui/data-table"

import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { AddIcon } from "@hazel/icons"

import { columns } from "./columns"

const SourcePage = async () => {
	const { workspaceId } = await auth()

	const sources = await db.source.getMany({ workspaceId })

	if (!sources) {
		notFound()
	}

	return (
		<Container>
			<div className="flex flex-row justify-between p-1">
				<h3 className="text-xl font-semibold">Sources</h3>
				<Link href="/source/new" className={buttonVariants()}>
					<AddIcon className="mr-2" />
					New Source
				</Link>
			</div>
			<DataTable rootPath="/source" columns={columns as any} data={sources} />
		</Container>
	)
}

// export const runtime = "edge"

export default SourcePage
