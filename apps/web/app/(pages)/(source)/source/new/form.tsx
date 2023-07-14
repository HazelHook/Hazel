"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useAction } from "@/server/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import type { createSourceAction } from "./_actions"
import { formSchema } from "./schema"
import { IntegrationTools } from "db/src/drizzle/integrations/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCachedIntegrations } from "@/lib/orm"
import { PromiseType } from "@/lib/ts/helpers"

interface NewSourceFormProps {
	action: typeof createSourceAction
	integrations: PromiseType<ReturnType<typeof getCachedIntegrations>>
	shouldRedirect?: boolean
	onClose?: (id: string) => void
}

export function NewSourceForm({ onClose, action, shouldRedirect = true, integrations }: NewSourceFormProps) {
	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			url: "",
		},
	})

	const createSource = useAction(action, {
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
								<Input placeholder="Source ..." {...field} />
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
							<FormLabel>Source Url</FormLabel>
							<FormControl>
								<Input placeholder="Url" {...field} />
							</FormControl>
							<FormDescription>HTTP endpoint that will send the webhooks</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="tool"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Integration</FormLabel>
							{IntegrationTools.length > 0 && (
								<Select
									onValueChange={(value) => {
										if (value !== "") {
											field.onChange(value as any)
										}
									}}
									value={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue
												placeholder={<p className="text-muted-foreground">Connect an integration</p>}
												className="focus:text-muted-foreground"
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent className="max-h-96">
										{integrations.map((integration) => (
											<SelectItem key={integration.id} value={integration.name}>
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

				<Button type="submit" disabled={createSource.status === "loading"} loading={createSource.status === "loading"}>
					Create
				</Button>
			</form>
		</Form>
	)
}
