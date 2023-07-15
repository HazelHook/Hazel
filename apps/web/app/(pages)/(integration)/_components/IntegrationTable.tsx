"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/app/(pages)/(integration)/integrations/columns"
import { IntegrationToolColumn } from "@/app/(pages)/(integration)/integrations/page"
import { deleteIntegrationAction, updateIntegrationAction } from "@/app/(pages)/(integration)/integrations/_actions"

export const IntegrationsTable = ({
	integrations,
	updateAction,
	deleteAction,
}: {
	integrations: IntegrationToolColumn[]
	updateAction: typeof updateIntegrationAction
	deleteAction: typeof deleteIntegrationAction
}) => {
	return (
		<>
			<DataTable
				disableRedirect
				rootPath="/integrations"
				columns={columns(deleteAction, updateAction)}
				data={integrations as any}
			/>
		</>
	)
}
