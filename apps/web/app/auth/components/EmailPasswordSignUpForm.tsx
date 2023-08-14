import { Button } from "@/components/ui/button"
import { FormMessage } from "@/components/ui/form"
import If from "@/components/ui/if"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Trans from "@/components/ui/trans"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

const EmailPasswordSignUpForm: React.FCC<{
	onSubmit: (params: {
		email: string
		password: string
		repeatPassword: string
	}) => unknown
	loading: boolean
}> = ({ onSubmit, loading }) => {
	const { t } = useTranslation()

	const { register, handleSubmit, watch, formState } = useForm({
		defaultValues: {
			email: "",
			password: "",
			repeatPassword: "",
		},
	})

	const emailControl = register("email", { required: true })
	const errors = formState.errors

	const passwordControl = register("password", {
		required: true,
		minLength: {
			value: 6,
			message: t("auth:passwordLengthError"),
		},
	})

	const passwordValue = watch("password")

	const repeatPasswordControl = register("repeatPassword", {
		required: true,
		minLength: {
			value: 6,
			message: t("auth:passwordLengthError"),
		},
		validate: (value) => {
			if (value !== passwordValue) {
				return t("auth:passwordsDoNotMatch")
			}

			return true
		},
	})

	return (
		<form className={"w-full"} onSubmit={handleSubmit(onSubmit)}>
			<div className={"flex-col space-y-4"}>
				<div className="space-y-1">
					<Label>
						<Trans i18nKey={"common:emailAddress"} />
					</Label>

					<Input {...emailControl} data-cy={"email-input"} required type="email" placeholder={"your@email.com"} />

					<p className="text-sm font-medium text-destructive">{errors.email?.message}</p>
				</div>

				<div className="space-y-1">
					<Label>
						<Trans i18nKey={"common:password"} />
					</Label>

					<Input {...passwordControl} data-cy={"password-input"} required type="password" placeholder={""} />

					<span className={"block pl-1 text-xs font-normal leading-tight text-muted-foreground"}>
						<Trans i18nKey={"auth:passwordHint"} />
					</span>

					<p className="text-sm font-medium text-destructive" data-cy="password-error">
						{errors.password?.message}
					</p>
				</div>

				<div className="space-y-1">
					<Label>
						<Trans i18nKey={"auth:repeatPassword"} />
					</Label>

					<Input
						{...repeatPasswordControl}
						data-cy={"repeat-password-input"}
						required
						type="password"
						placeholder={""}
					/>

					<span className={"block pl-1 text-xs font-normal leading-tight text-muted-foreground"}>
						<Trans i18nKey={"auth:repeatPasswordHint"} />
					</span>

					<p className="text-sm font-medium text-destructive" data-cy="repeat-password-error">
						{errors.repeatPassword?.message}
					</p>
				</div>

				<div>
					<Button data-cy={"auth-submit-button"} className={"w-full"} color={"primary"} type="submit" loading={loading}>
						<If condition={loading} fallback={<Trans i18nKey={"auth:getStarted"} />}>
							<Trans i18nKey={"auth:signingUp"} />
						</If>
					</Button>
				</div>
			</div>
		</form>
	)
}

export default EmailPasswordSignUpForm
