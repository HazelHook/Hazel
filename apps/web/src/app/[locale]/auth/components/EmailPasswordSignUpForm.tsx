import AutoForm from "@hazel/ui/auto-form"
import { Button } from "@hazel/ui/button"
import { If } from "@hazel/ui/if"
import { useTranslations } from "next-intl"
import { z } from "zod"

export const passwordSchema = z
	.string()
	.min(6, "Password must be at least 6 characters long")
	.refine((password) => /[A-Z]/.test(password), "Password must contain at least one uppercase letter")
	.refine((password) => /[a-z]/.test(password), "Password must contain at least one lowercase letter")
	.refine((password) => /\d/.test(password), "Password must contain at least one number")
	.refine(
		(password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password),
		"Password must contain at least one special character",
	)
	.refine((password) => !/\s/.test(password), "Password must not contain spaces")
	.refine(
		(password) => !["password123", "welcome"].includes(password),
		"Password contains a forbidden word or sequence",
	)

const emailPasswordSignUpFormSchema = z
	.object({
		email: z.string().email(),
		password: passwordSchema,
		repeatPassword: z.string(),
	})
	.refine((data) => data.password === data.repeatPassword, {
		message: "Passwords must match",
		path: ["repeatPassword"],
	})

type Schema = z.infer<typeof emailPasswordSignUpFormSchema>

const EmailPasswordSignUpForm: React.FCC<{
	onSubmit: (params: Schema) => void
	loading: boolean
}> = ({ onSubmit, loading }) => {
	const t = useTranslations()

	return (
		<AutoForm
			className="w-full"
			formSchema={emailPasswordSignUpFormSchema}
			onSubmit={async (v) => {
				onSubmit(v)
			}}
			fieldConfig={{
				email: {
					inputProps: {
						placeholder: "your@email.com",
						type: "email",
					},
				},
				password: {
					description: t("auth.passwordHint"),
					inputProps: {
						required: true,
						type: "password",
					},
				},
				repeatPassword: {
					description: t("auth.repeatPasswordHint"),
					inputProps: {
						required: true,
						type: "password",
					},
				},
			}}
		>
			<Button
				data-cy={"auth-submit-button"}
				className={"w-full"}
				color={"primary"}
				type="submit"
				loading={loading}
			>
				<If condition={loading} fallback={t("auth.getStarted")}>
					{t("auth.signingUp")}
				</If>
			</Button>
		</AutoForm>
	)
}

export default EmailPasswordSignUpForm
