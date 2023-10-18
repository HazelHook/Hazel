import { Client } from "lago-javascript-client"
import { nanoid } from "nanoid"

export type Domain = "event" | "domain"

export const lago = Client(process.env.LAGO_API_KEY!, {
	baseUrl: "https://api.lago.hazelapp.dev/v1",
	customFetch: fetch,
})

export const ingestMetric = async (input: {
	externalId: string
	type: Domain
	properties?: any
}) => {
	try {
		return await lago.events.createEvent({
			event: {
				code: input.type,
				transaction_id: nanoid(),
				external_customer_id: input.externalId,
				properties: input.properties,
			},
		})
	} catch (error) {
		console.error(error)
	}
}

export const createSubscription = async (input: {
	planCode: string
	externalId: string
}) => {
	const { data } = await lago.subscriptions.createSubscription({
		subscription: {
			plan_code: input.planCode,
			external_customer_id: input.externalId,
			external_id: nanoid(),
			billing_time: "anniversary",
		},
	})

	return data
}

export const createCustomer = async (input: {
	externalId: string
	email: string
	name: string
	legalName: string
	phone?: string
}) => {
	const { data } = await lago.customers.createCustomer({
		customer: {
			external_id: input.externalId,
			email: input.email,
			name: input.name,
			legal_name: input.legalName,
			phone: input.phone,
			billing_configuration: {
				payment_provider: "stripe",
				sync_with_provider: true,
			},
		},
	})

	return data
}

export const isLimited = async (input: {
	externalId: string
	metric: Domain
	limit: number
}) => {
	const {
		data: { subscriptions },
	} = await lago.subscriptions.findAllSubscriptions({
		external_customer_id: input.externalId,
	})

	const subscription = subscriptions[0]

	// If no subscription subscripe to free. But this shouldnt happen
	if (!subscription) {
		await createSubscription({
			externalId: input.externalId,
			planCode: "free",
		})

		return false
	}

	// Every other plan is not limited
	if (subscription.plan_code !== "free") {
		return false
	}

	const {
		data: { customer_usage: usage },
	} = await lago.customers.findCustomerCurrentUsage(input.externalId, {
		external_subscription_id: subscription.external_id,
	})

	const metric = usage.charges_usage.find((charge) => charge.billable_metric.code === input.metric)

	return Number(metric?.units) > input.limit
}
