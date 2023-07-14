import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { Settings01Icon } from "@/components/icons/pika/settings01"
import { UserNav } from "@/app/(pages)/_component/UserNav"

import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background">
			<div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
				<div className="flex flex-1 items-center justify-end space-x-4">
					<nav className="flex items-center space-x-1">
						<div className="mr-3">
							<ThemeToggle />
						</div>
						<UserNav />
					</nav>
				</div>
			</div>
		</header>
	)
}
