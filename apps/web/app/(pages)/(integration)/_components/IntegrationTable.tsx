"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/app/(pages)/(integration)/integrations/columns"
import { IntegrationToolColumn } from "@/app/(pages)/(integration)/integrations/page"
import { useAction } from "@/server/client"
import { deleteIntegrationAction } from "@/app/(pages)/(integration)/integrations/_actions"
import { useRouter } from "next/navigation"

export const IntegrationsTable = ({
    integrations
}: {
    integrations: IntegrationToolColumn[]
}) => {
	const router = useRouter()
	const deleteIntegration = useAction(deleteIntegrationAction, {
		onSuccess(data) {}, // TODO
		onError(error) {}, // TODO
	})

	return (
        <>
			
        	<DataTable disableRedirect rootPath="/integrations" columns={columns(deleteIntegration, router)} data={integrations as any} />
        </> 
	)
}

