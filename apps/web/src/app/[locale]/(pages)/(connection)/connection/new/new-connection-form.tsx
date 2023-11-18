"use client"

import { CreateDestinationForm } from "@/components/forms/destination/CreateDestinationForm"
import { CreateSourceForm } from "@/components/forms/source/create-source-form"
import { HorizontalStep } from "@/components/horizontal-step"
import { createConnectionSchema } from "@/lib/schemas/connection"
import type { createConnectionAction } from "@/server/actions/connections"
import { createDestinationAction } from "@/server/actions/destination"
import { createSourceAction } from "@/server/actions/source"
import type { Destination, Integration, Source } from "@hazel/db"
import { LogInLeftIcon, CheckTickIcon, InboxInIcon } from "@hazel/icons"
import { useAction } from "@hazel/server/actions/client"
import { Button } from "@hazel/ui/button"
import {
	Command,
	CommandInput,
	CommandList,
	CommandGroup,
	CommandItem,
	CommandSeparator,
	CommandShortcut,
	CommandEmpty,
} from "@hazel/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@hazel/ui/form"
import { Input } from "@hazel/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@hazel/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

export type NewConnectionFormProps = {
	action: typeof createConnectionAction
	sources: Source[]
	destinations: Destination[]
	integrations: Integration[]
}

