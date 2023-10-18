import { cookies } from "next/headers"
import { TooltipProvider } from "@hazel/ui/tooltip"

import { createOrganzationAction, switchOrganizationAction } from "@/server/actions/organization"
import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { AutomationIcon } from "@/components/icons/pika/automation"
import { DashboardSimpleIcon } from "@/components/icons/pika/dashboardSimple"
import { FileInfoIcon } from "@/components/icons/pika/fileInfo"
import { GitCommitIcon } from "@/components/icons/pika/gitCommit"
import { HomeIcon } from "@/components/icons/pika/home"
import { LinkChainIcon } from "@/components/icons/pika/linkChain"
import { Settings01Icon } from "@/components/icons/pika/settings01"
import { ProfileSettings } from "@/components/ProfileSettings"
import { Sidebar } from "@/components/Sidebar"

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
										icon: HomeIcon,
									},
									{
										title: "Integrations",
										href: "/integrations",
										icon: DashboardSimpleIcon,
									},
								],
							},
							{
								title: "Setup",
								items: [
									{
										title: "Connections",
										href: "/connections",
										icon: LinkChainIcon,
									},
									{
										title: "Sources",
										href: "/sources",
										icon: GitCommitIcon,
									},
									{
										title: "Destinations",
										href: "/destinations",
										icon: AutomationIcon,
									},
								],
							},
							{
								items: [
									{
										title: "Settings",
										href: "/settings",
										icon: Settings01Icon,
									},
									{
										title: "Documentation",
										href: "https://docs.hazelhook.dev",
										target: "__blank",
										icon: FileInfoIcon,
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
					<div className="col-span-full ml-12 h-full transition-[margin] duration-300 lg:ml-64">{children}</div>
				</div>
			</div>
		</TooltipProvider>
	)
}
