"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { createOrganzationAction } from "@/server/actions/organization"
import { createOrgFormSchema } from "@/lib/schemas/organization"

import { useAction } from "@hazel/server/actions/client"
import { AutoForm } from "@hazel/ui/auto-form"
import { Button } from "@hazel/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@hazel/ui/dialog"

export const CreateOrg = () => {
	const router = useRouter()
	const [isOpen, setIsOpen] = useState(false)

	const handleTeamCreation = useAction(createOrganzationAction, {
		onSuccess: () => {
			setIsOpen(false)
			router.refresh()
		},
	})

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
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
						<Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
							Cancel
						</Button>
						<Button type="submit">Create</Button>
					</DialogFooter>
				</AutoForm>
			</DialogContent>
			<DialogTrigger asChild>
				<Button variant="outline" className="w-full">
					Create Organization
				</Button>
			</DialogTrigger>
		</Dialog>
	)
}
