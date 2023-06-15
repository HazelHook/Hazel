import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { UserNav } from "@/app/(pages)/_component/UserNav"
import { SettingsIcon } from "./icons/Settings"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background">
			<div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
				<div className="flex flex-1 items-center justify-end space-x-4">
					<nav className="flex items-center space-x-1">
						<Link href="/settings">
							<div
								className={buttonVariants({
									size: "sm",
									variant: "ghost",
								})}
							>
								<SettingsIcon />
								<span className="sr-only">Settings</span>
							</div>
						</Link>
						<ThemeToggle />
						<UserNav />
					</nav>
				</div>
			</div>
		</header>
	)
}
