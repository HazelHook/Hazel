"use client"

import { useCallback } from "react"
import configuration from "@//configuration"
import MultiFactorChallengeContainer from "@//app/[locale]/auth/components/MultiFactorChallengeContainer"

function VerifyFormContainer() {
	const onSuccess = useCallback(() => {
		window.location.assign(configuration.paths.home)
	}, [])

	return <MultiFactorChallengeContainer onSuccess={onSuccess} />
}

export default VerifyFormContainer
