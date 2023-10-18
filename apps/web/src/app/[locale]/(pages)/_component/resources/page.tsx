import Link from "next/link"
import { buttonVariants } from "@hazel/ui/button"
import { DataTable } from "@hazel/ui/data-table"

import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { AddIcon } from "@hazel/icons"

import { columns } from "./columns"

const SourcePage = async () => {
	const { workspaceId } = await auth()

	const sources = await db.source.getMany({ workspaceId })
	return (
		<main className="p-4">
			<div className="flex flex-row justify-between mb-4">
				<h3 className="text-xl font-semibold">Sources</h3>
				<Link href="/source/new" className={buttonVariants()}>
					<AddIcon className="mr-2" />
					New Source
				</Link>
			</div>
			<DataTable rootPath="/source" columns={columns} data={sources} />
		</main>
	)
}

// export const runtime = "edge"

export default SourcePage
