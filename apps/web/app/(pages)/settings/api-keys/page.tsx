import { auth } from "@/lib/auth"
import db from "@/lib/db"

import { ApiKeyForm } from "../_form"
import { createApiKeyAction } from "@/server/actions/api-keys"

const ApiKeyPage = async () => {
	const { workspaceId } = await auth()

	const apiKeys = await db.api.getMany({ workspaceId: workspaceId })

	return (
		<div className="container">
			{apiKeys.map((key) => (
				<p key={key.publicId}>{key.publicId}</p>
			))}
			<p>Create API KEY</p>

			<ApiKeyForm workspaceId={workspaceId} createAction={createApiKeyAction} />
		</div>
	)
}

export default ApiKeyPage
