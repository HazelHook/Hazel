"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Destination, Integration, Source } from "db/src/drizzle/schema"
import * as z from "zod"

import { useAction } from "@/server/client"
import { getCachedConnection } from "@/lib/orm"
import { PromiseType } from "@/lib/ts/helpers"
import { getSeededProfileImageUrl } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddIcon } from "@/components/icons/pika/add"
import { createSourceAction } from "@/server/actions/source"

import { createDestinationAction } from "@/server/actions/destination"
import type { updateConnectionAction } from "@/server/actions/connections"
import { updateConnectionSchema } from "@/lib/schemas/connection"
import { CreateSourceForm } from "@/components/forms/source/CreateSourceForm"
import { CreateDestinationForm } from "@/components/forms/destination/CreateDestinationForm"
import AutoForm from "@/components/ui/auto-form"
import Link from "next/link"
import { LoadingButton } from "@/components/loading-button"

interface NewSourceFormProps {
	action: typeof updateConnectionAction
	sources: Source[]
	destinations: Destination[]
	integrations: Integration[]
	connection: PromiseType<ReturnType<typeof getCachedConnection>>
	isModal?: boolean
}

export function UpdateConnectionForm({
	action,
	sources,
	isModal,
	destinations,
	integrations,
	connection,
}: NewSourceFormProps) {
	const [sourceModal, setSourceModal] = useState(false)
	const [destinationModal, setDestinationModal] = useState(false)

	const [values, setValues] = useState<Partial<z.infer<typeof updateConnectionSchema>>>({
		name: connection.name,
		publicSourceId: connection.source.publicId,
		publiceDestinationId: connection.destination.publicId,
		publicId: connection.publicId,
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
				onSubmit={createSource.mutateAsync}
				fieldConfig={{
					name: {
						description: "A name to identify your connection.",
					},
					publicId: { hidden: true },
					publicSourceId: {
						description: "The source of the incoming request.",
						fieldType: ({ label, isRequired, field, fieldConfigItem, fieldProps }) => (
							<FormItem>
								<FormLabel>
									{label}
									{isRequired && <span className="text-destructive"> *</span>}
								</FormLabel>
								{sources.length > 0 && (
									<Select
										onValueChange={(value) => {
											if (value !== "") {
												field.onChange(value)
											}
										}}
										value={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select any source to connect" />
											</SelectTrigger>
										</FormControl>
										{fieldConfigItem.description && (
											<FormDescription>{fieldConfigItem.description}</FormDescription>
										)}
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
											<Button
												variant="ghost"
												className="w-full flex flex-row justify-start py-0 px-2"
												type="button"
												onClick={() => setSourceModal(true)}
											>
												<AddIcon className="w-5 h-5 mr-2" />
												Create New Source
											</Button>
										</SelectContent>
									</Select>
								)}
								<FormMessage />
							</FormItem>
						),
					},
					publiceDestinationId: {
						description: "The intended destination of the request.",
						fieldType: ({ label, isRequired, field, fieldConfigItem, fieldProps }) => (
							<FormItem>
								<FormLabel>
									{label}
									{isRequired && <span className="text-destructive"> *</span>}
								</FormLabel>
								{sources.length > 0 && (
									<Select
										onValueChange={(value) => {
											if (value !== "") {
												field.onChange(value)
											}
										}}
										value={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select any source to connect" />
											</SelectTrigger>
										</FormControl>
										{fieldConfigItem.description && (
											<FormDescription>{fieldConfigItem.description}</FormDescription>
										)}
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
											<Button
												variant="ghost"
												className="w-full flex flex-row justify-start py-0 px-2"
												type="button"
												onClick={() => setDestinationModal(true)}
											>
												<AddIcon className="w-5 h-5 mr-2" />
												Create New Destination
											</Button>
										</SelectContent>
									</Select>
								)}
								<FormMessage />
							</FormItem>
						),
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
			<Dialog open={sourceModal} onOpenChange={setSourceModal}>
				<DialogContent>
					<CreateSourceForm
						shouldRedirect={false}
						onClose={(id) => {
							setSourceModal(false)
							setValues({ ...values, publicSourceId: id })
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
							setValues({ ...values, publiceDestinationId: id })
						}}
						shouldRedirect={false}
						action={createDestinationAction}
					/>
				</DialogContent>
			</Dialog>
		</>
	)
}
