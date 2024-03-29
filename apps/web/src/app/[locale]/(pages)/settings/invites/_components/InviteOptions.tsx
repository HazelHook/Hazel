import { useRouter } from "next/navigation"

import type { revokeOrganizationInvite } from "@/server/actions/organization-invite"

import { useAction } from "@hazel/server/actions/client"
import { Button } from "@hazel/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@hazel/ui/dropdown-menu"
import { toast } from "sonner"
import { IconClipboard, IconDotsVertical, IconUserMinus } from "@tabler/icons-react"

export interface InviteOptionsProps {
	emailAdress: string
	inviteId: string
	revokeAction: typeof revokeOrganizationInvite
}
export const InviteOptions = ({ emailAdress, revokeAction, inviteId }: InviteOptionsProps) => {
	const router = useRouter()

	const revoke = useAction(revokeAction, {
		onSuccess: () => {
			router.refresh()
		},
	})

	const handleRevoking = async () => {
		toast.promise(revoke.mutateAsync({ inviteId }), {
			success: "Successfully revoked invite",
			error: "There was an error, please try again.",
			loading: "Revoking Invite...",
		})
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only">Open menu</span>
					<IconDotsVertical className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => navigator.clipboard.writeText(emailAdress)}>
					<IconClipboard className="mr-2" />
					<span>Copy Email Adress</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleRevoking}>
					<IconUserMinus className="mr-2 text-destructive" />
					<span>Revoke invite</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
