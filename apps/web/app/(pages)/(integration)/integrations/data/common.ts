import { z, ZodEnum, ZodObject, ZodSchema, ZodString, ZodTypeAny } from "zod"

import { Integration, IntegrationSlug } from "@/app/(pages)/(integration)/integrations/data"

type IntegrationFormFieldText = {
	type: "text"
	label: string
	placeholder?: string
	description?: string
}
type IntegrationFormFieldSecret = {
	type: "secret"
	label: string
	placeholder?: string
	description?: string
}
type IntegrationFormSelect = {
	type: "select"
	label: string
	placeholder?: string
	description?: string
	options: [string, ...string[]]
}

export type IntegrationFormField = IntegrationFormFieldText | IntegrationFormFieldSecret | IntegrationFormSelect

const nameField = {
	type: "text",
	label: "Integration Name",
	placeholder: "Enter a name for this integration...",
} as const
type GeneralIntegrationSchema = {
	name: typeof nameField
}
export type IntegrationFields = Record<string & {}, IntegrationFormField>

export type IntegrationSchemaFromFields<T extends IntegrationFields> = {
	[K in keyof T]: T[K] extends IntegrationFormFieldText
		? ZodString
		: T[K] extends IntegrationFormFieldSecret
		? ZodString
		: T[K] extends IntegrationFormSelect
		? ZodEnum<T[K]["options"]>
		: never
}

export interface IntegrationForm<T extends IntegrationFields> {
	config: IntegrationSchemaFromFields<T>
	general: GeneralIntegrationSchema
	fields: T
	name: IntegrationSlug
}
function generateSchemaFromFields<T extends IntegrationFields>(fields: T): IntegrationSchemaFromFields<T> {
	const schema = {} as any
	for (const [key, element] of Object.entries(fields)) {
		if (element.type === "text") {
			schema[key] = z.string()
		} else if (element.type === "secret") {
			schema[key] = z.string()
		} else if (element.type === "select") {
			schema[key] = z.enum(element.options)
		}
	}
	return schema
}

export function createIntegrationForm<T extends IntegrationFields>({
	name,
	schema,
}: {
	name: IntegrationSlug
	schema: T
}): IntegrationForm<T> {
	const fields = { name: nameField, ...schema }
	const resultSchema = generateSchemaFromFields(fields)
	return {
		name,
		fields: schema,
		general: { name: nameField },
		config: resultSchema,
	}
}
