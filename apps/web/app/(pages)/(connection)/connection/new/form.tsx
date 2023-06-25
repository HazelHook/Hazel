"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useAction } from "@/server/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import type { createConnectionAction } from "./_actions"
import { formSchema } from "./schema"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Destination, Source } from "db/src/schema"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getSeededProfileImageUrl } from "@/lib/utils"

interface NewSourceFormProps {
	action: typeof createConnectionAction
	sources: Source[]
	destinations: Destination[]
}

export function NewConnectionForm({ action, sources, destinations }: NewSourceFormProps) {
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

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		createSource.mutate(values)
	}

	return (
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
							<Select onValueChange={field.onChange} defaultValue={field.value}>
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
							<Select onValueChange={field.onChange} defaultValue={field.value}>
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
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormMessage />

				<Button type="submit" disabled={createSource.status === "loading"} loading={createSource.status === "loading"}>
					Create
				</Button>
			</form>
		</Form>
	)
}
