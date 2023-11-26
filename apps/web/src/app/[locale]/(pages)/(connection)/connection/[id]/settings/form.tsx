"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAction } from "@hazel/server/actions/client"
import { AutoForm } from "@hazel/ui/auto-form"
import { buttonVariants } from "@hazel/ui/button"
import { LoadingButton } from "@hazel/ui/loading-button"
import * as z from "zod"

import type { updateConnectionAction } from "@/server/actions/connections"
import { getCachedConnection } from "@/lib/orm"
import { updateConnectionSchema } from "@/lib/schemas/connection"
import { PromiseType } from "@/lib/ts/helpers"

interface NewSourceFormProps {
	action: typeof updateConnectionAction
	connection: PromiseType<ReturnType<typeof getCachedConnection>>
	isModal?: boolean
}

export function UpdateConnectionForm({ action, isModal, connection }: NewSourceFormProps) {
	const [values, setValues] = useState<Partial<z.infer<typeof updateConnectionSchema>>>({
		name: connection.name,
	})

	const router = useRouter()

	const createSource = useAction(action, {
		onSuccess(data) {
			if (isModal) {
				router.back()
			}

			router.refresh()
		},
	})

	return (
		<>
			<AutoForm
				values={values}
				onValuesChange={setValues}
				formSchema={updateConnectionSchema}
				onSubmit={async (val) =>
					await createSource.mutateAsync({
						...val,
						publicId: connection.publicId,
					})
				}
				fieldConfig={{
					name: {
						description: "A name to identify your connection.",
					},
					delay: {
						description: "Add a delay to your webhook delivery.",
					},
					retryCount: {
						description: "Count of times a request should be retried when failing.",
					},
					retryDelay: {
						description: "Delay between retries of requests.",
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
				<LoadingButton type="submit" loading={createSource.status === "loading"}>
					Update
				</LoadingButton>
			</AutoForm>
		</>
	)
}
