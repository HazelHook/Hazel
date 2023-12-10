import { updateOrganizationProfileImageAction } from "@/server/actions/organization"
import { auth } from "@/lib/auth"
import { OrganizationUpdateForm } from "@/components/forms/organization/OrganizationUpdateForm"

import { Card } from "@hazel/ui/card"
import { Container } from "@hazel/ui/container"

import { AvatarUpload } from "./components/avatar-upload"

const SettingsPage = async () => {
	const { workspaceId, organization } = await auth()

	return (
		<Container>
			<div>
				<h1 className="text-3xl font-bold">Settings</h1>
				<p className="text-lg">Configure general settings for your instance</p>
			</div>
			<Card className="space-y-6 p-6">
				<AvatarUpload
					generatedImgId={organization.publicId}
					action={updateOrganizationProfileImageAction}
					imageUrl={organization.profileImage}
				>
					Organization Image
				</AvatarUpload>
				<OrganizationUpdateForm defaultValues={{ name: organization.name }} pOrgId={workspaceId} />
			</Card>
		</Container>
	)
}

// export const runtime = "edge"

export default SettingsPage
