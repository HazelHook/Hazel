"use client"

import { useRouter } from "next/navigation"
import { IntegrationTools } from "@hazel/db/integrations"
import { Integration, Source } from "@hazel/db/schema"
import { AutoForm, AutoFormInputComponentProps } from "@hazel/ui/auto-form"
import { Button } from "@hazel/ui/button"
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@hazel/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@hazel/ui/select"

import { updateSourceAction } from "@/server/actions/source"
import { useAction } from "@hazel/server/actions/client"

import { updateSourceSchema } from "@/lib/schemas/source"

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
		<AutoForm
			defaultValues={{ ...source }}
			onSubmit={async (data) => {
				await updateSource.mutateAsync({
					...(data as any),
					publicId: source.publicId,
				})
			}}
			formSchema={updateSourceSchema.omit({ publicId: true })}
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
				disabled={updateSource.status === "loading"}
				loading={updateSource.status === "loading"}
			>
				Update
			</Button>
		</AutoForm>
	)
}
