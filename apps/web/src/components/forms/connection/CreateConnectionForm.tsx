"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { createConnectionAction } from "@/server/actions/connections"
import type { Destination, Integration, Source } from "db/src/drizzle/schema"
import { CreateDestinationForm } from "../destination/CreateDestinationForm"
import { createSourceAction } from "@/server/actions/source"
import { createDestinationAction } from "@/server/actions/destination"
import { CreateSourceForm } from "../source/CreateSourceForm"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { createConnectionSchema } from "@/lib/schemas/connection"
import { useAction } from "@/server/client"
import { z } from "zod"
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getSeededProfileImageUrl } from "@/lib/utils"
import { AddIcon } from "@/components/icons/pika/add"
import { Button } from "@/components/ui/button"
import AutoForm from "@/components/ui/auto-form"

export interface CreateConnectionFormProps {
	action: typeof createConnectionAction
	sources: Source[]
	destinations: Destination[]
	integrations: Integration[]
}

export const CreateConnectionForm = ({ action, sources, destinations, integrations }: CreateConnectionFormProps) => {
	const searchParams = useSearchParams()
	const [sourceModal, setSourceModal] = useState(false)
	const [destinationModal, setDestinationModal] = useState(false)

	const [values, setValues] = useState<z.infer<typeof createConnectionSchema>>({
		name: "",
		publicSourceId: searchParams.get("source") || sources[0]?.publicId || "",
		publiceDestinationId: searchParams.get("destination") || destinations[0]?.publicId || "",
	})

	const router = useRouter()

	const createSource = useAction(action, {
		onSuccess(data) {
			router.push(`/connection/${data.id}/`)
		},
	})

	return (
		<>
			<AutoForm
				values={values}
				onValuesChange={(v) => setValues({ ...values, ...v } as any)}
				formSchema={createConnectionSchema}
				fieldConfig={{
					name: {
						description: "A name to describe your connection",
						inputProps: {
							placeholder: "Connection Name...",
						},
					},
					publicSourceId: {
						fieldType: ({ label, isRequired, field, fieldConfigItem, fieldProps }) => (
							<>
								<FormItem>
									<FormLabel>
										{label}
										{isRequired && <span className="text-destructive"> *</span>}
									</FormLabel>
									<FormControl>
										{sources.length > 0 && (
											<Select
												onValueChange={(value) => {
													if (value !== "") {
														field.onChange(value)
													}
												}}
												value={field.value || undefined}
											>
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
												<SelectContent>
													{sources.map((source) => (
														<SelectItem key={source.publicId} value={source.publicId}>
															<div className="flex flex-row items-center">
																<Avatar className="mr-2 w-4 h-4">
																	<AvatarImage
																		src={getSeededProfileImageUrl(source.publicId)}
																	/>
																</Avatar>
																{source.name}
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
								<div className="flex justify-center">
									<Button variant="outline" type="button" onClick={() => setSourceModal(true)}>
										<AddIcon className="w-5 h-5 mr-2" />
										Create New Source
									</Button>
								</div>
							</>
						),
					},
					publiceDestinationId: {
						fieldType: ({ label, isRequired, field, fieldConfigItem, fieldProps }) => (
							<>
								<FormItem>
									<FormLabel>
										{label}
										{isRequired && <span className="text-destructive"> *</span>}
									</FormLabel>
									<FormControl>
										{destinations.length > 0 && (
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
												<SelectContent>
													{destinations.map((source) => (
														<SelectItem key={source.publicId} value={source.publicId}>
															<div className="flex flex-row items-center">
																<Avatar className="mr-2 w-4 h-4">
																	<AvatarImage
																		src={getSeededProfileImageUrl(source.publicId)}
																	/>
																</Avatar>
																{source.name}
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
								<div className="flex justify-center">
									<Button
										variant="outline"
										type="button"
										onClick={() => {
											setDestinationModal(true)
										}}
									>
										<AddIcon className="w-5 h-5 mr-2" />
										Create New Destination
									</Button>
								</div>
							</>
						),
					},
				}}
				onSubmit={async (data) => {
					await createSource.mutateAsync(data)
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

			<Dialog open={sourceModal} onOpenChange={setSourceModal}>
				<DialogContent>
					<CreateSourceForm
						shouldRedirect={false}
						onClose={(id) => {
							setSourceModal(false)
							setValues({
								...values,
								publicSourceId: id,
							} as any)
						}}
						action={createSourceAction}
						integrations={integrations}
					/>
				</DialogContent>
			</Dialog>

			<Dialog open={destinationModal} onOpenChange={setDestinationModal}>
				<DialogContent>
					<CreateDestinationForm
						onClose={(id) => {
							setDestinationModal(false)
							setValues({
								...values,
								publiceDestinationId: id,
							} as any)
						}}
						shouldRedirect={false}
						action={createDestinationAction}
					/>
				</DialogContent>
			</Dialog>
		</>
	)
}
