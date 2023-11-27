"use client"

import { ReactNode, useState } from "react"
import { useRouter } from "next/navigation"

import type { createOrganizationInvite } from "@/server/actions/organization-invite"

import { getBaseUrl } from "@hazel/server/actions"
import { useAction } from "@hazel/server/actions/client"
import { AutoForm } from "@hazel/ui/auto-form"
import { Button } from "@hazel/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@hazel/ui/dialog"
import { toast } from "sonner"
import { z } from "zod"

import { orgInviteFormSchema } from "../../lib/schemas/organization"

interface CreateOrganizationModalProps {
	children: ReactNode
	orgId: number
	inviteAction: typeof createOrganizationInvite
}

export const OrganizationInviteModal = ({ children, orgId, inviteAction }: CreateOrganizationModalProps) => {
	const router = useRouter()

	const [open, setOpen] = useState(false)

	const handleInvite = useAction(inviteAction, {
		onSuccess: (data) => {
			fetch(`${getBaseUrl()}/api/resend/invite`, {
				method: "POST",
				body: JSON.stringify({
					organizationId: data.organizationId,
					email: data.email,
					inviteId: data.id,
				}),
			})
			router.refresh()
			setOpen(false)
		},
	})

	async function onSubmit(values: z.infer<typeof orgInviteFormSchema>) {
		toast.promise(handleInvite.mutateAsync({ ...values, organizationId: orgId }), {
			loading: "Creating Invite...",
			success: "Invite successfully send",
			error: "There was an error creating the invite...",
		})
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add member to organization</DialogTitle>
				</DialogHeader>
				<AutoForm formSchema={orgInviteFormSchema} onSubmit={onSubmit}>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>

						<Button
							type="submit"
							disabled={handleInvite.status === "loading"}
							loading={handleInvite.status === "loading"}
						>
							Invite
						</Button>
					</DialogFooter>
				</AutoForm>
			</DialogContent>
		</Dialog>
	)
}
