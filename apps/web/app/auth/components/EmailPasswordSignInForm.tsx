"use client"

import { useForm } from "react-hook-form"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Trans } from "@/components/ui/trans"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import If from "@/components/ui/if"

const EmailPasswordSignInForm: React.FCC<{
	onSubmit: (params: { email: string; password: string }) => unknown
	loading: boolean
}> = ({ onSubmit, loading }) => {
	const { register, handleSubmit } = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
	})

	const emailControl = register("email", { required: true })
	const passwordControl = register("password", { required: true })

	return (
		<form className={"w-full"} onSubmit={handleSubmit(onSubmit)}>
			<div className={"flex-col space-y-4"}>
				<div className="space-y-1">
					<Label>
						<Trans i18nKey={"common:emailAddress"} />
					</Label>

					<Input data-cy={"email-input"} required type="email" placeholder={"your@email.com"} {...emailControl} />
				</div>

				<div className="space-y-1">
					<Label>
						<Trans i18nKey={"common:password"} />
					</Label>

					<Input required data-cy={"password-input"} type="password" placeholder={""} {...passwordControl} />

					<div className={"py-0.5 text-xs"}>
						<Link href={"/auth/password-reset"} className={"hover:underline"}>
							<Trans i18nKey={"auth:passwordForgottenQuestion"} />
						</Link>
					</div>
				</div>

				<div>
					<Button className={"w-full"} color={"primary"} data-cy="auth-submit-button" type="submit" loading={loading}>
						<If condition={loading} fallback={<Trans i18nKey={"auth:signIn"} />}>
							<Trans i18nKey={"auth:signingIn"} />
						</If>
					</Button>
				</div>
			</div>
		</form>
	)
}

export default EmailPasswordSignInForm