export const NewConnectionForm = ({ action, sources, destinations, integrations }: NewConnectionFormProps) => {
	const searchParams = useSearchParams()
	const router = useRouter()

	const form = useForm({
		resolver: zodResolver(createConnectionSchema),
		defaultValues: {
			name: "",
			publicSourceId: searchParams.get("source") || sources[0]?.publicId || "",
			publiceDestinationId: searchParams.get("destination") || destinations[0]?.publicId || "",
		},
	})

	const [sourceTabs, setSourceTabs] = useState<"select" | "create" | string>(
		sources.length === 0 ? "create" : "select",
	)

	const [destionationTabs, setDestionationTabs] = useState<"select" | "create" | string>(
		destinations.length === 0 ? "create" : "select",
	)

	const [currSourceId, currDestId] = form.watch(["publicSourceId", "publiceDestinationId"])

	const selectedSource = useMemo(
		() => sources.find((source) => source.publicId === currSourceId),
		[sources, currSourceId],
	)

	const selectedDestination = useMemo(
		() => destinations.find((dest) => dest.publicId === currDestId),
		[destinations, currDestId],
	)

	const createConnection = useAction(action, {
		onSuccess(data) {
			router.push(`/connection/${data.id}/`)
		},
	})

	function onSubmit(values: z.infer<typeof createConnectionSchema>) {
		createConnection.mutateAsync(values)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<HorizontalStep>
					<div className="flex flex-col gap-8 mb-6">
						<div>
							<h3 className="text-lg font-semibold">Add a source</h3>
							<p className="text-muted-foreground">
								Defines where your event comes from, essentially connecting to your third-party webhook
								service. Sources are not limited to a single connection and can be reused in multiple
								connections.
							</p>
						</div>

						<div>
							<Tabs onValueChange={setSourceTabs} value={sourceTabs}>
								<TabsList>
									<TabsTrigger value="select">Use existing Source</TabsTrigger>
									<TabsTrigger value="create">Create New Source</TabsTrigger>
								</TabsList>
								<TabsContent value="select" className="border rounded-lg bordershadow-md">
									<Command className="h-[300px]">
										<CommandInput placeholder="Search sources by name..." />
										<CommandList>
											<CommandEmpty>No Sources available</CommandEmpty>
											{selectedSource && (
												<CommandGroup heading="Select Source">
													<CommandItem
														key={selectedSource.publicId}
														value={`${selectedSource.name} ${selectedSource.publicId}`}
													>
														<div className="flex gap-2 items-center">
															<LogInLeftIcon className="w-4 h-4" />
															{selectedSource.name}
															<CommandShortcut>
																<CheckTickIcon className="w-4 h-4" />
															</CommandShortcut>
														</div>
													</CommandItem>
												</CommandGroup>
											)}
											<CommandGroup heading="Sources">
												{sources
													.filter((source) => source.publicId !== currSourceId)
													.map((source) => (
														<CommandItem
															key={source.publicId}
															value={`${source.name} ${source.publicId}`}
															onSelect={() => {
																form.setValue("publicSourceId", source.publicId)
															}}
														>
															<div className="flex gap-2 items-center">
																<LogInLeftIcon className="w-4 h-4" />
																{source.name}
															</div>
														</CommandItem>
													))}
											</CommandGroup>
										</CommandList>
									</Command>
								</TabsContent>
								<TabsContent value="create" className="rounded-lg border shadow-md p-4">
									<CreateSourceForm
										shouldRedirect={false}
										onSuccess={(id) => {
											setSourceTabs("select")
											form.setValue("publicSourceId", id)
										}}
										action={createSourceAction}
										integrations={integrations}
									/>
								</TabsContent>
							</Tabs>
						</div>
					</div>
				</HorizontalStep>
				<HorizontalStep>
					<div className="flex flex-col gap-8 mb-6">
						<div>
							<h3 className="text-lg font-semibold">Add a destination</h3>
							<p className="text-muted-foreground">
								Define where your events should be sent to. Sources are not limited to a single
								connection and can be reused in multiple connections.
							</p>
						</div>
						<div>
							<Tabs onValueChange={setDestionationTabs} value={destionationTabs}>
								<TabsList>
									<TabsTrigger value="select">Use existing Destination</TabsTrigger>
									<TabsTrigger value="create">Create New Destination</TabsTrigger>
								</TabsList>
								<TabsContent value="select" className="border rounded-lg bordershadow-md ">
									<Command className="h-[300px]">
										<CommandInput placeholder="Search Destinations by name..." />
										<CommandList>
											<CommandEmpty>No Destinations available</CommandEmpty>
											{selectedDestination && (
												<CommandGroup heading="Select Destination">
													<CommandItem
														key={selectedDestination.publicId}
														value={`${selectedDestination.name} ${selectedDestination.publicId}`}
													>
														<div className="flex gap-2 items-center">
															<LogInLeftIcon className="w-4 h-4" />
															{selectedDestination.name}
															<CommandShortcut>
																<CheckTickIcon className="w-4 h-4" />
															</CommandShortcut>
														</div>
													</CommandItem>
												</CommandGroup>
											)}
											<CommandGroup heading="Destinations">
												{destinations
													.filter((dest) => dest.publicId !== currDestId)
													.map((dest) => (
														<CommandItem
															key={dest.publicId}
															value={`${dest.name} ${dest.publicId}`}
															onSelect={() => {
																form.setValue("publiceDestinationId", dest.publicId)
															}}
														>
															<div className="flex gap-2 items-center">
																<InboxInIcon className="w-4 h-4" />
																{dest.name}
															</div>
														</CommandItem>
													))}
											</CommandGroup>
										</CommandList>
									</Command>
								</TabsContent>
								<TabsContent value="create" className="rounded-lg border shadow-md p-4">
									<CreateDestinationForm
										onSuccess={(id) => {
											form.setValue("publiceDestinationId", id)
										}}
										shouldRedirect={false}
										action={createDestinationAction}
									/>
								</TabsContent>
							</Tabs>
						</div>
					</div>
				</HorizontalStep>
				<HorizontalStep>
					<div className="flex flex-col gap-8">
						<div>
							<h3 className="text-lg font-semibold">Add connection details</h3>
							<p className="text-muted-foreground">
								Optional give your connection a name. Highly recommended to keep your connections
								organized
							</p>
						</div>

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</HorizontalStep>

				<HorizontalStep>
					<div className="flex flex-col gap-8">
						<div>
							<h3 className="text-lg font-semibold">Create Connection</h3>
						</div>

						<Button
							className="w-fit"
							type="submit"
							disabled={createConnection.status === "loading"}
							loading={createConnection.status === "loading"}
						>
							Create
						</Button>
					</div>
				</HorizontalStep>
			</form>
		</Form>
	)
}
