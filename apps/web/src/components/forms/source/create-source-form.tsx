"use client"

import { useRouter } from "next/navigation"
import { IntegrationTools } from "@hazel/integrations/web"
import { Integration } from "@hazel/db/schema"
import { AutoForm, AutoFormInputComponentProps } from "@hazel/ui/auto-form"
import { Button } from "@hazel/ui/button"
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@hazel/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@hazel/ui/select"

import { createSourceAction } from "@/server/actions/source"
import { useAction } from "@hazel/server/actions/client"

import { createSourceSchema } from "@/lib/schemas/source"

interface CreateSourceFormProps {
	action: typeof createSourceAction
	integrations: Integration[]
	shouldRedirect?: boolean
	onSuccess?: (id: string) => void
}

export function CreateSourceForm({ onSuccess, action, shouldRedirect = true, integrations }: CreateSourceFormProps) {
	const router = useRouter()

	const createSource = useAction(action, {
		onSuccess(data) {
			router.refresh()

			if (shouldRedirect) {
				router.push(`/source/${data.id}/`)
			}

			onSuccess?.(data.id)
		},
	})

	return (
		<AutoForm
			onSubmit={async (data) => {
				await createSource.mutateAsync(data)
			}}
			formSchema={createSourceSchema}
			fieldConfig={{
				name: {
					description: "A name to identify your sources.",
					inputProps: {
						placeholder: "Source Name",
					},
				},
				integrationId: {
					fieldType: ({
						label,
						isRequired,
						field,
						fieldConfigItem,
						fieldProps,
					}: AutoFormInputComponentProps) => (
						<FormItem>
							<FormLabel>
								{label}
								{isRequired && <span className="text-destructive"> *</span>}
							</FormLabel>
							<FormControl>
								{IntegrationTools.length > 0 && (
									<Select onValueChange={field.onChange} value={field.value || undefined}>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													placeholder={<p className="text-muted-foreground">Connect...</p>}
													className="focus:text-muted-foreground"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent className="max-h-96">
											{integrations.map((integration) => (
												<SelectItem key={integration.publicId} value={integration.publicId}>
													<div className="flex flex-row items-center">{integration.name}</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							</FormControl>
							{fieldConfigItem.description && (
								<FormDescription>{fieldConfigItem.description}</FormDescription>
							)}
							<FormMessage />
						</FormItem>
					),
				},
			}}
		>
			<Button
				type="submit"
				disabled={createSource.status === "loading"}
				loading={createSource.status === "loading"}
			>
				Create
			</Button>
		</AutoForm>
	)
}
