"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSignOut } from "@hazel/auth/hooks"
import { useAuth } from "@hazel/auth/provider"
import { Organization, OrganizationMember } from "@hazel/db/src/drizzle/schema"
import {
	AddCircleIcon,
	CardIcon,
	CheckTickIcon,
	ChevronSortVerticalIcon,
	File2InfoIcon,
	LogOutLeftIcon,
	MonitorIcon,
	MoonIcon,
	RocketIcon,
	SunIcon,
} from "@hazel/icons"
import { AutoForm } from "@hazel/ui/auto-form"
import { Avatar, AvatarFallback, AvatarImage } from "@hazel/ui/avatar"
import { Badge } from "@hazel/ui/badge"
import { Button } from "@hazel/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@hazel/ui/dialog"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@hazel/ui/dropdown-menu"
import { useLocale } from "next-intl"
import { useTheme } from "next-themes"

import type { createOrganzationAction, switchOrganizationAction } from "@/server/actions/organization"
import { createOrgFormSchema } from "@/lib/schemas/organization"
import { cn } from "@/lib/utils"

import { useAction } from "@hazel/server/actions/client"

type Membership = OrganizationMember & {
	organization: Organization
}

interface TeamSwitcherProps {
	memberships: Membership[]
	currentMembershipId?: string
	createTeamAction: typeof createOrganzationAction
	switchTeamAction: typeof switchOrganizationAction
}

