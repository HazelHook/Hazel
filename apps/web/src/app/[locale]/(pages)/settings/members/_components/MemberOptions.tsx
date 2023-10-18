import { useMemo } from "react"
import { Button } from "@hazel/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@hazel/ui/dropdown-menu"
import { OrganizationMember } from "@hazel/db/src/drizzle/schema"
import { toast } from "sonner"

import { useAuth } from "@/lib/provider/AuthProvider"
import { ClipboardIcon } from "@hazel/icons"
import { FolderRemoveIcon } from "@hazel/icons"
import { LogOutLeftIcon } from "@hazel/icons"
import { ThreeDotsHorizontalIcon } from "@hazel/icons"

export interface MemberOptionsProps {
	orgId: string
	memberId: string
	members: OrganizationMember[]
}
export const MemberOptions = ({ members, memberId, orgId }: MemberOptionsProps) => {
	const { user } = useAuth()

	const activeMember = useMemo(() => members.find((member) => member.userId === user?.id), [members, user?.id])

	const handleKick = async () => {
		// await kickOrgMemberAction({ userId: memberId, orgId: orgId })
		toast("Sucessfully removed Member")
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only">Open menu</span>
					<ThreeDotsHorizontalIcon className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => (navigator as any).clipboard.writeText(memberId)}>
					<ClipboardIcon className="mr-2" />
					<span>Copy user ID</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					disabled={activeMember?.role !== "admin" || memberId === user?.id}
					onClick={handleKick}
				>
					<FolderRemoveIcon className="mr-2 text-destructive" />
					<span>Remove member</span>
				</DropdownMenuItem>
				{memberId === user?.id && (
					<DropdownMenuItem disabled={activeMember?.role === "admin"} onClick={handleKick}>
						<LogOutLeftIcon className="mr-2" />
						<span>Leave Organization</span>
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
