import { Tinybird } from "@chronark/zod-bird"
import { AnyZodObject, z, ZodTypeAny } from "zod"

// Common
export const period = z
	.enum(["daily", "hourly", "weekly", "monthly"])
	.describe("The period of time to group the data by.")
export const hazelVersion = z.enum(["1.0"])

// Web requests
export const body = z.string().describe("The request or response body of a web request")
export const headers = z.string().describe("The headers of a web request")

type SchemaRecordType = Record<string, ZodTypeAny>
export type ZodMapped<T extends SchemaRecordType> = {
	[K in keyof T]: z.infer<T[K]>
}

class TinybirdEndpoint<TSchema extends SchemaRecordType, TParams extends SchemaRecordType> {
	private _name: IndexableString
	private _publish?: ReturnType<typeof Tinybird.prototype.buildIngestEndpoint<z.infer<z.ZodObject<TSchema>>>>
	private _get: ReturnType<
		typeof Tinybird.prototype.buildPipe<z.infer<z.ZodObject<TParams>>, z.infer<z.ZodObject<TSchema>>>
	>

	constructor({
		name,
		tb,
		schema,
		parameters,
		datasource,
	}: {
		name: IndexableString
		datasource?: string
		tb: Tinybird
		schema: TSchema
		parameters: TParams
	}) {
		this._name = name

		// TODO: FIX THIS ANY
		if (datasource) {
			this._publish = tb.buildIngestEndpoint({
				datasource,
				// @ts-ignore
				event: z.object(schema),
			}) as any
		}

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

export class TinybirdResourceBuilder {
	private _tb: Tinybird
	private _name: string

	constructor({ tb, name }: { tb: Tinybird; name: string }) {
		this._tb = tb
		this._name = name
	}

	public build<TData extends SchemaRecordType, TParameters extends SchemaRecordType, Name extends IndexableString>({
		name,
		datasource,
		schema,
		parameters,
	}: {
		name: Name
		datasource?: string
		schema: TData
		parameters: TParameters
	}): TinybirdEndpoint<TData, TParameters> {
		return new TinybirdEndpoint({
			tb: this._tb,
			name: `${name}_${this._name}`,
			schema,
			parameters,
			datasource,
		})
	}
}
