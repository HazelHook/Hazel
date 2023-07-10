import { Tinybird } from "@chronark/zod-bird"
import { ZodTypeAny, ZodOptional, z, AnyZodObject } from "zod"

// Common
export const period = z
	.enum(["daily", "hourly", "weekly", "monthly"])
	.describe("The period of time to group the data by.")
export const successState = z.enum(["pending", "success", "error"])
export const hazelVersion = z.enum(["1.0"])

// Utils
export const timestamp = z
	.union([z.number(), z.string()])
	.transform((val) => {
		if (typeof val === "number") {
			return val
		} else {
			return Date.parse(val)
		}
	})
	.describe("A timestamp in either number or string format")

// Web requests
export const body = z.string().describe("The request or response body of a web request")
export const headers = z.string().describe("The headers of a web request")

type SchemaRecordType = Record<string, ZodTypeAny>
type ParameterSelectorType<TSchema> = Partial<Record<keyof TSchema, boolean>>

type ParameterSelector<TSchema extends SchemaRecordType, TParams extends ParameterSelectorType<TSchema>> = {
	[K in Extract<keyof TParams, keyof TSchema>]: TParams[K] extends true
		? TSchema[K]
		: TParams[K] extends false
		? ZodOptional<TSchema[K]>
		: never
}

function getParamFields<TSchema extends SchemaRecordType, TParams extends ParameterSelectorType<TSchema>>(
	schema: TSchema,
	params: TParams,
): ParameterSelector<TSchema, TParams> {
	return Object.entries(params).reduce((acc, [key, value]) => {
		if (value === true) {
			return {
				...acc,
				[key]: schema[key],
			}
		}

		if (value === false) {
			return {
				...acc,
				[key]: z.optional(schema[key]),
			}
		}

		return acc
	}, {} as ParameterSelector<TSchema, TParams>)
}

class TinybirdEndpoint<TSchema extends SchemaRecordType, TParams extends ParameterSelectorType<TSchema>> {
	private _name: IndexableString
	private _tb: Tinybird
	private _schema: TSchema
	private _publish: ReturnType<typeof Tinybird.prototype.buildIngestEndpoint<TSchema>>
	private _get: ReturnType<typeof Tinybird.prototype.buildPipe<ParameterSelector<TSchema, TParams>, TSchema>>

	constructor({
		name,
		tb,
		schema,
		parameters,
	}: {
		name: IndexableString
		tb: Tinybird
		schema: TSchema
		parameters: TParams
	}) {
		this._name = name
		this._tb = tb
		this._schema = schema

		this._publish = this._tb.buildIngestEndpoint({
			datasource: `get_${this._name}`,
			// @ts-ignore
			event: schema,
		})

		const params = getParamFields(schema, parameters)

		// @ts-ignore
		this._get = this._tb.buildPipe({
			pipe: `kpi_${this._name}`,
			parameters: z.object(params) as AnyZodObject,
			data: z.object(schema),
		})
	}

	public get name() {
		return this._name
	}

	public get schema() {
		return this._schema
	}

	public get publish() {
		return this._publish
	}

	public get get() {
		return this._get
	}
}

type IndexableString = string & {}

export class TinybirdResourceBuilder<TSchema extends Record<IndexableString, TinybirdEndpoint<any, any>>> {
	private _resource: TSchema
	private _tb: Tinybird

	private constructor(resource: TSchema, tb: Tinybird) {
		this._resource = resource
		this._tb = tb
	}

	public add<TData extends SchemaRecordType, Name extends IndexableString, Additional extends SchemaRecordType>({
		name,
		schema,
		parameters,
		additional,
	}: {
		name: Name
		schema: TData
		parameters: ParameterSelectorType<TData>
		additional?: Additional
	}): TinybirdResourceBuilder<
		TSchema & { [K in Name]: TinybirdEndpoint<TData, ParameterSelectorType<TData> & Additional> }
	> {
		const endpoint = new TinybirdEndpoint({
			tb: this._tb,
			name,
			schema,
			parameters: Object.fromEntries([
				...Object.entries(parameters),
				...(additional ? Object.entries(additional) : []),
			]),
		})

		const newResource = this._resource as any
		newResource[name] = endpoint

		const result = new TinybirdResourceBuilder(newResource, this._tb)

		return result as any
	}

	public finalize(): {
		[K in keyof TSchema]: TSchema[K]
	} {
		return this._resource as any
	}

	public static build<
		TData extends SchemaRecordType,
		Name extends IndexableString,
		Additional extends SchemaRecordType,
	>({
		tb,
		name,
		schema,
		parameters,
		additional,
	}: {
		tb: Tinybird
		name: Name
		schema: TData
		parameters: ParameterSelectorType<TData>
		additional?: Additional
	}): TinybirdResourceBuilder<
		Record<IndexableString, TinybirdEndpoint<any, any>> & {
			[K in Name]: TinybirdEndpoint<TData, ParameterSelectorType<TData>>
		}
	> {
		const result = new TinybirdResourceBuilder({}, tb)
		result.add({
			name,
			schema,
			parameters,
			additional,
		})

		return result as any
	}
}
