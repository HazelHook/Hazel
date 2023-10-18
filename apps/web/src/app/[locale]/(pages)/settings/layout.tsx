import { ReactNode } from "react"

import { auth } from "@/lib/auth"
import { BarChartUpIcon } from "@hazel/icons"
import { CardIcon } from "@hazel/icons"
import { DangerIcon } from "@hazel/icons"
import { EyeScanIcon } from "@hazel/icons"
import { FocusIcon } from "@hazel/icons"
import { KeyIcon } from "@hazel/icons"
import { LockedIcon } from "@hazel/icons"
import { Settings02Icon } from "@hazel/icons"
import { UserIcon } from "@hazel/icons"
import { User2Icon } from "@hazel/icons"
import { UserPlusIcon } from "@hazel/icons"
import { Sidebar } from "@/components/sidebar"

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
					{
						title: "Personal",
						items: [
							{
								title: "My Details",
								icon: UserIcon,
								href: "/settings/personal",
							},
							{
								title: "Authentication",
								icon: EyeScanIcon,
								href: "/settings/personal/auth",
							},
							{
								title: "Email",
								icon: FocusIcon,
								href: "/settings/personal/email",
							},
							{
								title: "Password",
								icon: LockedIcon,
								disabled: true,
								href: "/settings/personal/password",
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
