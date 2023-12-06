import { cookies } from "next/headers"

import { createOrganzationAction, switchOrganizationAction } from "@/server/actions/organization"
import { auth } from "@/lib/auth"
import { ProfileSettings } from "@/components/profile-settings"
import { Sidebar } from "@/components/sidebar"

import { db } from "@hazel/db"
import { TooltipProvider } from "@hazel/ui/tooltip"

import { IconBook2, IconHome, IconOutlet, IconPlug, IconPlugConnected, IconSettings } from "@tabler/icons-react"

interface RootLayoutProps {
	children: React.ReactNode
	params: {
		org?: string
		slug?: string
	}
}

export default async function RootLayout({ children }: RootLayoutProps) {
	const { userId } = await auth()

	const cookiesList = cookies()

	const orgCookie = cookiesList.get("membership_id")

	const organzations = await db.organization.memberships.getMany({
		customerId: userId,
	})

	return (
		<TooltipProvider>
			<div className="flex min-h-screen flex-col">
				<div>
					<Sidebar
						items={[
							{
								items: [
									{
										title: "Overview",
										href: "/",
										icon: IconHome,
									},
									{
										title: "Webhooks",
										href: "/webhooks",
										icon: IconPlugConnected,
									},
									{
										title: "Sources",
										href: "/sources",
										icon: IconPlug,
									},
									{
										title: "Destinations",
										href: "/destinations",
										icon: IconOutlet,
									},
								],
							},
							{
								items: [
									{
										title: "Settings",
										href: "/settings",
										icon: IconSettings,
									},
									{
										title: "Documentation",
										href: "https://docs.hazel.sh",
										target: "__blank",
										icon: IconBook2,
									},
								],
							},
						]}
						className="fixed flex w-12 flex-col justify-between transition-[width] duration-300 lg:w-64"
					>
						<ProfileSettings
							switchTeamAction={switchOrganizationAction}
							createTeamAction={createOrganzationAction}
							memberships={organzations}
							currentMembershipId={orgCookie?.value}
						/>
					</Sidebar>
					<div className="col-span-full ml-12 h-full transition-[margin] duration-300 lg:ml-64">
						{children}
					</div>
				</div>
			</div>
		</TooltipProvider>
	)
}
