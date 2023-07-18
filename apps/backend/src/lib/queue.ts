import { ConnectionOptions, Queue } from "bullmq"

export const redisConnection: ConnectionOptions = {
	username: process.env.REDIS_USERNAME,
	password: process.env.REDIS_PASSWORD,
	tls: {
		host: process.env.REDIS_HOST,
		port: Number(process.env.REDIS_PORT),
	},
}

export const sourceQueue = new Queue("source_queue", {
	connection: redisConnection,
})
