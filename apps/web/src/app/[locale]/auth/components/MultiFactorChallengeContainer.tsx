import type { FormEventHandler } from "react"
import { useCallback, useEffect, useState } from "react"
import useMutation from "swr/mutation"

import useSupabase from "@/core/hooks/use-supabase"
import useSignOut from "@/core/hooks/use-sign-out"

import VerificationCodeInput from "./VerificationCodeInput"
import useFetchAuthFactors from "@/core/hooks/use-fetch-factors"
import If from "@/components/ui/if"
import Alert from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Spinner from "@/components/Spinner"
import Heading from "@/components/ui/heading"
import { useTranslations } from "next-intl"

function MultiFactorChallengeContainer({
	onSuccess,
}: React.PropsWithChildren<{
	onSuccess: () => void
}>) {
	const t = useTranslations()
	const [factorId, setFactorId] = useState("")
	const [verifyCode, setVerifyCode] = useState("")
	const mutation = useVerifyMFAChallenge()

	const onSubmitClicked: FormEventHandler<HTMLFormElement> = useCallback(
		async (event) => {
			event.preventDefault()

			if (!factorId || !verifyCode) {
				return
			}

			await mutation.trigger({
				factorId,
				verifyCode,
			})

			onSuccess()
		},
		[factorId, mutation, onSuccess, verifyCode],
	)

	if (!factorId) {
		return <FactorsListContainer onSelect={setFactorId} onSuccess={onSuccess} />
	}

	return (
		<form onSubmit={onSubmitClicked}>
			<div className={"flex flex-col space-y-4"}>
				<span className={"text-sm"}>{t("profile.verifyActivationCodeDescription")}</span>

				<div className={"flex w-full flex-col space-y-2.5"}>
					<VerificationCodeInput onInvalid={() => setVerifyCode("")} onValid={setVerifyCode} />

					<If condition={mutation.error}>
						<Alert type={"error"}>{t("profile.invalidVerificationCode")}</Alert>
					</If>
				</div>

				<Button loading={mutation.isMutating} disabled={!verifyCode}>
					{mutation.isMutating ? (
						<>{t("profile.verifyingCode")}</>
					) : (
						<>{t("profile.submitVerificationCode")}</>
					)}
				</Button>
			</div>
		</form>
	)
}

export default MultiFactorChallengeContainer

function useVerifyMFAChallenge() {
	const client = useSupabase()

	return useMutation(
		["mfa-verify-challenge"],
		async (
			_,
			{
				arg,
			}: {
				arg: {
					factorId: string
					verifyCode: string
				}
			},
		) => {
			const { factorId, verifyCode: code } = arg

			const response = await client.auth.mfa.challengeAndVerify({
				factorId,
				code,
			})

			if (response.error) {
				throw response.error
			}

			return response.data
		},
	)
}

function FactorsListContainer({
	onSuccess,
	onSelect,
}: React.PropsWithChildren<{
	onSuccess: () => void
	onSelect: (factor: string) => void
}>) {
	const t = useTranslations()
	const signOut = useSignOut()

	const { data: factors, isLoading, error } = useFetchAuthFactors()

	const isSuccess = factors && !isLoading && !error

	useEffect(() => {
		// If there are no factors, continue
		if (isSuccess && !factors.totp.length) {
			onSuccess()
		}
	}, [factors?.totp.length, isSuccess, onSuccess])

	useEffect(() => {
		// If there is an error, sign out
		if (error) {
			void signOut()
		}
	}, [error, signOut])

	useEffect(() => {
		// If there is only one factor, select it automatically
		if (isSuccess && factors.totp.length === 1) {
			onSelect(factors.totp[0].id)
		}
	})

	if (isLoading) {
		return (
			<div className={"flex flex-col items-center space-y-4 py-8"}>
				<Spinner />

				<div>{t("profile.loadingFactors")}</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className={"w-full"}>
				<Alert type={"error"}>{t("profile.factorsListError")}</Alert>
			</div>
		)
	}

	const verifiedFactors = factors?.totp ?? []

	return (
		<div className={"flex flex-col space-y-4"}>
			<div>
				<Heading type={6}>{t("profile.selectFactor")}</Heading>
			</div>

			{verifiedFactors.map((factor) => (
				<div key={factor.id}>
					<Button variant={"outline"} className={"w-full"} onClick={() => onSelect(factor.id)}>
						{factor.friendly_name}
					</Button>
				</div>
			))}
		</div>
	)
}
