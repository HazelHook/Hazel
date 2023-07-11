"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, UseFormReturn } from "react-hook-form"
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
import { useAction } from "@/server/client"
import { createIntegrationAction } from "@/app/(pages)/(integration)/integrations/_actions"
import { useRouter } from "next/navigation"

function GetFieldComponent<TSchema extends IntegrationFields>({
	fieldDef,
	pathKey,
	form,
}: {
	fieldDef: IntegrationFormField
	pathKey: any
	form: UseFormReturn<IntegrationSchemaFromFields<TSchema>, any, undefined>
}) {
	if (fieldDef.type === "text") {
		return (
			<FormField
				name={pathKey}
				control={form.control}
				key={pathKey}
				render={({field}) => (
					<FormItem className="mb-2">
						<div className="flex justify-between ml-1 mr-1">
							<FormLabel className="font-light text-gray-300">{fieldDef.label}</FormLabel>
							{/* <FormMessage/> */}
						</div>
						<FormControl>
							<Input placeholder={fieldDef.placeholder} {...field as any} />
						</FormControl>
						<FormDescription className="font-light ml-2 text-xs">
							<IntegrationMDText description={fieldDef.description} />
						</FormDescription>
					</FormItem>
				)}
			/>
		)
	} else if (fieldDef.type === "secret") {
		return (
			<FormField
				name={pathKey}
				control={form.control}
				key={pathKey}
				render={({field}) => (
					<FormItem className="mb-2">
						<div className="flex justify-between ml-1 mr-1">
							<FormLabel className="font-light text-gray-300">{fieldDef.label}</FormLabel>
							{/* <FormMessage /> */}
						</div>
						<FormControl>
							<Input placeholder={fieldDef.placeholder} {...field as any} type="password" />
						</FormControl>
						<FormDescription className="font-light ml-2 text-xs">
							<IntegrationMDText description={fieldDef.description} />
						</FormDescription>
					</FormItem>
				)}
			/>
		)
	} else if (fieldDef.type === "select") {
		return (
			<FormField
				name={pathKey}
				control={form.control}
				key={pathKey}
				render={({field}) => (
					<FormItem className="flex flex-col mb-2">
						<div className="flex justify-between ml-1 mr-1">
							<FormLabel className="font-light text-muted-foreground">{fieldDef.label}</FormLabel>
							{/* <FormMessage /> */}
						</div>
						<Select value={field.value as any} onValueChange={(v) => field.onChange(v as any)}>
							<SelectTrigger className="flex flex-row justify-between p-2 h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 text-muted-foreground">
								<SelectValue placeholder="Select..." />
								<SelectIcon className="SelectIcon">
									<ChevronDownIcon />
								</SelectIcon>
							</SelectTrigger>
							<SelectPortal>
								<SelectContent>
									{fieldDef.options.map((option) => (
										<SelectItem key={option} value={option}>
											{option}
										</SelectItem>
									))}
								</SelectContent>
							</SelectPortal>
						</Select>
						<FormDescription className="font-light ml-2 text-xs">
							<IntegrationMDText description={fieldDef.description} />
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
	const schema = z.object(integration.config)
	const router = useRouter()

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: Object.keys(integration.config).reduce((acc, key) => {
			(acc as any)[key] = ""
			return acc
		}, {}) as any,
	})

	const createIntegration = useAction(createIntegrationAction, {
		onSuccess(data) {
			router.push('/integrations')
		},
		onError(error) {
			form.setError("root", error)
		},
	})

	function onSubmit(values: z.infer<typeof schema>) {
		console.log(values)
		createIntegration.mutate({
			data: values,
			name: values.name!,
		})
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					{Object.entries(integration.general).map(([key, config]) => {
						return <GetFieldComponent fieldDef={config} pathKey={key} form={form} key={key} />
					})}
					<LabeledSeparator label="Configuration" className="mt-6 mb-4" />
					{Object.entries(integration.fields).map(([key, integField]) => {
						return <GetFieldComponent fieldDef={integField} pathKey={key} form={form} key={key} />
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
