import { auth } from "@/lib/auth"
import db from "@/lib/db"

import { createApiKeyAction } from "@/server/actions/api-keys"
import { ApiKeyModal } from "./modal"

const ApiKeyPage = async () => {
	const { workspaceId } = await auth()

	const apiKeys = await db.api.getMany({ workspaceId: workspaceId })

	return (
		<div className="container">
			{apiKeys.map((key) => (
				<p key={key.publicId}>{key.publicId}</p>
			))}
			<p>Create API KEY</p>

			<ApiKeyModal workspaceId={workspaceId} createAction={createApiKeyAction} />
		</div>
	)
}

export default ApiKeyPage
