"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formSchema } from "./schema"
import { useAction } from "@/server/client"
import { createSourceAction } from "./_actions"
import { useRouter } from "next/navigation"

export function NewSourceForm() {
	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			url: "",
		},
	})

	const createSource = useAction(createSourceAction, {
		onSuccess(data) {
			router.push(`/source/${data.id}/`)
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
				<Button type="submit" disabled={createSource.status === "loading"} loading={createSource.status === "loading"}>
					Create
				</Button>
			</form>
		</Form>
	)
}
