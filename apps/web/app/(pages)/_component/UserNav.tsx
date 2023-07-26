"use client"

import Link from "next/link"
import { useAuth, useUser } from "@clerk/nextjs"

import { getSeededProfileImageUrl } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AutomationIcon } from "@/components/icons/pika/automation"
import { DashboardSimpleIcon } from "@/components/icons/pika/dashboardSimple"
import { GitCommitIcon } from "@/components/icons/pika/gitCommit"
import { HomeIcon } from "@/components/icons/pika/home"
import { LinkChainIcon } from "@/components/icons/pika/linkChain"
import { LogOutRightIcon } from "@/components/icons/pika/logOutRight"
import { Settings01Icon } from "@/components/icons/pika/settings01"

export function UserNav() {
	const { signOut } = useAuth()
	const { user } = useUser()

	if (!user) {
		return (
			<Button variant="ghost" className="relative h-8 w-8 rounded-full">
				<Avatar className="h-8 w-8">
					<AvatarImage src={getSeededProfileImageUrl("loading")} />
				</Avatar>
			</Button>
		)
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative h-8 w-8 rounded-full">
						<Avatar className="h-8 w-8">
							<AvatarImage src={user.profileImageUrl} alt={user.username || ""} />
							<AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">{user.username}</p>
							<p className="text-xs leading-none text-muted-foreground">
								{user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress}
							</p>
						</div>
					</DropdownMenuLabel>

					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link href={"/"}>
							<HomeIcon className="mr-2 h-4 w-4" />
							<span>Overview</span>
							<DropdownMenuShortcut>⇧⌘H</DropdownMenuShortcut>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href={"integrations/"}>
							<DashboardSimpleIcon className="mr-2 h-4 w-4" />
							<span>Integrations</span>
						</Link>
					</DropdownMenuItem>

					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<DropdownMenuItem asChild>
								<Link href={"sources/"}>
									<GitCommitIcon className="mr-2 h-4 w-4" />
									<span>Sources</span>

									<DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
								</Link>
							</DropdownMenuItem>
							<Link href={"connections/"}>
								<LinkChainIcon className="mr-2 h-4 w-4" />
								<span>Connections</span>

								<DropdownMenuShortcut>⇧⌘X</DropdownMenuShortcut>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href={"sources/"}>
								<AutomationIcon className="mr-2 h-4 w-4" />
								<span>Destinations</span>

								<DropdownMenuShortcut>⇧⌘Z</DropdownMenuShortcut>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link href={"settings/"}>
							<Settings01Icon className="mr-2 h-4 w-4" />
							<span>Settings</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => signOut()}>
						<LogOutRightIcon className="mr-2 h-4 w-4" />
						<span>Log out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
