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
type ZodMapped<T extends SchemaRecordType> = {
	[K in keyof T]: z.infer<T[K]>
}

class TinybirdEndpoint<TSchema extends SchemaRecordType, TParams extends SchemaRecordType> {
	private _name: IndexableString
	private _publish: ReturnType<typeof Tinybird.prototype.buildIngestEndpoint<TSchema>>
	private _get: ReturnType<typeof Tinybird.prototype.buildPipe<ZodMapped<TParams>, ZodMapped<TSchema>>>

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

		this._publish = tb.buildIngestEndpoint({
			datasource: this._name,
			// @ts-ignore
			event: schema,
		})

		// @ts-ignore
		this._get = tb.buildPipe({
			pipe: this._name,
			parameters: z.object(parameters) as AnyZodObject,
			data: z.object(schema),
		})
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

	public add<TData extends SchemaRecordType, Name extends IndexableString>({
		name,
		schema,
		parameters,
	}: {
		name: Name
		schema: TData
		parameters: SchemaRecordType
	}): TinybirdResourceBuilder<
		TSchema & { [K in Name]: TinybirdEndpoint<TData, SchemaRecordType> }
	> {
		const endpoint = new TinybirdEndpoint({
			tb: this._tb,
			name,
			schema,
			parameters
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
		Parameters extends SchemaRecordType
	>({
		tb,
		name,
		schema,
		parameters,
	}: {
		tb: Tinybird
		name: Name
		schema: TData
		parameters: Parameters
	}): TinybirdResourceBuilder<
		Record<IndexableString, TinybirdEndpoint<any, any>> & {
			[K in Name]: TinybirdEndpoint<TData, Parameters>
		}
	> {
		const result = new TinybirdResourceBuilder({}, tb)
		result.add({
			name,
			schema,
			parameters,
		})

		return result as any
	}
}
