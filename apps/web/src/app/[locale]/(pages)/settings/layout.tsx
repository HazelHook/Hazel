import { ReactNode } from "react"

import { Sidebar } from "@/components/sidebar"
import { Icons } from "@/components/icons"
import {
	IconChartAreaLine,
	IconCreditCard,
	IconKey,
	IconMail,
	IconPassword,
	IconSkull,
	IconUser,
	IconUserPlus,
	IconUserScan,
} from "@tabler/icons-react"

const SettingsLayout = async ({ children }: { children: ReactNode }) => {
	return (
		<>
			<Sidebar
				items={[
					{
						title: "Settings",
						items: [
							{
								title: "General",
								icon: Icons.Settings,
								href: "/settings",
							},
							{
								title: "Billing",
								icon: IconCreditCard,
								href: "/settings/billing",
							},
							{
								title: "Usage",
								icon: IconChartAreaLine,
								href: "/settings/usage",
							},
							{
								title: "API Keys",
								icon: IconKey,
								href: "/settings/api-keys",
							},
						],
					},
					{
						items: [
							{
								title: "Members",
								icon: IconUser,
								href: "/settings/members",
							},
							{
								title: "Invites",
								icon: IconUserPlus,
								href: "/settings/invites",
							},
							{
								title: "Danger",
								icon: IconSkull,
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
								icon: IconUser,
								href: "/settings/personal",
							},
							{
								title: "Authentication",
								icon: IconUserScan,
								href: "/settings/personal/auth",
							},
							{
								title: "Email",
								icon: IconMail,
								href: "/settings/personal/email",
							},
							{
								title: "Password",
								icon: IconPassword,
								disabled: true,
								href: "/settings/personal/password",
								className: "text-destructive",
							},
						],
					},
				]}
				disableLogo
				className="w-12 lg:w-64 fixed"
			/>
			<div className="ml-12 lg:ml-64">{children}</div>
		</>
	)
}

export default SettingsLayout
