"use client"

import { useRouter } from "next/navigation"
import configuration from "@/configuration"
import { Avatar, AvatarImage } from "@hazel/ui/avatar"

import type { switchOrganizationAction } from "@/server/actions/organization"
import { useAction } from "@/server/client"
import { ChevronRightIcon } from "@hazel/icons"

interface OrgButtonProps {
	name: string
	role: string
	avatarUrl: string
	membershipId: string
	switchTeamAction: typeof switchOrganizationAction
}

export const OrgButton = ({ name, role, avatarUrl, switchTeamAction, membershipId }: OrgButtonProps) => {
	const router = useRouter()
	const handleSwitchTeam = useAction(switchTeamAction, {
		onSuccess: () => {
			router.push(configuration.paths.home)
		},
	})

	return (
		<button
			onClick={() => {
				handleSwitchTeam.mutate({ publicId: membershipId })
			}}
			type="button"
			className="w-full flex items-center justify-between cursor-pointer space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground"
		>
			<div className="flex flex-row gap-2">
				<Avatar>
					<AvatarImage src={avatarUrl} />
				</Avatar>

				<div className="space-y-1">
					<p className="text-sm font-medium leading-none">{name}</p>
					<p className="text-sm text-muted-foreground">{role}</p>
				</div>
			</div>

			<ChevronRightIcon className={"h-6 w-6"} />
		</button>
	)
}
