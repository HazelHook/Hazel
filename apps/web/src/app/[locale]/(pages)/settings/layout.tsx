import { Sidebar } from "@/components/Sidebar"
import { BarChartUpIcon } from "@/components/icons/pika/barChartUp"
import { CardIcon } from "@/components/icons/pika/card"
import { DangerIcon } from "@/components/icons/pika/danger"
import { KeyIcon } from "@/components/icons/pika/key"
import { Settings02Icon } from "@/components/icons/pika/settings02"
import { User2Icon } from "@/components/icons/pika/user2"
import { UserPlusIcon } from "@/components/icons/pika/userPlus"
import { auth } from "@/lib/auth"
import { ReactNode } from "react"

const SettingsLayout = async ({ children }: { children: ReactNode }) => {
	return (
		<div className="flex flex-row">
			<Sidebar
				items={[
					{
						title: "Settings",
						items: [
							{
								title: "General",
								icon: Settings02Icon,
								href: "/settings",
							},
							{
								title: "Billing",
								icon: CardIcon,
								href: "/settings/billing",
							},
							{
								title: "Usage",
								icon: BarChartUpIcon,
								href: "/settings/usage",
							},
							{
								title: "API Keys",
								icon: KeyIcon,
								href: "/settings/api-keys",
							},
						],
					},
					{
						items: [
							{
								title: "Members",
								icon: User2Icon,
								href: "/settings/members",
							},
							{
								title: "Invites",
								icon: UserPlusIcon,
								href: "/settings/invites",
							},
							{
								title: "Danger",
								icon: DangerIcon,
								href: "/settings/danger",
								className: "text-destructive",
							},
						],
					},
				]}
				disableLogo
				className="max-w-min lg:max-w-[200px]"
			/>
			{children}
		</div>
	)
}

export default SettingsLayout
