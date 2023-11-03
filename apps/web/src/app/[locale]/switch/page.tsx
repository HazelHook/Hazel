import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import configuration from "@hazel/utils/configuration"

import { getSupabaseServerClient } from "@hazel/supabase/clients"
import { Card } from "@hazel/ui/card"
import { Container } from "@hazel/ui/container"

import { switchOrganizationAction } from "@/server/actions/organization"
import db from "@/lib/db"
import { requireSession } from "@hazel/auth/utils"
import { getSeededProfileImageUrl } from "@/lib/utils"

import { CreateOrg } from "./components/cretae-org-modal"
import { OrgButton } from "./components/org-button"

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
		const currOrg = await db.db.query.organizationMembers.findFirst({
			where: (members, { eq, and }) => and(eq(members.publicId, membershipId), eq(members.userId, user.id)),
		})

		if (currOrg) {
			redirect(configuration.paths.home)
		}
	}

	const memberships = await db.organization.memberships.getMany({
		customerId: user.id,
	})

	// if (memberships.length === 1) {
	// 	await switchOrganizationAction({ publicId: memberships[0].publicId })

	// 	return redirect(configuration.paths.home)
	// }

	return (
		<Container>
			<div className="min-h-screen h-full w-full flex justify-center items-center">
				<Card className={"w-[300px]"}>
					{memberships.map((membership) => {
						return (
							<OrgButton
								key={membership.publicId}
								switchTeamAction={switchOrganizationAction}
								avatarUrl={getSeededProfileImageUrl(membership.organization.publicId)}
								name={membership.organization.name}
								membershipId={membership.publicId}
								role={membership.role}
							/>
						)
					})}
					<CreateOrg />
				</Card>
			</div>
		</Container>
	)
}

export const runtime = "edge"

export default OrganizationsPage
