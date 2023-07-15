import Link from "next/link"
import { notFound } from "next/navigation"

import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { buttonVariants } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { AddIcon } from "@/components/icons/pika/add"

import { columns } from "./columns"
import { Container } from "@/components/ui/container"

const SourcePage = async () => {
	const { userId } = auth()

	const sources = await db.source.getMany({ customerId: userId })

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

export const runtime = "edge"

export default SourcePage
