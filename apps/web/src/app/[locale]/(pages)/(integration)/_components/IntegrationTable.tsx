"use client"

import { deleteIntegrationAction, updateIntegrationAction } from "@/server/actions/integrations"
import { columns } from "@/app/[locale]/(pages)/(integration)/integrations/columns"
import { IntegrationToolColumn } from "@/app/[locale]/(pages)/(integration)/integrations/page"

import { SimpleDataTable } from "@hazel/ui/data-table"

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
		<SimpleDataTable
			disableRedirect
			rootPath="/integrations"
			columns={columns(deleteAction, updateAction)}
			data={integrations}
		/>
	)
}
