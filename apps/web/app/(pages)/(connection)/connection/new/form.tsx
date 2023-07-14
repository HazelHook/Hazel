"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Destination, Integration, Source } from "db/src/drizzle/schema"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useAction } from "@/server/client"
import { getSeededProfileImageUrl } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddIcon } from "@/components/icons/pika/add"
import { createDestinationAction } from "@/app/(pages)/(destination)/destination/new/_actions"
import { NewDestinationForm } from "@/app/(pages)/(destination)/destination/new/form"
import { createSourceAction } from "@/app/(pages)/(source)/source/new/_actions"
import { NewSourceForm } from "@/app/(pages)/(source)/source/new/form"

import type { createConnectionAction } from "./_actions"
import { formSchema } from "./schema"
import { cleanFormData } from "@/lib/formatters"

interface NewSourceFormProps {
	action: typeof createConnectionAction
	sources: Source[]
	destinations: Destination[]
	integrations: Integration[]
}

export function NewConnectionForm({ action, sources, destinations, integrations }: NewSourceFormProps) {
	const [sourceModal, setSourceModal] = useState(false)
	const [destinationModal, setDestinationModal] = useState(false)

	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			publicSourceId: sources[0]?.publicId || "",
			publiceDestinationId: destinations[0]?.publicId || "",
		},
	})

	const createSource = useAction(action, {
		onSuccess(data) {
			router.push(`/connection/${data.id}/`)
		},
		onError(error) {
			form.setError("root", error)
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		createSource.mutate(cleanFormData(values))
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="Connection ..." {...field} />
								</FormControl>
								<FormDescription>A name to identify your connection.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="publicSourceId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Source</FormLabel>
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
												<SelectValue placeholder="Select a verified email to display" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{sources.map((source) => (
												<SelectItem key={source.publicId} value={source.publicId}>
													<div className="flex flex-row items-center">
														<Avatar className="mr-2 w-4 h-4">
															<AvatarImage src={getSeededProfileImageUrl(source.publicId)} />
														</Avatar>
														{source.name}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex justify-center">
						<Button variant="outline" type="button" onClick={() => setSourceModal(true)}>
							<AddIcon className="w-5 h-5 mr-2" />
							Create New Source
						</Button>
					</div>
					<FormField
						control={form.control}
						name="publiceDestinationId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Destination</FormLabel>
								{destinations.length > 0 && (
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
												<SelectValue placeholder="Select a verified email to display" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{destinations.map((source) => (
												<SelectItem key={source.publicId} value={source.publicId}>
													<div className="flex flex-row items-center">
														<Avatar className="mr-2 w-4 h-4">
															<AvatarImage src={getSeededProfileImageUrl(source.publicId)} />
														</Avatar>
														{source.name}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormMessage />

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

					<Button
						type="submit"
						disabled={createSource.status === "loading"}
						loading={createSource.status === "loading"}
					>
						Create
					</Button>
				</form>
			</Form>

			<Dialog open={sourceModal} onOpenChange={setSourceModal}>
				<DialogContent>
					<NewSourceForm
						shouldRedirect={false}
						onClose={(id) => {
							setSourceModal(false)
							form.setValue("publicSourceId", id, { shouldValidate: true })
						}}
						action={createSourceAction}
						integrations={integrations}
					/>
				</DialogContent>
			</Dialog>

			<Dialog open={destinationModal} onOpenChange={setDestinationModal}>
				<DialogContent>
					<NewDestinationForm
						onClose={(id) => {
							console.log(id)
							setDestinationModal(false)
							form.setValue("publiceDestinationId", id, {
								shouldValidate: true,
							})
						}}
						shouldRedirect={false}
						action={createDestinationAction}
					/>
				</DialogContent>
			</Dialog>
		</>
	)
}
