import { ZodEnum, ZodString, z } from "zod"
import { INTEGRATIONS, INTEGRATION_CATERGORIES, INTEGRATION_FEATURES } from "."


export interface IntegrationCategoryData {
	name: string
	slug: string
}

export type IntegrationCategory = keyof typeof INTEGRATION_CATERGORIES

export interface IntegrationFeatureData {
	name: string
	slug: string
}
export type IntegrationFeature = keyof typeof INTEGRATION_FEATURES

export interface Integration {
	name: string & {}
	slug: string
	categories: IntegrationCategory[]
	subtitle?: string
	features?: IntegrationFeature[]
}

export type IntegrationSlug = keyof typeof INTEGRATIONS



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

type GeneralIntegrationSchema = {
	name: IntegrationFormFieldText
}
export type IntegrationFields = Record<string & {}, AnyIntegrationFormField>

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
