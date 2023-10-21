import { ReactNode } from "react"
import {
	BarChartUpIcon,
	CardIcon,
	DangerIcon,
	DashboardDynamicIcon,
	EyeScanIcon,
	FocusIcon,
	KeyIcon,
	LockedIcon,
	Settings02Icon,
	User2Icon,
	User3Icon,
	UserIcon,
	UserPlusIcon,
} from "@hazel/icons"

import { Sidebar } from "@/components/sidebar"

const AdminLayout = async ({ children }: { children: ReactNode }) => {
	return (
		<div className="flex flex-row">
			<Sidebar
				items={[
					{
						title: "Admin",
						items: [
							{
								title: "Dashboard",
								icon: DashboardDynamicIcon,
								href: "/admin",
							},
							{
								title: "Organization",
								icon: Settings02Icon,
								href: "/admin/organizations",
							},
							{
								title: "Users",
								icon: User3Icon,
								href: "/admin/users",
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

export default AdminLayout
