"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
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
import { BarChartIcon } from "@/components/icons/BarChart"
import { CardIcon } from "@/components/icons/Card"
import { HomeIcon } from "@/components/icons/Home"
import { LogoutIcon } from "@/components/icons/Logout"
import { RoundPlusIcon } from "@/components/icons/RoundPlus"
import { SettingsIcon } from "@/components/icons/Settings"

export function UserNav() {
	const { signOut } = useAuth()

	const params = useParams()

	const { user } = useUser()

	const [teamModal, setTeamModal] = useState(false)

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
			{/* <CreateOrganizationModal open={teamModal} setOpen={setTeamModal} /> */}
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
					<DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<Link href={`/${params.org}`}>
								<HomeIcon className="mr-2 h-4 w-4" />
								<span>Home</span>
								<DropdownMenuShortcut>⇧⌘H</DropdownMenuShortcut>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href={`/${params.org}/settings/billing`}>
								<CardIcon className="mr-2 h-4 w-4" />
								<span>Billing</span>

								<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href={`/${params.org}/settings/usage`}>
								<BarChartIcon className="mr-2 h-4 w-4" />
								<span>Usage</span>

								<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href={`/${params.org}/settings`}>
								<SettingsIcon className="mr-2 h-4 w-4" />
								<span>Settings</span>
								<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								setTeamModal(true)
							}}
						>
							<RoundPlusIcon className="mr-2 h-4 w-4" />
							<span>New Team</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => signOut()}>
						<LogoutIcon className="mr-2 h-4 w-4" />
						<span>Log out</span>
						<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}