import VerificationCodeInput from "@/app/[locale]/auth/components/VerificationCodeInput"
import Alert from "@/components/ui/alert"
import If from "@/components/ui/if"
import Modal from "@/components/ui/modal"
import { useTranslations } from "next-intl"
import React, { useCallback, useState } from "react"
import { FactorQrCode, useVerifyCodeMutation } from "./mfa-setup-modal"
import TextField from "@/components/ui/text-field"
import { Button } from "@/components/ui/button"

export function MultiFactorAuthSetupForm({
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
