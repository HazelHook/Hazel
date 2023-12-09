import { Analytics } from "@june-so/analytics-node"

export const analytics = new Analytics(process.env.JUNE_SECRET_KEY!)
