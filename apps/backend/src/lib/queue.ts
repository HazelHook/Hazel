import { ConnectionOptions, Queue } from "bullmq"

export const redisConnection: ConnectionOptions = {
	password: process.env.REDIS_PASSWORD,
	host: process.env.REDIS_HOST,
	port: Number(process.env.REDIS_PORT),
}

export const sourceQueue = new Queue("source_queue", {
	connection: redisConnection,
	defaultJobOptions: {
		attempts: 5,
		backoff: {
			type: "exponential",
			delay: 300000, // 5min
		},
	},
})
