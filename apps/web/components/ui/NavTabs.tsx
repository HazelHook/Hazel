"use client"

import { ReactNode } from "react"
import { usePathname, useRouter, useSelectedLayoutSegment } from "next/navigation"

import { Tabs, TabsList } from "@/components/ui/tabs"

interface NavTabsProps {
	children: ReactNode[]
}
export const NavTabs = ({ children }: NavTabsProps) => {
	const path = usePathname()
	const router = useRouter()
	const segment = useSelectedLayoutSegment()

	const handleNavigation = (v: string) => {
		router.push(path.replace(segment || "", "") + v)
	}

	return (
		<Tabs defaultValue={segment ? `/${segment}` : "/"} onValueChange={handleNavigation} className="w-full">
			<TabsList>{children}</TabsList>
		</Tabs>
	)
}
