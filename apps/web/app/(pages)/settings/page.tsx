import { auth } from "@/lib/auth"

import { Container } from "@/components/ui/container"
import { OrganizationUpdateForm } from "@/components/forms/organization/OrganizationUpdateForm"

const SettingsPage = async () => {
	const { workspaceId, organization } = await auth()

	return (
		<Container>
			<div>
				<h1 className="text-3xl font-bold">Settings</h1>
				<p className="text-lg">Configure general settings for your instance</p>
			</div>

			<OrganizationUpdateForm
				defaultValues={{ name: organization.name, slug: organization.slug }}
				pOrgId={workspaceId}
			/>
		</Container>
	)
}

export default SettingsPage
