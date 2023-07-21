import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

export const ratelimit = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(1000, "60 s"),
	analytics: true,
	prefix: "@upstash/ratelimit",
})
