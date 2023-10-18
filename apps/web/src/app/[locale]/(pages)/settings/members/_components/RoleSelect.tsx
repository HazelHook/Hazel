import { useMemo } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@hazel/ui/select"
import { OrganizationMember } from "db/src/drizzle/schema"
import { toast } from "sonner"

import { useAuth } from "@/lib/provider/AuthProvider"
import { capitalizeFirstLetter } from "@/lib/utils"

export interface RoleSelectProps {
	orgId: string
	memberId: string
	defaultValue: string
	members: OrganizationMember[]
}
export const RoleSelect = ({ defaultValue, memberId, members, orgId }: RoleSelectProps) => {
	const { user } = useAuth()

	const activeMember = useMemo(() => members.find((member) => member.userId === user?.id), [members, user?.id])

	if (activeMember?.role !== "admin" || memberId === user?.id) {
		return <p>{capitalizeFirstLetter(defaultValue)}</p>
	}

	return (
		<Select
			defaultValue={defaultValue}
			onValueChange={async (value: any) => {
				// await updateOrgMemberAction({ userId: memberId, role: value, orgId })

				toast("Updated Member")
			}}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select a Role" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value="admin">Admin</SelectItem>
					<SelectItem value="basic_member">Member</SelectItem>
					<SelectItem value="guest_member">Guest Member</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
