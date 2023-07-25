import { TooltipProvider } from "@/components/ui/tooltip"
import { Sidebar } from "@/components/Sidebar"
import { SiteHeader } from "@/components/site-header"
import { HomeIcon } from "@/components/icons/pika/home"
import { DashboardSimpleIcon } from "@/components/icons/pika/dashboardSimple"
import { LinkChainIcon } from "@/components/icons/pika/linkChain"
import { GitCommitIcon } from "@/components/icons/pika/gitCommit"
import { AutomationIcon } from "@/components/icons/pika/automation"
import { Settings01Icon } from "@/components/icons/pika/settings01"
import { FileInfoIcon } from "@/components/icons/pika/fileInfo"
import TeamSwitcher from "@/components/TeamSwitcher"
import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { OrganizationMembership } from "@clerk/nextjs/dist/types/server"
import { Organization } from "db/src/drizzle/schema"
import { createOrganzationAction } from "@/server/actions/organization"

interface RootLayoutProps {
	children: React.ReactNode
	params: {
		org?: string
		slug?: string
	}
}

export default async function RootLayout({ children }: RootLayoutProps) {
	const { userId } = await auth()

	const organzations = await db.organization.memberships.getMany({ customerId: userId })

	return (
		<TooltipProvider>
			<div className="relative flex min-h-screen flex-col">
				<div className="grid grow lg:grid-cols-5">
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
						<TeamSwitcher createTeamAction={createOrganzationAction} memberships={organzations} className="w-full" />
					</Sidebar>
					<div className="col-span-full ml-12 border-l h-full transition-[margin] duration-300 lg:ml-64">
						<SiteHeader />

						{children}
					</div>
				</div>
			</div>
		</TooltipProvider>
	)
}
