"use client"

import React, { ReactNode } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "../button"
import { Form } from "../form"
import { cn, minDelay } from "../utils"
import AutoFormObject from "./fields/object"
import { FieldConfig } from "./types"
import { getDefaultValues, getObjectFormSchema, ZodObjectOrWrapped } from "./utils"

export function AutoFormSubmit({ children }: { children?: React.ReactNode }) {
	return <Button type="submit">{children ?? "Submit"}</Button>
}

export function AutoForm<SchemaType extends ZodObjectOrWrapped>({
	formSchema,
	values: valuesProp,
	onValuesChange: onValuesChangeProp,
	onParsedValuesChange,
	onSubmit: onSubmitProp,
	fieldConfig,
	children,
	className,
	defaultValues: cDefaultValues,
	toastValues,
	minSubmitDelay = 1000,
}: {
	formSchema: SchemaType
	values?: Partial<z.infer<SchemaType>>
	onValuesChange?: (values: Partial<z.infer<SchemaType>>) => void
	onParsedValuesChange?: (values: Partial<z.infer<SchemaType>>) => void
	onSubmit?: (values: z.infer<SchemaType>) => Promise<unknown>
	fieldConfig?: FieldConfig<z.infer<SchemaType>>
	children?: ReactNode | ((minSubmitDelay: number) => ReactNode)
	defaultValues?: any
	className?: string
	minSubmitDelay?: number
	toastValues?: {
		loading: string
		success: string
		error: string
	}
}) {
	const objectFormSchema = getObjectFormSchema(formSchema)
	const defaultValues: DefaultValues<z.infer<typeof objectFormSchema>> =
		cDefaultValues || getDefaultValues(objectFormSchema)

	const form = useForm<z.infer<typeof objectFormSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues,
		values: valuesProp,
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		const parsedValues = formSchema.safeParse(values)
		if (parsedValues.success) {
			if (onSubmitProp) {
				toast.promise(minDelay(onSubmitProp(parsedValues.data), minSubmitDelay), {
					loading: toastValues?.loading || "Saving Data...",
					success: toastValues?.success || "Sucessfully Saved",
					error: (error) => {
						return (
							String(error) ||
							toastValues?.error ||
							"There was an error saving... Please try again and contact us if it persists."
						)
					},
				})
			}
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => {
					form.handleSubmit(onSubmit)(e)
				}}
				onChange={() => {
					const values = form.getValues()
					onValuesChangeProp?.(values)
					const parsedValues = formSchema.safeParse(values)
					if (parsedValues.success) {
						onParsedValuesChange?.(parsedValues.data)
					}
				}}
				className={cn("space-y-5", className)}
			>
				<AutoFormObject schema={objectFormSchema} form={form} fieldConfig={fieldConfig} />

				{typeof children === "function" ? children?.(minSubmitDelay) : children}
			</form>
		</Form>
	)
}

export default AutoForm
