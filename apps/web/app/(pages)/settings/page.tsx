import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { ApiKeyForm } from "./_form"
import { createApiKeyAction } from "./_actions"

const SettingsPage = async () => {
	const { userId } = auth()

	const apiKeys = await db.api.getMany({ customerId: userId })
	return (
		<div className="container">
			{apiKeys.map((key) => (
				<p key={key.publicId}>{key.publicId}</p>
			))}
			<p>Create API KEY</p>

			<ApiKeyForm customerId={userId} createAction={createApiKeyAction} />
		</div>
	)
}

export default SettingsPage
