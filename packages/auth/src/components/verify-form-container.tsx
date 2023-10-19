"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"

import { VerifyPaths } from "../pages/verify"
import { MultiFactorChallengeContainer } from "./mult-factor-challenge-container"

export type VerifyFormContainerProps = {
	paths: VerifyPaths
}

export function VerifyFormContainer({ paths }: VerifyFormContainerProps) {
	const router = useRouter()
	const onSuccess = useCallback(() => {
		router.replace(paths.redirect)
	}, [])

	return <MultiFactorChallengeContainer onSuccess={onSuccess} />
}
