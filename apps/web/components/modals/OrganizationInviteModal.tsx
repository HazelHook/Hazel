"use client"

import { ReactNode, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"

import { useRouter } from "next/navigation"
import AutoForm from "../ui/auto-form"
import { useAction } from "@/server/client"
import { createOrganizationInvite } from "@/app/(pages)/settings/_actions"
import { toast } from "sonner"
import { orgInviteFormSchema } from "./schemas/organization"

interface CreateOrganizationModalProps {
	children: ReactNode
	orgId: number
	inviteAction: typeof createOrganizationInvite
}

export const OrganizationInviteModal = ({ children, orgId, inviteAction }: CreateOrganizationModalProps) => {
	const router = useRouter()

	const [isSubmitting, setIsSubmitting] = useState(false)

	const [open, setOpen] = useState(false)

	const handleInvite = useAction(inviteAction, {
		onSuccess: () => {
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
				<AutoForm formSchema={orgInviteFormSchema} onSubmit={onSubmit} onStateChange={setIsSubmitting}>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>

						<Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
							Invite
						</Button>
					</DialogFooter>
				</AutoForm>
			</DialogContent>
		</Dialog>
	)
}
