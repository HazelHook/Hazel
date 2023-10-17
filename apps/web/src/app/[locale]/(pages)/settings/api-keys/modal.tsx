"use client"

import { Button } from "@hazel/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@hazel/ui/dialog"
import type { createApiKeyAction } from "@/server/actions/api-keys"
import { CreateApiKeyForm } from "@/components/forms/api/CreateApiKeyForm"
import { useState } from "react"

export const ApiKeyModal = ({
	createAction,
	workspaceId,
}: {
	createAction: typeof createApiKeyAction
	workspaceId: string
}) => {
	const [open, setOpen] = useState(false)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Create New</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new API Key</DialogTitle>
				</DialogHeader>
				<CreateApiKeyForm
					workspaceId={workspaceId}
					createAction={createAction}
					onSuccess={() => setOpen(false)}
				/>
			</DialogContent>
		</Dialog>
	)
}
