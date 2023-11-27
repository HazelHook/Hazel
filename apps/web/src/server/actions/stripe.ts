"use server"

import { revalidatePath } from "next/cache"

import { createAction, protectedProcedure } from "@hazel/server/actions/trpc"
import { createCheckoutSession, stripe } from "@hazel/utils/stripe"
import { z } from "zod"

export const createCheckoutAction = createAction(
	protectedProcedure
		.input(
			z.object({
				stripeCustomerId: z.string().min(1),
				cancelUrl: z.string().url(),
				successUrl: z.string().url(),
			}),
		)
		.mutation(async ({ input }) => {
			const session = await createCheckoutSession({
				customerId: input.stripeCustomerId,
				cancelUrl: input.cancelUrl,
				successUrl: input.successUrl,
			})

			return {
				url: session.url,
			}
		}),
)

export const changeDefaultMethodAction = createAction(
	protectedProcedure
		.input(
			z.object({
				stripeCustomerId: z.string().min(1),
				methodId: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const res = await stripe.customers.update(input.stripeCustomerId, {
				// default_source: input.methodId,
				invoice_settings: {
					default_payment_method: input.methodId,
				},
			})

			revalidatePath("/settings/billing")

			return res
		}),
)

export const removePaymentMethodAction = createAction(
	protectedProcedure
		.input(
			z.object({
				methodId: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			await stripe.paymentMethods.detach(input.methodId)

			revalidatePath("/settings/billing")

			return {
				success: true,
			}
		}),
)
