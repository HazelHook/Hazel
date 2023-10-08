"use client"

import { useRouter } from "next/navigation"
import { IntegrationTools } from "db/src/drizzle/integrations/data"
import { Integration } from "db/src/drizzle/schema"

import { useAction } from "@/server/client"
import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createSourceAction } from "@/server/actions/source"
import { createSourceSchema } from "@/lib/schemas/source"
import AutoForm, { AutoFormInputComponentProps } from "@/components/ui/auto-form"

interface CreateSourceFormProps {
	action: typeof createSourceAction
	integrations: Integration[]
	shouldRedirect?: boolean
	onClose?: (id: string) => void
}

export function CreateSourceForm({ onClose, action, shouldRedirect = true, integrations }: CreateSourceFormProps) {
	const router = useRouter()

	const createSource = useAction(action, {
		onSuccess(data) {
			router.refresh()

			if (shouldRedirect) {
				router.push(`/source/${data.id}/`)
			}

			onClose?.(data.id)
		},
	})

	return (
		<>
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
					url: {
						description: "The endpoint that will send the webhooks.",
						inputProps: {
							type: "email",
							placeholder: "E.g. example.com",
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
														placeholder={
															<p className="text-muted-foreground">Connect...</p>
														}
														className="focus:text-muted-foreground"
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent className="max-h-96">
												{integrations.map((integration) => (
													<SelectItem key={integration.publicId} value={integration.publicId}>
														<div className="flex flex-row items-center">
															{integration.name}
														</div>
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
		</>
	)
}
