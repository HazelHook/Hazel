"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"

import { MultiFactorChallengeContainer } from "./mult-factor-challenge-container"

export type VerifyFormContainerProps = {
	redirectPath: string
}

export function VerifyFormContainer({ redirectPath }: VerifyFormContainerProps) {
	const router = useRouter()
	const onSuccess = useCallback(() => {
		router.replace(redirectPath)
	}, [])

	return <MultiFactorChallengeContainer onSuccess={onSuccess} />
}
