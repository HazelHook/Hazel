import { Sidebar } from "@/components/Sidebar"
import { AtomIcon } from "@/components/icons/pika/atom"
import { BarChartUpIcon } from "@/components/icons/pika/barChartUp"
import { CardIcon } from "@/components/icons/pika/card"
import { Settings02Icon } from "@/components/icons/pika/settings02"
import { User2Icon } from "@/components/icons/pika/user2"
import { UserPlusIcon } from "@/components/icons/pika/userPlus"
import { ReactNode } from "react"

const SettingsLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="flex flex-row">
			<Sidebar
				items={[
					{
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
								title: "API",
								icon: AtomIcon,
								href: "/settings/api",
							},
						],
					},
					{
						title: "Organization",
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
						],
					},
				]}
				disableLogo
				className="max-w-[200px]"
			/>
			{children}
		</div>
	)
}

export default SettingsLayout
