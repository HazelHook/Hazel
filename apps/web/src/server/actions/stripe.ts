"use server"

import { redirect } from "next/navigation"

import { z } from "zod"

import { createAction, protectedProcedure } from "@hazel/server/actions/trpc"
import { createCheckoutSession, stripe } from "@hazel/utils/stripe"

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
				// default_source: methodId,
				invoice_settings: {
					default_payment_method: input.methodId,
				},
			})

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

			return {
				success: true,
			}
		}),
)
