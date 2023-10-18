import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import configuration from "@/configuration"
import { Card } from "@hazel/ui/card"
import { Container } from "@hazel/ui/container"

import { switchOrganizationAction } from "@/server/actions/organization"
import db from "@/lib/db"
import requireSession from "@/lib/user/require-session"
import { getSeededProfileImageUrl } from "@/lib/utils"

import { CreateOrg } from "./components/CreateOrg"
import { OrgButton } from "./components/org-button"
import { getSupabaseServerClient } from "@hazel/supabase/clients"

async function OrganizationsPage() {
	const client = getSupabaseServerClient()
	const session = await requireSession(client)

	const user = await db.user.getOne({ id: session.user.id })

	if (!user || !user.onboarded) {
		redirect(configuration.paths.onboarding)
	}

	const cookiesList = cookies()

	const membershipId = cookiesList.get("membership_id")?.value

	if (membershipId) {
		const currOrg = await db.organization.memberships.getOne({ membershipId })

		if (currOrg) {
			redirect(configuration.paths.home)
		}
	}

	const memberships = await db.organization.memberships.getMany({
		customerId: user.id,
	})

	if (memberships.length === 1) {
		const organization = memberships[0].organization

		await switchOrganizationAction({ publicId: organization.publicId })

		return redirect(configuration.paths.home)
	}

	return (
		<Container>
			<div className="h-full w-full flex justify-center items-center">
				<Card className={"w-[300px]"}>
					{memberships.map((membership) => {
						return (
							<OrgButton
								key={membership.publicId}
								switchTeamAction={switchOrganizationAction}
								avatarUrl={getSeededProfileImageUrl(membership.organization.publicId)}
								name={membership.organization.name}
								membershipId={membership.publicId}
								role="TODO"
							/>
						)
					})}
					<CreateOrg />
				</Card>
			</div>
		</Container>
	)
}

export default OrganizationsPage
