import { z } from "zod"
import { INTEGRATIONS, INTEGRATION_CATEGORIES, INTEGRATION_FEATURES } from "./config"
import { InputHTMLAttributes, ReactNode } from "react"

export interface IntegrationToolCategoryData {
	name: string
	slug: string
}

export type IntegrationToolCategory = keyof typeof INTEGRATION_CATEGORIES

export interface IntegrationToolFeatureData {
	name: string
	slug: string
}
export type IntegrationToolFeature = keyof typeof INTEGRATION_FEATURES

export interface IntegrationTool {
	name: string & {}
	config: IntegrationToolForm<any>
	slug: string
	disabled?: boolean
	categories: IntegrationToolCategory[]
	subtitle?: string
	features?: IntegrationToolFeature[]
}

export type IntegrationToolSlug = keyof typeof INTEGRATIONS

type IntegrationFormField<T> = {
	validator: T
	description?: string | ReactNode
	inputProps?:
		| (InputHTMLAttributes<HTMLInputElement> & {
				showLabel?: boolean | undefined
		  })
		| undefined
}

export type IntegrationToolFields<T> = Record<string & {}, IntegrationFormField<T>>

export interface IntegrationToolForm<T extends IntegrationToolFields<any>> {
	schema: T
	name: IntegrationToolSlug
}

export function createIntegrationForm<T extends IntegrationToolFields<any>>({
	name,
	schema,
}: {
	name: IntegrationToolSlug
	schema: T
}): IntegrationToolForm<T> {
	return {
		name,
		schema: schema,
	}
}

export type InferInegrationSchema<T extends IntegrationToolForm<any>> = {
	[K in keyof T["schema"]]: T["schema"][K]["validator"]
}

export type InferIntegrationType<T extends IntegrationToolForm<any>> = {
	[K in keyof T["schema"]]: z.infer<T["schema"][K]["validator"]>
}

export function createZodIntegrationSchema<T extends IntegrationToolForm<any>>(schema: T) {
	const data = {} as InferInegrationSchema<T>

	for (const [name] of Object.entries(schema.schema)) {
		data[name as keyof T["schema"]] = schema.schema[name as keyof T["schema"]].validator
	}

	return z.object(data)
}
