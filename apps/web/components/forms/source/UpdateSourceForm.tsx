"use client"

import { useRouter } from "next/navigation"
import { IntegrationTools } from "db/src/drizzle/integrations/data"
import { Integration, Source } from "db/src/drizzle/schema"

import { useAction } from "@/server/client"
import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateSourceAction } from "@/server/actions/source"
import { updateSourceSchema } from "@/lib/schemas/source"
import AutoForm, { AutoFormInputComponentProps } from "@/components/ui/auto-form"

interface UpdateSourceFormProps {
	source: Source
	action: typeof updateSourceAction
	integrations: Integration[]
	shouldRedirect?: boolean
	onClose?: (id: string) => void
}

export function UpdateSourceForm({ onClose, source, action, integrations }: UpdateSourceFormProps) {
	const router = useRouter()

	const updateSource = useAction(action, {
		onSuccess(data) {
			router.refresh()

			onClose?.(data.id)
		},
	})

	return (
		<>
			<AutoForm
				defaultValues={{ ...source }}
				onSubmit={async (data) => {
					await updateSource.mutateAsync({ ...(data as any), publicId: source.publicId })
				}}
				formSchema={updateSourceSchema.omit({ publicId: true })}
				fieldConfig={{
					name: {
						description: "A name to identify your sources.",
						inputProps: {
							placeholder: "Source Name",
						},
					},
					url: {
						description: "The endpoint that will send the webhooks.",
						inputProps: {
							type: "email",
							placeholder: "E.g. example.com",
						},
					},
					integrationId: {
						fieldType: ({ label, isRequired, field, fieldConfigItem, fieldProps }: AutoFormInputComponentProps) => (
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
								{fieldConfigItem.description && <FormDescription>{fieldConfigItem.description}</FormDescription>}
								<FormMessage />
							</FormItem>
						),
					},
				}}
			>
				<Button type="submit" disabled={updateSource.status === "loading"} loading={updateSource.status === "loading"}>
					Update
				</Button>
			</AutoForm>
		</>
	)
}