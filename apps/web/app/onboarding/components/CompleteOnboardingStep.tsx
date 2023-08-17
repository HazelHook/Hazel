"use client"

import { useEffect, useRef, useTransition } from "react"
import useCsrfToken from "@/core/hooks/use-csrf-token"
import Spinner from "@/components/Spinner"

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
	const submitted = useRef(false)
	const [, startTransition] = useTransition()
	const csrfToken = useCsrfToken()

	useEffect(() => {
		if (submitted.current) {
			return
		}

		void (async () => {
			submitted.current = true

			startTransition(async () => {
				console.log("Complete OnBoarding")
				// await handleOnboardingCompleteAction({ ...data, csrfToken })
			})
		})()
	}, [csrfToken, data])
}