export const ProfileSettings = ({
	memberships,
	currentMembershipId,
	createTeamAction,
	switchTeamAction,
}: TeamSwitcherProps) => {
	const router = useRouter()
	const pathname = usePathname()

	const signOut = useSignOut()

	const currentMembership = memberships.find((membership) => membership.publicId === currentMembershipId)

	const { user } = useAuth()

	const changeLocale = (locale: string) => {
		console.log(pathname)
		router.replace(`${locale}/${pathname}`)
	}
	const locale = useLocale()

	const [showNewTeamDialog, setShowNewTeamDialog] = useState(false)
	const [selectedTeam, setSelectedTeam] = useState<Membership>(currentMembership || memberships[0])

	const { setTheme, theme } = useTheme()

	const handleTeamCreation = useAction(createTeamAction, {
		onSuccess: () => {
			setShowNewTeamDialog(false)
			router.refresh()
		},
	})

	const handleSwitchTeam = useAction(switchTeamAction, {
		onSuccess: () => {
			router.refresh()
		},
	})

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className="flex items-center justify-between gap-4 px-2 py-1 rounded lg:w-full hover:bg-muted">
					<div className="flex flex-row-reverse items-center justify-start w-full gap-4 lg:flex-row ">
						<Avatar className="w-8 h-8 lg:w-10 lg:h-10">
							{user?.app_metadata?.photoUrl ? (
								<AvatarImage
									src={user?.app_metadata?.photoUrl}
									alt={user?.app_metadata?.displayName ?? "Profile picture"}
								/>
							) : null}
							<AvatarFallback>{selectedTeam.organization.name.slice(0, 2).toUpperCase()}</AvatarFallback>
						</Avatar>
						<div className="flex flex-row-reverse items-center gap-4 lg:gap-1 lg:items-start lg:flex-col">
							<span className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[8rem]">
								{selectedTeam.organization.name}
							</span>
							<PlanBadge plan={"free"} />
						</div>
					</div>
					<ChevronSortVerticalIcon className="hidden w-4 h-4 md:block" />
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-full lg:w-56" align="end" forceMount>
					<DropdownMenuGroup>
						<Link href="/onboarding">
							<DropdownMenuItem className="cursor-pointer">
								<RocketIcon className="w-4 h-4 mr-2" />
								<span>Onboarding</span>
							</DropdownMenuItem>
						</Link>
						<Link href="https://docs.hazelhook.dev" target="__blank">
							<DropdownMenuItem className="cursor-pointer">
								<File2InfoIcon className="w-4 h-4 mr-2" />
								<span>Docs</span>
							</DropdownMenuItem>
						</Link>
						<Link href="/">
							<DropdownMenuItem className="cursor-pointer">
								<CardIcon className="w-4 h-4 mr-2" />
								<span>Plans & Billing</span>
							</DropdownMenuItem>
						</Link>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>Change Theme</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuCheckboxItem
										checked={theme === "light"}
										onCheckedChange={() => setTheme("light")}
									>
										<div className="flex items-center gap-2 ">
											<SunIcon className="w-4 h-4" />
											Light
										</div>
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={theme === "dark"}
										onCheckedChange={() => setTheme("dark")}
									>
										<div className="flex items-center gap-2 ">
											<MoonIcon className="w-4 h-4" />
											Dark
										</div>
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={theme === "system"}
										onCheckedChange={() => setTheme("system")}
									>
										<div className="flex items-center gap-2 ">
											<MonitorIcon className="w-4 h-4" />
											System
										</div>
									</DropdownMenuCheckboxItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					</DropdownMenuGroup>
					<DropdownMenuGroup>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>Change Language</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuCheckboxItem
										checked={locale === "en"}
										onCheckedChange={() => changeLocale("en")}
									>
										<div className="flex items-center gap-2 ">EN</div>
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={locale === "de"}
										onCheckedChange={() => changeLocale("de")}
									>
										<div className="flex items-center gap-2 ">DE</div>
									</DropdownMenuCheckboxItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuLabel>Switch Workspace</DropdownMenuLabel>

						{memberships.map((membership) => (
							<DropdownMenuItem
								key={membership.organization.publicId}
								onClick={() => {
									handleSwitchTeam.mutate({ publicId: membership.publicId })
									setSelectedTeam(membership)
								}}
								className={cn("flex items-center justify-between")}
							>
								<Avatar className="mr-2 h-5 w-5">
									<AvatarImage
										src={`https://avatar.vercel.sh/${membership.organization.publicId}.png`}
										alt={membership.organization.name}
									/>
								</Avatar>
								{membership.organization.name}
								<CheckTickIcon
									className={cn(
										"ml-auto h-4 w-4",
										selectedTeam.publicId === membership.publicId ? "opacity-100" : "opacity-0",
									)}
								/>
							</DropdownMenuItem>
						))}
					</DropdownMenuGroup>

					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={() => setShowNewTeamDialog(true)}>
							<AddCircleIcon className="w-4 h-4 mr-2 " />
							<span className="cursor-pointer">Create Workspace</span>
						</DropdownMenuItem>
						<Link href="/settings/invite">
							<DropdownMenuItem>
								<AddCircleIcon className="w-4 h-4 mr-2 " />
								<span className="cursor-pointer">Invite Member</span>
							</DropdownMenuItem>
						</Link>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem
							asChild
							onClick={() => {
								signOut()
								router.refresh()
							}}
							className="cursor-pointer"
						>
							<span>
								<LogOutLeftIcon className="w-4 h-4 mr-2" />
								Sign out
							</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create team</DialogTitle>
						<DialogDescription>To better manage your webhooks with a team.</DialogDescription>
					</DialogHeader>
					<AutoForm
						onSubmit={async (data) => {
							await handleTeamCreation.mutateAsync(data)
						}}
						formSchema={createOrgFormSchema}
					>
						<DialogFooter>
							<Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
								Cancel
							</Button>
							<Button type="submit">Create</Button>
						</DialogFooter>
					</AutoForm>
				</DialogContent>
			</Dialog>
		</>
	)
}

const PlanBadge = ({ plan }: { plan: "free" | "pro" | "enterprise" }) => {
	if (plan === "free") {
		return (
			<Badge variant="outline" className="font-normal">
				{plan.toUpperCase()}
			</Badge>
		)
	}

	if (plan === "pro") {
		return <Badge>{plan.toUpperCase()}</Badge>
	}

	if (plan === "enterprise") {
		return <Badge variant="secondary">{plan.toUpperCase()}</Badge>
	}
}
