import Link from "next/link"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { LogoIcon } from "@/components/icons/Logo"
import { BarChartDownIcon } from "@/components/icons/pika/barChartDown"
import { CardIcon } from "@/components/icons/pika/card"
import { DashboardSimpleIcon } from "@/components/icons/pika/dashboardSimple"
import { HomeIcon } from "@/components/icons/pika/home"
import { LinkChainIcon } from "@/components/icons/pika/linkChain"
import { PaperBagIcon } from "@/components/icons/pika/paperBag"
import { PaperclipIcon } from "@/components/icons/pika/paperclip"
import { Settings01Icon } from "@/components/icons/pika/settings01"
import { IconProps } from "@/components/icons/pika/types"

import { AutomationIcon } from "./icons/pika/automation"
import { GitCommitIcon } from "./icons/pika/gitCommit"
import { SidebarClientItem } from "./SidebarItem"

type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {
	params: {
		org?: string
		slug?: string
	}
}

export const SidebarItem = ({
	icon,
	endIcon,
	...rest
}: {
	href: string
	icon: (props: IconProps) => JSX.Element
	endIcon?: (props: IconProps) => JSX.Element
	title: string
	target?: string
	disabled?: boolean
	size?: "default" | "xs" | "sm" | "lg"
}) => {
	const Icon = icon
	const EndIcon = endIcon

	return (
		<SidebarClientItem
			icon={<Icon className="h-4 w-4 lg:mr-2" />}
			endIcon={EndIcon && <EndIcon className="hidden h-3 w-3 lg:ml-2 lg:block" />}
			{...rest}
		/>
	)
}

export async function Sidebar({ className }: SidebarProps) {
	return (
		<div
			className={cn("flex w-full flex-col justify-between gap-4", className)}
			style={{ height: "calc(100vh - 4rem)" }}
		>
			<div className="h-full w-full max-w-full space-y-2 pb-4 lg:space-y-4">
				<Link className="cursor-pointer" href={"/"}>
					<div className="hidden flex-row items-center gap-2 px-4 py-2 lg:flex">
						<LogoIcon className="h-12 w-12" />

						<h1 className="text-3xl font-semibold tracking-tight">Hazel</h1>
					</div>

					<div className="flex justify-center py-2 lg:hidden">
						<LogoIcon className="h-6 w-6" />
					</div>
				</Link>

				<div className="py-2 lg:px-4">
					<div className="space-y-1">
						<SidebarItem href={"/"} title={"Overview"} icon={HomeIcon} />
						<SidebarItem href={"/integrations"} title={"Integrations"} icon={DashboardSimpleIcon} />
					</div>
				</div>

				<Separator />

				<div className="py-2 lg:px-4">
					<h2 className="mb-2 hidden px-2 text-lg font-semibold tracking-tight lg:block">Setup</h2>
					<div className="space-y-1">
						<SidebarItem href={"/sources"} title={"Sources"} icon={GitCommitIcon} />
						<SidebarItem href={"/connections"} title={"Connections"} icon={LinkChainIcon} />
						<SidebarItem href={"/destinations"} title={"Destinations"} icon={AutomationIcon} />
					</div>
				</div>

				<Separator />

				<div className="py-2 lg:px-4">
					<h2 className="mb-2 hidden px-2 text-lg font-semibold tracking-tight lg:block">Settings</h2>
					<div className="space-y-1">
						<SidebarItem href={"/app/settings"} title={"Settings"} icon={Settings01Icon} />
						<SidebarItem href="ttps://docs.maple.dev" target="__blank" title={"Documentation"} icon={PaperBagIcon} />
					</div>
				</div>
			</div>
			<div className="hidden p-2 lg:block">{/* <TeamSwitcher className="lg:w-full" /> */}</div>
		</div>
	)
}
