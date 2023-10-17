import { auth } from "@/lib/auth"

import { Container } from "@hazel/ui/container"
import { UserUpdateForm } from "@/components/forms/user/user-update-form"

const SettingsPage = async () => {
	const { workspaceId, organization, userId, user } = await auth()

	return (
		<Container>
			<div>
				<h1 className="text-3xl font-bold">Personal Settings</h1>
				<p className="text-lg">Change your personal settings</p>
			</div>

			<UserUpdateForm userId={userId} defaultValues={user as any} />
		</Container>
	)
}

export default SettingsPage
