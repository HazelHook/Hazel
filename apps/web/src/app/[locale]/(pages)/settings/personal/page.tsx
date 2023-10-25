import { Container } from "@hazel/ui/container"

import { auth } from "@/lib/auth"
import { UserUpdateForm } from "@/components/forms/user/user-update-form"
import { TextField } from "@hazel/ui/text-field"
import { ImageUploadInput } from "@hazel/ui/image-upload-input"
import { AvatarUpload } from "./component/AvatarUpload"

const SettingsPage = async () => {
	const { workspaceId, organization, userId, user } = await auth()

	return (
		<Container>
			<div>
				<h1 className="text-3xl font-bold">Personal Settings</h1>
				<p className="text-lg">Change your personal settings</p>
			</div>

			<UserUpdateForm userId={userId} defaultValues={user as any} />

			<AvatarUpload image={user.profileImage!} />
		</Container>
	)
}

export default SettingsPage
