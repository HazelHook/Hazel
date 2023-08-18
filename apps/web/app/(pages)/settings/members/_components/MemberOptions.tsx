import { ClipboardIcon } from "@/components/icons/pika/clipboard"
import { FolderRemoveIcon } from "@/components/icons/pika/folderRemove"
import { LogOutLeftIcon } from "@/components/icons/pika/logOutLeft"
import { ThreeDotsHorizontalIcon } from "@/components/icons/pika/threeDotsHorizontal"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/provider/AuthProvider"
import { OrganizationMember } from "db/src/drizzle/schema"
import { useMemo } from "react"
import { toast } from "sonner"

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
				<DropdownMenuItem onClick={() => navigator.clipboard.writeText(memberId)}>
					<ClipboardIcon className="mr-2" />
					<span>Copy user ID</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem disabled={activeMember?.role !== "admin" || memberId === user?.id} onClick={handleKick}>
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
