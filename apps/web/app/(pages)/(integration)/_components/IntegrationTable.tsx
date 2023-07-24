"use client"

import { DataTable } from "@/components/ui/data-table"
import { deleteIntegrationAction, updateIntegrationAction } from "@/server/actions/integrations"
import { columns } from "@/app/(pages)/(integration)/integrations/columns"
import { IntegrationToolColumn } from "@/app/(pages)/(integration)/integrations/page"

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
