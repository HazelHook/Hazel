import { ReactNode } from "react"

import { LinkTabList } from "./link-tabs"

interface NavTabsProps {
	children: ReactNode[]
}
export const NavTabs = ({ children }: NavTabsProps) => {
	return (
		<div className="w-full">
			<LinkTabList>{children}</LinkTabList>
		</div>
	)
}
