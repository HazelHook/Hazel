import React, { useCallback, useEffect, useState } from "react"
import Image from "next/image"

import { useFactorsMutationKey } from "@hazel/auth/hooks"
import { VerificationCodeInput } from "@hazel/auth/internal-components/verification-code-input"
import { useSupabase } from "@hazel/supabase/hooks"
import Alert from "@hazel/ui/alert"
import { Button } from "@hazel/ui/button"
import { If } from "@hazel/ui/if"
import Modal from "@hazel/ui/modal"
import TextField from "@hazel/ui/text-field"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import useMutation from "swr/mutation"

function MultiFactorAuthSetupModal(
	props: React.PropsWithChildren<{
		isOpen: boolean
		setIsOpen: (isOpen: boolean) => void
	}>,
) {
	const t = useTranslations("profile")

	const onEnrollSuccess = useCallback(() => {
		props.setIsOpen(false)

		return toast.success(t("multiFactorSetupSuccess"))
	}, [props, t])

	return (
		<Modal closeButton={true} heading={t("setupMfaButtonLabel")} isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
			<MultiFactorAuthSetupForm onCancel={() => props.setIsOpen(false)} onEnrolled={onEnrollSuccess} />
		</Modal>
	)
}

function MultiFactorAuthSetupForm({
	onEnrolled,
	onCancel,
}: React.PropsWithChildren<{
	onCancel: () => void
	onEnrolled: () => void
}>) {
	const t = useTranslations("profile")

	const { trigger: verifyCode } = useVerifyCodeMutation()
	const [factorId, setFactorId] = useState<string | undefined>()
	const [verificationCode, setVerificationCode] = useState("")

	const [state, setState] = useState({
		loading: false,
		error: "",
	})

	const onSubmit = useCallback(async () => {
		setState({
			loading: true,
			error: "",
		})

		if (!factorId || !verificationCode) {
			return setState({
				loading: false,
				error: "No factor ID or verification code found",
			})
		}

		try {
			await verifyCode({ factorId, code: verificationCode })

			setState({
				loading: false,
				error: "",
			})

			onEnrolled()
		} catch (error) {
			const message = (error as Error).message || "Unknown error"

			setState({
				loading: false,
				error: message,
			})
		}
	}, [onEnrolled, verifyCode, factorId, verificationCode])

	if (state.error) {
		return (
			<div className={"flex flex-col space-y-4"}>
				<Alert type={"error"}>{t("multiFactorSetupError")}</Alert>

				<Modal.CancelButton onClick={onCancel} />
			</div>
		)
	}

	return (
		<div className={"flex flex-col space-y-4"}>
			<div className={"flex justify-center"}>
				<FactorQrCode onCancel={onCancel} onSetFactorId={setFactorId} />
			</div>

			<If condition={factorId}>
				<form
					onSubmit={(e) => {
						e.preventDefault()

						return onSubmit()
					}}
					className={"w-full"}
				>
					<div className={"flex flex-col space-y-4"}>
						<TextField.Label>
							{t("verificationCode")}

							<VerificationCodeInput
								onInvalid={() => setVerificationCode("")}
								onValid={setVerificationCode}
							/>

							<TextField.Hint>{t("verifyActivationCodeDescription")}</TextField.Hint>
						</TextField.Label>

						<div className={"flex justify-end space-x-2"}>
							<Modal.CancelButton type={"button"} onClick={onCancel} />

							<Button disabled={!verificationCode} loading={state.loading} type={"submit"}>
								{state.loading ? <>{t("verificationCode")}</> : <>{t("enableMfaFactor")}</>}
							</Button>
						</div>
					</div>
				</form>
			</If>
		</div>
	)
}

export function FactorQrCode({
	onSetFactorId,
	onCancel,
}: React.PropsWithChildren<{
	onCancel: () => void
	onSetFactorId: React.Dispatch<React.SetStateAction<string | undefined>>
}>) {
	const t = useTranslations("profile")

	const { trigger: enrollFactor } = useEnrollFactor()
	const [error, setError] = useState(false)

	const [factor, setFactor] = useState({
		name: "",
		qrCode: "",
	})

	const factorName = factor.name

	useEffect(() => {
		if (!factorName) {
			return
		}
		;(async () => {
			try {
				const data = await enrollFactor(factorName)

				if (!data) {
					return setError(true)
				}

				// set image
				setFactor((factor) => {
					return {
						...factor,
						qrCode: data.totp.qr_code,
					}
				})

				// dispatch event to set factor ID
				onSetFactorId(data.id)
			} catch (e) {
				setError(true)
			}
		})()
	}, [onSetFactorId, factorName, enrollFactor])

	if (error) {
		return (
			<div className={"flex w-full flex-col space-y-2"}>
				<Alert type={"error"}>{t("qrCodeError")}</Alert>

				<Modal.CancelButton onClick={onCancel} />
			</div>
		)
	}

	if (!factorName) {
		return (
			<FactorNameForm
				onCancel={onCancel}
				onSetFactorName={(name) => {
					setFactor((factor) => ({ ...factor, name }))
				}}
			/>
		)
	}

	return (
		<div className={"flex flex-col space-y-4"}>
			<p>
				<span className={"text-base"}>{t("multiFactorModalHeading")}</span>
			</p>

			<div className={"flex justify-center"}>
				<QrImage src={factor.qrCode} />
			</div>
		</div>
	)
}

function FactorNameForm(
	props: React.PropsWithChildren<{
		onSetFactorName: (name: string) => void
		onCancel: () => void
	}>,
) {
	const t = useTranslations("profile")

	const inputName = "factorName"

	return (
		<form
			className={"w-full"}
			onSubmit={(event) => {
				event.preventDefault()

				const data = new FormData(event.currentTarget)
				const name = data.get(inputName) as string

				props.onSetFactorName(name)
			}}
		>
			<div className={"flex flex-col space-y-4"}>
				<TextField.Label>
					{t("factorNameLabel")}

					<TextField.Input autoComplete={"off"} required name={inputName} />

					<TextField.Hint>{t("factorNameHint")}</TextField.Hint>
				</TextField.Label>

				<div className={"flex justify-end space-x-2"}>
					<Modal.CancelButton onClick={props.onCancel} />

					<Button type={"submit"}>{t("factorNameSubmitLabel")}</Button>
				</div>
			</div>
		</form>
	)
}

function QrImage({ src }: { src: string }) {
	return <Image alt={"QR Code"} src={src} width={160} height={160} />
}

export default MultiFactorAuthSetupModal

export function useEnrollFactor() {
	const client = useSupabase()
	const key = useFactorsMutationKey()

	return useMutation(key, async (_, { arg: factorName }: { arg: string }) => {
		const { data, error } = await client.auth.mfa.enroll({
			friendlyName: factorName,
			factorType: "totp",
		})

		if (error) {
			throw error
		}

		return data
	})
}

export function useVerifyCodeMutation() {
	const key = useFactorsMutationKey()
	const client = useSupabase()

	return useMutation(key, async (_, { arg }: { arg: { factorId: string; code: string } }) => {
		const challenge = await client.auth.mfa.challenge({
			factorId: arg.factorId,
		})

		if (challenge.error) {
			throw challenge.error
		}

		const challengeId = challenge.data.id

		const verify = await client.auth.mfa.verify({
			factorId: arg.factorId,
			code: arg.code,
			challengeId,
		})

		if (verify.error) {
			throw verify.error
		}

		return verify
	})
}
