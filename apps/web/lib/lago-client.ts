import { createClient, paths } from "@hazel/lago"

export const lagoClient = createClient<paths>({ baseUrl: process.env.LAGO_API_URL || "https://api.lago.hazelapp.dev" })
