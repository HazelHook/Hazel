"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Destination, Integration, Source } from "db/src/drizzle/schema"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useAction } from "@/server/client"
import { getCachedConnection } from "@/lib/orm"
import { PromiseType } from "@/lib/ts/helpers"
import { getSeededProfileImageUrl } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddIcon } from "@/components/icons/pika/add"
import { NewDestinationForm } from "@/app/(pages)/(destination)/destination/new/form"
import { createSourceAction } from "@/server/actions/source"
import { NewSourceForm } from "@/app/(pages)/(source)/source/new/form"

import { createDestinationAction } from "@/server/actions/destination"
import type { updateConnectionAction } from "@/server/actions/connections"
import { updateConnectionSchema } from "@/lib/schemas/connection"

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

	const router = useRouter()
	const form = useForm<z.infer<typeof updateConnectionSchema>>({
		resolver: zodResolver(updateConnectionSchema),
		defaultValues: {
			name: connection.name,
			publicSourceId: connection.source.publicId,
			publiceDestinationId: connection.destination.publicId,
			publicId: connection.publicId,
		},
	})

	const createSource = useAction(action, {
		onSuccess(data) {
			if (isModal) {
				router.back()
			}

			router.refresh()
		},
		onError(error) {
			form.setError("root", error)
		},
	})

	function onSubmit(values: z.infer<typeof updateConnectionSchema>) {
		createSource.mutate(values)
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
										<FormDescription>The source of the incoming request.</FormDescription>
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
						)}
					/>

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
										<FormDescription>The intended destination of the request.</FormDescription>
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
						)}
					/>
					<FormField
						control={form.control}
						name="delay"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Delay</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="Delay ..."
										{...field}
										onChange={(event) => field.onChange(+event.target.value)}
									/>
								</FormControl>
								<FormDescription>Add a delay to your webhook delivery.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="retryDelay"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Retry Delay</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="Delay ..."
										{...field}
										onChange={(event) => field.onChange(+event.target.value)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="retryCount"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Retry Count</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="Retry Counts ..."
										{...field}
										onChange={(event) => field.onChange(+event.target.value)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* <FormField
						control={form.control}
						name="delay"
						render={({ field }) => (
							<FormItem>
								<RefreshIcon />
								<div className="flex flex-row items-center gap-1">
									Retry
									<Select>
										<TextSelectTrigger>
											<SelectValue placeholder="exponentially" />
										</TextSelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="apple">Apple</SelectItem>
												<SelectItem value="banana">Banana</SelectItem>
												<SelectItem value="blueberry">Blueberry</SelectItem>
												<SelectItem value="grapes">Grapes</SelectItem>
												<SelectItem value="pineapple">Pineapple</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
									every
									<Select>
										<TextSelectTrigger>
											<SelectValue placeholder="1 day" />
										</TextSelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="apple">Apple</SelectItem>
												<SelectItem value="banana">Banana</SelectItem>
												<SelectItem value="blueberry">Blueberry</SelectItem>
												<SelectItem value="grapes">Grapes</SelectItem>
												<SelectItem value="pineapple">Pineapple</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
									up to
									<Select>
										<TextSelectTrigger>
											<SelectValue placeholder="5" />
										</TextSelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="5">Apple</SelectItem>
												<SelectItem value="banana">Banana</SelectItem>
												<SelectItem value="blueberry">Blueberry</SelectItem>
												<SelectItem value="grapes">Grapes</SelectItem>
												<SelectItem value="pineapple">Pineapple</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
									times
								</div>
							</FormItem>
						)}
					/> */}
					<FormMessage />
					<Button
						type="submit"
						disabled={createSource.status === "loading"}
						loading={createSource.status === "loading"}
					>
						Update
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
