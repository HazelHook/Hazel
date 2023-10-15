"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import If from "@/components/ui/if"
import { z } from "zod"
import AutoForm from "@/components/ui/auto-form"
import { passwordSchema } from "./EmailPasswordSignUpForm"
import { useTranslations } from "next-intl"

const emailPasswordSignInFormSchema = z.object({
	email: z.string().email(),
	password: passwordSchema,
})

type Schema = z.infer<typeof emailPasswordSignInFormSchema>

const EmailPasswordSignInForm: React.FCC<{
	onSubmit: (params: Schema) => void
	loading: boolean
}> = ({ onSubmit, loading }) => {
	const t = useTranslations()

	return (
		<AutoForm
			className="w-full"
			onSubmit={async (v) => {
				onSubmit(v)
			}}
			formSchema={emailPasswordSignInFormSchema}
			fieldConfig={{
				email: {
					inputProps: {
						placeholder: "your@email.com",
						type: "email",
					},
				},
				password: {
					inputProps: {
						required: true,
						type: "password",
					},
					description: (
						<Link href={"/auth/password-reset"} className={"text-xs text-foreground hover:underline"}>
							{t("auth.passwordForgottenQuestion")}
						</Link>
					),
				},
			}}
		>
			<Button className={"w-full"} color={"primary"} data-cy="auth-submit-button" type="submit" loading={loading}>
				<If condition={loading} fallback={t("auth.signIn")}>
					{t("auth.signingIn")}
				</If>
			</Button>
		</AutoForm>
	)
}

export default EmailPasswordSignInForm
