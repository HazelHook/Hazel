import { createApiKeyAction } from "@/server/actions/api-keys"
import { auth } from "@/lib/auth"

import { db } from "@hazel/db"
import { Container } from "@hazel/ui/container"
import { PageHeader } from "@hazel/ui/page-header"

import { ApiKeyModal } from "./modal"

const ApiKeyPage = async () => {
	const { workspaceId } = await auth()

	const apiKeys = await db.apiKeys.getMany({ workspaceId: workspaceId })

	return (
		<Container>
			<PageHeader
				title="API Keys"
				subtitle="These keys are used to interact with our API, create your own flows or build your own admin panels."
			>
				<ApiKeyModal workspaceId={workspaceId} createAction={createApiKeyAction} />
			</PageHeader>

			<div className="flex flex-col gap-2">
				{apiKeys.map((key) => (
					<div className="flex flex-row gap-2 border p-4 rounded-md" key={key.publicId}>
						<p>{key.name}</p>
						<p>{key.publicId}</p>
					</div>
				))}
			</div>
		</Container>
	)
}

// export const runtime = "edge"

export default ApiKeyPage
