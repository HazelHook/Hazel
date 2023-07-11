"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { IntegrationForm, IntegrationFormField } from "@/app/(pages)/(integration)/integrations/data/common"
import { IntegrationMDText } from "@/app/(pages)/(integration)/integrations/data/integration-md-text"

export function IntegrationFormModal<
	T extends IntegrationForm<TSchema>,
	TSchema extends Record<string & {}, IntegrationFormField>,
>({ integration }: { integration: T }) {
	const formSchema = z.object(integration.schema)

	const form = useForm<typeof integration.schema>({
		resolver: zodResolver(formSchema),
	})

	// const createSource = useAction(action, {
	// 	onSuccess(data) {
	// 		router.push(`/connection/${data.id}/`)
	// 	},
	// 	onError(error) {
	// 		form.setError("root", error)
	// 	},
	// })

	function onSubmit(values: typeof integration.schema) {
		// createSource.mutate(values)
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					{Object.entries(integration.fields).map(([key, integField]) => {
						if (integField.type === "text") {
							return (
								<FormField
									key={integField.label}
									control={form.control}
									name={key as any}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{integField.label}</FormLabel>
											<FormControl>
												<Input placeholder={integField.placeholder} />
											</FormControl>
											<FormDescription className="font-light"><IntegrationMDText description={integField.description}/></FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							)
						} else if (integField.type === "secret") {
							return (
								<FormField
									key={integField.label}
									control={form.control}
									name={key as any}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{integField.label}</FormLabel>
											<FormControl>
												<Input placeholder={integField.placeholder} type="password" />
											</FormControl>
											<FormDescription><IntegrationMDText description={integField.description}/></FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							)
						}

						return <></>
					})}
					<FormMessage />
				</form>
			</Form>
		</>
	)
}
