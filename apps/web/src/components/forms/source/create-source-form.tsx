"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { createSourceAction } from "@/server/actions/source"
import { createSourceSchema } from "@/lib/schemas/source"

import { Integration } from "@hazel/db/schema"
import { INTEGRATIONS, IntegrationTool } from "@hazel/integrations/web"
import { useAction } from "@hazel/server/actions/client"
import { AutoForm, AutoFormInputComponentProps } from "@hazel/ui/auto-form"
import { Button } from "@hazel/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@hazel/ui/command"
import { Dialog, DialogContent, DialogHeader } from "@hazel/ui/dialog"
import { FormDescription } from "@hazel/ui/form"
import { Image } from "@hazel/ui/image"
import { Label } from "@hazel/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@hazel/ui/popover"
import { Separator } from "@hazel/ui/separator"
import { z } from "zod"

import { NewIntegrationForm } from "../integration/create-integration-form"

interface CreateSourceFormProps {
	action: typeof createSourceAction
	integrations: Integration[]
	shouldRedirect?: boolean
	onSuccess?: (id: string) => void
}

export function CreateSourceForm({ onSuccess, action, shouldRedirect = true, integrations }: CreateSourceFormProps) {
	const router = useRouter()

	const [selectedIntegration, setSelectedIntegration] = useState<IntegrationTool>()
	const [openCreationModal, setOpenCreationModal] = useState(false)
	const [formValues, setFormValues] = useState<Partial<z.infer<typeof createSourceSchema>>>()

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
		<>
			<AutoForm
				onSubmit={async (data) => {
					await createSource.mutateAsync(data)
				}}
				values={formValues}
				onValuesChange={setFormValues}
				formSchema={createSourceSchema}
				fieldConfig={{
					name: {
						description: "A name to identify your source.",
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
						}: AutoFormInputComponentProps) => {
							const [open, setOpen] = useState(false)

							return (
								<div className="space-y-2">
									<Label className="">
										{label}
										{isRequired && <span className="text-destructive"> *</span>}
									</Label>
									<Popover open={open} onOpenChange={setOpen}>
										<PopoverTrigger asChild>
											<Button
												type="button"
												variant="outline"
												aria-expanded={open}
												role="combobox"
												className="w-full justify-start"
											>
												{field.value ? (
													<>
														<Image
															layout="constrained"
															width={18}
															height={18}
															src={`/assets/integrations/${selectedIntegration?.slug}.svg`}
															alt={selectedIntegration?.slug}
															className="mr-2"
														/>
														{selectedIntegration?.name}
													</>
												) : (
													"Select an Integration..."
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent align="start">
											<Command>
												<CommandInput placeholder="Search for Integration" />
												<CommandList>
													<CommandGroup>
														<CommandEmpty>No Integrations available</CommandEmpty>
														{Object.values(INTEGRATIONS)
															.filter((integration) => !integration.disabled)
															.map((integration) => (
																<CommandItem
																	key={integration.slug}
																	onSelect={() => {
																		setSelectedIntegration(integration)
																		setOpen(false)
																		setOpenCreationModal(true)
																	}}
																>
																	<Image
																		layout="constrained"
																		width={18}
																		height={18}
																		src={`/assets/integrations/${integration.slug}.svg`}
																		alt={integration.slug}
																		className="mr-2"
																	/>
																	{integration.name}
																</CommandItem>
															))}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
									{fieldConfigItem.description && (
										<FormDescription>{fieldConfigItem.description}</FormDescription>
									)}
								</div>
							)
						},
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
			<Dialog
				open={openCreationModal && !!selectedIntegration}
				onOpenChange={(open) => setOpenCreationModal(open)}
			>
				<DialogContent className="flex flex-col justify-center items-center">
					<DialogHeader className="w-full">
						<div className="flex flex-row gap-4 ml-1 mr-1 justify-start w-full">
							<img
								src={`/assets/integrations/${selectedIntegration?.slug}.svg`}
								alt={selectedIntegration?.slug}
								className="w-7 h-7"
							/>
							<h3>Add {selectedIntegration?.name} Integration</h3>
						</div>
					</DialogHeader>

					<Separator />
					<NewIntegrationForm
						integration={selectedIntegration!}
						onSuccess={(id) => {
							setFormValues({ ...formValues, integrationId: id })
							setOpenCreationModal(false)
						}}
					/>
				</DialogContent>
			</Dialog>
		</>
	)
}
