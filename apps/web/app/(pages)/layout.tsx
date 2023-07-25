import { Toaster } from "sonner"

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

interface RootLayoutProps {
	children: React.ReactNode
	params: {
		org?: string
		slug?: string
	}
}

export default function RootLayout({ children }: RootLayoutProps) {
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
					/>
					<div className="col-span-full ml-12 border-l h-full transition-[margin] duration-300 lg:ml-64">
						<SiteHeader />

						{children}
					</div>
				</div>
			</div>
		</TooltipProvider>
	)
}
