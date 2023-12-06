import Link from "next/link"
import { notFound } from "next/navigation"

import { auth } from "@/lib/auth"

import { db } from "@hazel/db"
import { buttonVariants } from "@hazel/ui/button"
import { Container } from "@hazel/ui/container"
import { SimpleDataTable } from "@hazel/ui/data-table"

import { columns } from "./columns"
import { IconPlus } from "@tabler/icons-react"

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
					<IconPlus className="mr-2" />
					New Source
				</Link>
			</div>
			<SimpleDataTable rootPath="/source" columns={columns} data={sources} />
		</Container>
	)
}

export const runtime = "edge"

export default SourcePage
