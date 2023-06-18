"use client"

import { Tabs, TabsList } from "@/components/ui/tabs"
import { usePathname, useRouter, useSelectedLayoutSegment } from "next/navigation"
import { ReactNode } from "react"

interface NavTabsProps {
	children: ReactNode[]
}
export const NavTabs = ({ children }: NavTabsProps) => {
	const path = usePathname()
	const router = useRouter()
	const segment = useSelectedLayoutSegment()

	console.log(segment)

	const handleNavigation = (v: string) => {
		router.push(path.replace(segment || "", "") + v)
	}

	return (
		<Tabs defaultValue={segment ? `/${segment}` : "/"} onValueChange={handleNavigation} className="w-full">
			<TabsList>{children}</TabsList>
		</Tabs>
	)
}
