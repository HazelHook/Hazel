"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import type { updateConnectionAction } from "@/server/actions/connections"
import { getCachedConnection } from "@/lib/orm"
import { updateConnectionSchema } from "@/lib/schemas/connection"
import { PromiseType } from "@/lib/ts/helpers"

import { useAction } from "@hazel/server/actions/client"
import { AutoForm } from "@hazel/ui/auto-form"
import { buttonVariants } from "@hazel/ui/button"
import { LoadingButton } from "@hazel/ui/loading-button"

interface NewSourceFormProps {
	action: typeof updateConnectionAction
	connection: PromiseType<ReturnType<typeof getCachedConnection>>
	isModal?: boolean
}

export function UpdateConnectionForm({ action, isModal, connection }: NewSourceFormProps) {
	const router = useRouter()

	const updateConnection = useAction(action, {
		onSuccess(data) {
			if (isModal) {
				router.back()
			}

			router.refresh()
		},
	})

	return (
		<AutoForm
			formSchema={updateConnectionSchema}
			onSubmit={async (val) =>
				await updateConnection.mutateAsync({
					...val,
					publicId: connection.publicId,
				})
			}
			defaultValues={connection}
			fieldConfig={{
				name: {
					description: "A name to identify your connection.",
				},
				delay: {
					description: "Add a delay to your webhook delivery.",
					fieldType: "time",
				},
				retryCount: {
					description: "Count of times a request should be retried when failing.",
				},
				retryDelay: {
					description: "Delay between retries of requests.",
					fieldType: "time",
				},
				retryType: {
					description: (
						<span>
							Type of retry, learn more{" "}
							<Link className={buttonVariants({ variant: "link", size: "none" })} href="todo">
								here
							</Link>
						</span>
					),
				},
			}}
		>
			<LoadingButton type="submit" loading={updateConnection.status === "loading"}>
				Update
			</LoadingButton>
		</AutoForm>
	)
}
