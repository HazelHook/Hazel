"use client"

import { loggerLink } from "@trpc/client"
import { experimental_createActionHook, experimental_serverActionLink } from "@trpc/next/app-dir/client"
import superjson from "superjson"

export const useAction = experimental_createActionHook({
	links: [loggerLink(), experimental_serverActionLink()],
	transformer: superjson,
})
