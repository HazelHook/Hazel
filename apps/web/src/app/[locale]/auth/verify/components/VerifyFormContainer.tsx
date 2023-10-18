"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import configuration from "@/configuration"

import MultiFactorChallengeContainer from "@/app/[locale]/auth/components/MultiFactorChallengeContainer"

function VerifyFormContainer() {
	const router = useRouter()
	const onSuccess = useCallback(() => {
		router.replace(configuration.paths.home)
	}, [])

	return <MultiFactorChallengeContainer onSuccess={onSuccess} />
}

export default VerifyFormContainer
