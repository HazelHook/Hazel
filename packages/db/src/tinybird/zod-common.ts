import { z } from "zod"

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
