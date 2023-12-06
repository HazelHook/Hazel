import { ReactNode } from "react"

import { Sidebar } from "@/components/sidebar"
import { Icons } from "@/components/icons"
import { IconSettings, IconUsers } from "@tabler/icons-react"

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
								icon: Icons.Dashboard,
								href: "/admin",
							},
							{
								title: "Organization",
								icon: IconSettings,
								href: "/admin/organizations",
							},
							{
								title: "Users",
								icon: IconUsers,
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
