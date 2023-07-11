"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { UseFormReturn, useForm } from "react-hook-form"
import * as z from "zod"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
	IntegrationFields,
	IntegrationForm,
	IntegrationFormField,
	IntegrationSchemaFromFields,
} from "@/app/(pages)/(integration)/integrations/data/common"
import { IntegrationMDText } from "@/app/(pages)/(integration)/integrations/data/integration-md-text"
import { LabeledSeparator } from "@/components/LabeledSeparator"
import {
	Select,
	SelectIcon,
	SelectPortal,
	SelectTrigger,
} from "@radix-ui/react-select"
import { SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "@/components/icons/pika/chevronDown"

function GetFieldComponent<TSchema extends IntegrationFields>({
	field,
	pathKey,
	form,
}: {
	field: IntegrationFormField
	pathKey: any
	form: UseFormReturn<IntegrationSchemaFromFields<TSchema>, any, undefined>
}) {
	if (field.type === "text") {
		return (
			<FormField
				key={field.label}
				control={form.control}
				name={pathKey}
				render={() => (
					<FormItem className="mb-2">
						<div className="flex justify-between ml-1 mr-1">
							<FormLabel className="font-light text-gray-300">{field.label}</FormLabel>
							<FormMessage />
						</div>
						<FormControl>
							<Input placeholder={field.placeholder} />
						</FormControl>
						<FormDescription className="font-light ml-2 text-xs">
							<IntegrationMDText description={field.description} />
						</FormDescription>
					</FormItem>
				)}
			/>
		)
	} else if (field.type === "secret") {
		return (
			<FormField
				key={field.label}
				control={form.control}
				name={pathKey}
				render={() => (
					<FormItem className="mb-2">
						<div className="flex justify-between ml-1 mr-1">
							<FormLabel className="font-light text-gray-300">{field.label}</FormLabel>
							<FormMessage />
						</div>
						<FormControl>
							<Input placeholder={field.placeholder} type="password" />
						</FormControl>
						<FormDescription className="font-light ml-2 text-xs">
							<IntegrationMDText description={field.description} />
						</FormDescription>
					</FormItem>
				)}
			/>
		)
	} else if (field.type === "select") {
		return (
			<FormField
				key={field.label}
				control={form.control}
				name={pathKey}
				render={() => (
					<FormItem className="flex flex-col mb-2">
						<div className="flex justify-between ml-1 mr-1">
							<FormLabel className="font-light text-gray-300">{field.label}</FormLabel>
							<FormMessage />
						</div>
						<Select>
							<SelectTrigger className="flex flex-row justify-between p-2 h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 text-muted-foreground">
								<SelectValue placeholder="Select..."/>
								<SelectIcon className="SelectIcon">
									<ChevronDownIcon />
								</SelectIcon>
							</SelectTrigger>
							<SelectPortal>
								<SelectContent>
									{field.options.map((option) => (
										<SelectItem key={option} value={option}>
											{option}
										</SelectItem>
									))}
								</SelectContent>
							</SelectPortal>
						</Select>
						<FormDescription className="font-light ml-2 text-xs">
							<IntegrationMDText description={field.description} />
						</FormDescription>
					</FormItem>
				)}
			/>
		)
	}

	return <></>
}

export function IntegrationFormModal<T extends IntegrationForm<TSchema>, TSchema extends IntegrationFields>({
	integration,
}: { integration: T }) {
	const formSchema = z.object(integration.config)

	const form = useForm<typeof integration.config>({
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

	function onSubmit(values: typeof integration.config) {
		// createSource.mutate(values)
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					{Object.entries(integration.general).map(([key, config]) => {
						return <GetFieldComponent field={config} pathKey={key} form={form} key={key} />
					})}
					<LabeledSeparator label="Configuration" className="mt-6 mb-4" />
					{Object.entries(integration.fields).map(([key, integField]) => {
						return <GetFieldComponent field={integField} pathKey={key} form={form} key={key} />
					})}
					{/* <FormMessage /> */}

					<Button type="submit" disabled={false} loading={false} className="w-full mt-3" variant="outline">
						Create Integration
					</Button>
				</form>
			</Form>
		</>
	)
}
