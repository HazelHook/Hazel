import { updateOrganizationProfileImageAction } from "@/server/actions/organization"
import { auth } from "@/lib/auth"
import { OrganizationUpdateForm } from "@/components/forms/organization/OrganizationUpdateForm"

import { Card } from "@hazel/ui/card"
import { Container } from "@hazel/ui/container"

import { AvatarUpload } from "./components/avatar-upload"
import { CopyButton } from "@/components/copy-button"
import { Heading } from "@hazel/ui/heading"
import { Button } from "@hazel/ui/button"

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
			<Card className="space-y-6 p-6">
				<div>
					<Heading type={3}>Workspace Verifycation Secret Key</Heading>
					<p className="text-muted-foreground">This Secret Key is required to verify your Hazel Webhooks</p>
				</div>

				<CopyButton value={organization.secretKey} />

				<Button variant="destructive">Regenerate</Button>
			</Card>
		</Container>
	)
}

export const runtime = "edge"

export default SettingsPage
