import { z } from "zod"
import { INTEGRATIONS, INTEGRATION_CATERGORIES, INTEGRATION_FEATURES } from "./config"

export interface IntegrationToolCategoryData {
	name: string
	slug: string
}

export type IntegrationToolCategory = keyof typeof INTEGRATION_CATERGORIES

export interface IntegrationToolFeatureData {
	name: string
	slug: string
}
export type IntegrationToolFeature = keyof typeof INTEGRATION_FEATURES

export interface IntegrationTool {
	name: string & {}
	config?: IntegrationToolForm<any>
	slug: string
	disabled?: boolean
	categories: IntegrationToolCategory[]
	subtitle?: string
	features?: IntegrationToolFeature[]
}

export type IntegrationToolSlug = keyof typeof INTEGRATIONS

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

export type AnyIntegrationFormField = IntegrationFormFieldText | IntegrationFormFieldSecret | IntegrationFormSelect

type GeneralIntegrationToolSchema = {
	name: IntegrationFormFieldText
}
export type IntegrationToolFields = Record<string & {}, AnyIntegrationFormField>

export interface IntegrationToolForm<T extends IntegrationToolFields> {
	config: IntegrationToolFields
	general: GeneralIntegrationToolSchema
	fields: T
	name: IntegrationToolSlug
}

const nameField = {
	type: "text",
	label: "Integration Name",
	placeholder: "Enter a name for this integration...",
} as const

export function createIntegrationForm({
	name,
	schema,
}: {
	name: IntegrationToolSlug
	schema: IntegrationToolFields
}): IntegrationToolForm<typeof schema> {
	return {
		name,
		fields: schema,
		general: { name: nameField },
		config: { name: nameField, ...schema },
	}
}

export function createZodIntegrationSchema<T extends IntegrationToolForm<any>>(schema: T) {
	const data = {} as Record<keyof T["config"], any>

	for (const [name, field] of Object.entries(schema.config)) {
		if (field.type === "text") {
			data[name as keyof T["config"]] = z.string().min(3)
		} else if (field.type === "secret") {
			data[name as keyof T["config"]] = z.string().min(3)
		} else if (field.type === "select") {
			data[name as keyof T["config"]] = z.enum(field.options)
		}
	}

	return z.object(data)
}
