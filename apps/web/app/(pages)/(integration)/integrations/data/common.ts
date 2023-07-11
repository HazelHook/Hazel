import { Integration, IntegrationSlug } from "@/app/(pages)/(integration)/integrations/data"
import { ZodObject, ZodSchema, ZodString, ZodTypeAny, z } from "zod"

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
export type IntegrationFormField = IntegrationFormFieldText | IntegrationFormFieldSecret

const nameField = {
	type: "text",
	label: "Integration Name",
	placeholder: "Enter a name for your integration"
} as const

type IntegrationSchemaFromFields<T extends Record<string & {}, IntegrationFormField>> = {
	[K in keyof T]: T[K] extends IntegrationFormFieldText
		? ZodString
		: T[K] extends IntegrationFormFieldSecret
		? ZodString
		: never
}

export interface IntegrationForm<T extends Record<string & {}, IntegrationFormField>> {
	schema: IntegrationSchemaFromFields<T>
	fields: T
	name: IntegrationSlug
}
function generateSchemaFromFields<T extends Record<string & {}, IntegrationFormField>>(
	fields: T,
): IntegrationSchemaFromFields<T> {
	const schema = {} as any
	for (const [key, element] of Object.entries(fields)) {
		if (element.type === "text") {
			schema[key] = z.string()
		} else if (element.type === "secret") {
			schema[key] = z.string()
		}
	}
	return schema
}

export function createIntegrationForm<T extends Record<string & {}, IntegrationFormField>>({
	name,
	schema,
}: { name: IntegrationSlug; schema: T }): IntegrationForm<
	T & {
		name: typeof nameField
	}
> {
	const fields = { name: nameField, ...schema }
	const resultSchema = generateSchemaFromFields(fields)
	return {
		name,
		fields,
		schema: resultSchema,
	}
}
