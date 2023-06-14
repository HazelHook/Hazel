import { appConfig } from "@/lib/config"
import db from "@/lib/db"
import { getSources } from "db/src/orm/source"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

const SourcePage = async () => {
	const sources = await getSources({ customerId: appConfig.devUser, db: db })
	return (
		<main className="p-4">
			<div className="flex flex-row justify-between mb-4">
				<h3 className="text-xl font-semibold">Sources</h3>
				<Button>
					<PlusIcon className="mr-2" />
					New Source
				</Button>
			</div>
			<DataTable columns={columns} data={sources} />
		</main>
	)
}

export default SourcePage
