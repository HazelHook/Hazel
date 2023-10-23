import * as Stripe from "stripe"

export const stripe = new Stripe.Stripe(process.env.STRIPE_API_KEY as string, {
	apiVersion: "2023-10-16",
	httpClient: Stripe.Stripe.createFetchHttpClient(),
})

export const createCheckoutSession = async (data: { customerId: string; successUrl: string; cancelUrl: string }) => {
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		mode: "setup",
		customer: data.customerId,
		success_url: data.successUrl,
		cancel_url: data.cancelUrl,
	})

	return session
}

export type * from "stripe"
