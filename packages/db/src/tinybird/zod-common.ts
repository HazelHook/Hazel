import { Tinybird } from "@chronark/zod-bird"
import { ZodAny, ZodSchema, z } from "zod"

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

export class TinybirdView<
	TSchema extends Record<string, any>,
	TParams extends Record<string, any>,
	TKpisSchema extends Record<string, any>,
	TTimeseriesSchema extends Record<string, any>,
> {
	private _name: string
	private _schema: ZodSchema<TSchema>
	private _kpisSchema: ZodSchema<TKpisSchema>
	private _timeseriesSchema: ZodSchema<TTimeseriesSchema>
	private _tb: Tinybird
	private _publish: ReturnType<typeof Tinybird.prototype.buildIngestEndpoint<TSchema>>
	private _getKpis: ReturnType<typeof Tinybird.prototype.buildPipe<TParams, TKpisSchema>>
	private _getTimeseries: ReturnType<typeof Tinybird.prototype.buildPipe<TParams, TTimeseriesSchema>>

	constructor({
		name,
		schema,
		tb,
		requestParameters,
		kpisSchema,
		timeseriesSchema,
	}: {
		name: string
		schema: ZodSchema<TSchema>
		tb: Tinybird
		requestParameters: ZodSchema<TParams>
		kpisSchema: ZodSchema<TKpisSchema>
		timeseriesSchema: ZodSchema<TTimeseriesSchema>
	}) {
		this._name = name
		this._schema = schema
		this._kpisSchema = kpisSchema
		this._timeseriesSchema = timeseriesSchema
		this._tb = tb
		this._publish = this._tb.buildIngestEndpoint({
			datasource: `event_${this._name}`,
			event: this._schema,
		})

		this._getKpis = this._tb.buildPipe({
			pipe: `kpi_${this._name}`,
			parameters: requestParameters,
			data: this._kpisSchema,
		})

		this._getTimeseries = this._tb.buildPipe({
			pipe: `timeline_${this._name}`,
			parameters: requestParameters,
			data: this._timeseriesSchema,
		})
	}

	public get schema(): ZodSchema<TSchema> {
		return this._schema
	}

	public get publish() {
		return this._publish
	}

	public get getKpis() {
		return this._getKpis
	}

	public get getTimeseries() {
		return this._getTimeseries
	}
}
