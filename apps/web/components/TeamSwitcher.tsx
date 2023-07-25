"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ChevronSortVerticalIcon } from "./icons/pika/chevronSortVertical"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "./ui/command"
import { CheckTickIcon } from "./icons/pika/checkTick"
import { AddCircleIcon } from "./icons/pika/addCircle"
import { Organization, OrganizationMember } from "db/src/drizzle/schema"
import AutoForm from "./ui/auto-form"
import { createOrgFormSchema } from "@/lib/schemas/organization"
import { useAction } from "@/server/client"
import type { createOrganzationAction } from "@/server/actions/organization"
import { useRouter } from "next/navigation"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

type Membership = OrganizationMember & {
	organization: Organization
}

interface TeamSwitcherProps extends PopoverTriggerProps {
	memberships: Membership[]
	createTeamAction: typeof createOrganzationAction
}

export default function TeamSwitcher({ className, memberships, createTeamAction }: TeamSwitcherProps) {
	const router = useRouter()
	const [open, setOpen] = React.useState(false)
	const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)
	const [selectedTeam, setSelectedTeam] = React.useState<Membership>(memberships[0])

	const handleTeamCreation = useAction(createTeamAction, {
		onSuccess: () => {
			setShowNewTeamDialog(false)
			router.refresh()
		},
	})

	return (
		<Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						aria-label="Select a team"
						className={cn("w-[200px] justify-between", className)}
					>
						<Avatar className="mr-2 h-5 w-5">
							<AvatarImage
								src={`https://avatar.vercel.sh/${selectedTeam.organization.publicId}.png`}
								alt={selectedTeam.organization.name}
							/>
							<AvatarFallback>SC</AvatarFallback>
						</Avatar>
						{selectedTeam.organization.name}
						<ChevronSortVerticalIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandList>
							<CommandInput placeholder="Search team..." />
							<CommandEmpty>No team found.</CommandEmpty>
							<CommandGroup heading={"Teams"}>
								{memberships.map((mebership) => (
									<CommandItem
										key={mebership.publicId}
										onSelect={() => {
											setSelectedTeam(mebership)
											setOpen(false)
										}}
										className="text-sm"
									>
										<Avatar className="mr-2 h-5 w-5">
											<AvatarImage
												src={`https://avatar.vercel.sh/${mebership.organization.publicId}.png`}
												alt={mebership.organization.name}
											/>
											<AvatarFallback>SC</AvatarFallback>
										</Avatar>
										{mebership.organization.name}
										<CheckTickIcon
											className={cn(
												"ml-auto h-4 w-4",
												selectedTeam.publicId === mebership.publicId ? "opacity-100" : "opacity-0",
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
						<CommandSeparator />
						<CommandList>
							<CommandGroup>
								<DialogTrigger asChild>
									<CommandItem
										onSelect={() => {
											setOpen(false)
											setShowNewTeamDialog(true)
										}}
									>
										<AddCircleIcon className="mr-2 h-5 w-5" />
										Create Team
									</CommandItem>
								</DialogTrigger>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
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
	)
}
