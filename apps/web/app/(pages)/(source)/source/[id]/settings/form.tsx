"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useAction } from "@/server/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import type { editSourceAction } from "./_actions"
import { formSchema } from "./schema"
import { IntegrationTools } from "db/src/drizzle/integrations/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Integration } from "db/src/drizzle/schema"
import { PromiseType } from "@/lib/ts/helpers"
import { getCachedSource } from "@/lib/orm"

interface EditSourceFormProps {
	action: typeof editSourceAction
	integrations: Integration[]
	source: PromiseType<ReturnType<typeof getCachedSource>>
	shouldRedirect?: boolean
	onClose?: (id: string) => void
}

export function EditSourceForm({ onClose, action, shouldRedirect = true, integrations, source }: EditSourceFormProps) {
	const router = useRouter()

	if(!source) {
		return null
	}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: source.name,
			url: source.url || undefined,
			integrationId: source.integration?.publicId,
			publicId: source.publicId,
		},
	})

	const editSource = useAction(action, {
		onSuccess(data) {
			router.refresh()

			if (shouldRedirect) {
				router.push(`/source/${data.id}/`)
			}

			onClose?.(data.id)
		},
		onError(error) {
			form.setError("root", error)
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		editSource.mutate(values)
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
								<Input placeholder="Source Name" {...field} required/>
							</FormControl>
							<FormDescription>A name to identify your sources.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="url"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Source URL - Optional</FormLabel>
							<FormControl>
								<Input placeholder="E.g. example.com" {...field}/>
							</FormControl>
							<FormDescription>The endpoint that will send the webhooks.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="integrationId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Integration - Optional</FormLabel>
							{IntegrationTools.length > 0 && (
								<Select
									onValueChange={field.onChange}
									value={field.value || undefined}
								>
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
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormMessage />

				<Button type="submit" disabled={editSource.status === "loading"} loading={editSource.status === "loading"}>
					Save
				</Button>
			</form>
		</Form>
	)
}
