import { Container } from "@hazel/ui/container"

import { auth } from "@/lib/auth"
import { UserUpdateForm } from "@/components/forms/user/user-update-form"
import { Card } from "@hazel/ui/card"
import { AvatarUpload } from "../components/AvatarUpload"
import { updateUserProfileImageAction } from "@/server/actions/user"

const SettingsPage = async () => {
	const { userId, user } = await auth()

	return (
		<Container>
			<div>
				<h1 className="text-3xl font-bold">Personal Settings</h1>
				<p className="text-lg">Change your personal settings</p>
			</div>

			<Card className="space-y-6 p-6">
				<AvatarUpload placeholder={user.name!} action={updateUserProfileImageAction} image={user.profileImage!}>
					Profile Image
				</AvatarUpload>
				<UserUpdateForm userId={userId} defaultValues={user as any} />
			</Card>
		</Container>
	)
}

export default SettingsPage
