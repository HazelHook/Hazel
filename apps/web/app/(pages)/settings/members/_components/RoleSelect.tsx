import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { capitalizeFirstLetter } from "@/lib/utils"
import { useAuth } from "@clerk/nextjs"

import { OrganizationMember } from "db/src/drizzle/schema"
import { useMemo } from "react"
import { toast } from "sonner"

export interface RoleSelectProps {
	orgId: string
	memberId: string
	defaultValue: string
	members: OrganizationMember[]
}
export const RoleSelect = ({ defaultValue, memberId, members, orgId }: RoleSelectProps) => {
	const { userId } = useAuth()

	const activeMember = useMemo(() => members.find((member) => member.customerId === userId), [members, userId])

	if (activeMember?.role !== "admin" || memberId === userId) {
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
