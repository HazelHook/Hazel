"use client"

import { useEffect, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"

import { handleOnboardingAction } from "@/server/actions/onboarding"

import useCsrfToken from "@/core/hooks/use-csrf-token"
import { useAction } from "@hazel/server/actions/client"
import { Spinner } from "@hazel/ui/spinner"
import configuration from "@hazel/utils/configuration"

interface CompleteOnboardingStepData {
	organization: string
}

const CompleteOnboardingStep: React.FC<{
	data: CompleteOnboardingStepData
}> = ({ data }) => {
	useCompleteOnboarding(data)

	return (
		<div className={"flex flex-1 flex-col items-center space-y-8"}>
			<span>
				<Spinner className={"h-12 w-12"} />
			</span>

			<span>Getting Started. Please wait...</span>
		</div>
	)
}

export default CompleteOnboardingStep

function useCompleteOnboarding(data: CompleteOnboardingStepData) {
	const router = useRouter()
	const submitted = useRef(false)
	const [, startTransition] = useTransition()
	const csrfToken = useCsrfToken()

	const handleOnboardingCompleteAction = useAction(handleOnboardingAction, {
		onSuccess: () => {
			router.push(configuration.paths.home)
		},
		onError: () => {},
	})

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (submitted.current) {
			return
		}

		void (async () => {
			submitted.current = true

			startTransition(async () => {
				console.log("Complete OnBoarding")
				handleOnboardingCompleteAction.mutate({
					organizationName: data.organization,
				})
			})
		})()
	}, [csrfToken, data])
}
