"use server"

import { createAction, protectedProcedure } from "@hazel/server/actions/trpc"
import { genId } from "@hazel/utils"
import { createSubscription, lago } from "@hazel/utils/lago"
import { z } from "zod"

export const changeSubscribtionAction = createAction(
	protectedProcedure
		.input(
			z.object({
				plan: z.string(),
				previousSubscriptionId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			// TODO: Check if user is allowed to unsubscribe the org

			await lago.subscriptions.destroySubscription(input.previousSubscriptionId)

			await createSubscription({
				planCode: input.plan,
				workspaceId: ctx.auth.workspaceId,
			})

			return { url: undefined, org: ctx.auth.workspaceId }
		}),
)

export const unsubscribeAction = createAction(
	protectedProcedure
		.input(
			z.object({
				subscriptionId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			// TODO: Check if user is allowed to unsubscribe the org
			const canceled = await lago.subscriptions.destroySubscription(input.subscriptionId)

			await lago.subscriptions.createSubscription({
				subscription: {
					plan_code: "free",
					external_customer_id: ctx.auth.workspaceId,
					external_id: genId(),
				},
			})

			return { workspaceId: ctx.auth.workspaceId, res: canceled.data }
		}),
)
