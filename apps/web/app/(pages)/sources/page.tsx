import Link from "next/link"
import { getSources } from "db/src/orm/source"
import { PlusIcon } from "lucide-react"

import { appConfig } from "@/lib/config"
import db from "@/lib/db"
import { buttonVariants } from "@/components/ui/button"

import { columns } from "./columns"
import { DataTable } from "./data-table"

const SourcePage = async () => {
	const sources = await getSources({ customerId: appConfig.devUser, db: db })
	return (
		<main className="p-4">
			<div className="flex flex-row justify-between mb-4">
				<h3 className="text-xl font-semibold">Sources</h3>
				<Link href="/source/new" className={buttonVariants()}>
					<PlusIcon className="mr-2" />
					New Source
				</Link>
			</div>
			<DataTable columns={columns} data={sources} />
		</main>
	)
}

export default SourcePage
