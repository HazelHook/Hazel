import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
	apiVersion: "2023-10-16",
})

export async function POST(request: Request) {
	const event = await request.json()

	try {
		// TODO SECURE WEBHOOK
		if (event.type === "checkout.session.completed") {
			const session = event.data.object

			// The payment method may not be immediately available, so you might need to retry this a few times

			let setupIntent = await stripe.setupIntents.retrieve(session.setup_intent)

			let index = 0

			while (!setupIntent.payment_method) {
				setupIntent = await stripe.setupIntents.retrieve(session.setup_intent)
				index++

				if (index >= 5) {
					throw new Error("Payment Method couldnt be found in stripe")
				}
			}

			await stripe.customers.update(session.customer, {
				invoice_settings: {
					default_payment_method: setupIntent.payment_method as string,
				},
			})
		}

		// Return a response to acknowledge receipt of the event
		return NextResponse.json({ received: true })
	} catch (err) {
		console.error(`Stripe webhook failed with ${err}`)
		return NextResponse.error()
	}
}

// export const runtime = "edge"
