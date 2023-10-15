import Alert from "@/components/ui/alert"
import { AuthError } from "@supabase/supabase-js"
import { useTranslations } from "next-intl"

/**
 * @name AuthErrorMessage
 * @param error This error comes from Supabase as the code returned on errors
 * This error is mapped from the translation auth:errors.{error}
 * To update the error messages, please update the translation file
 * https://github.com/supabase/gotrue-js/blob/master/src/lib/errors.ts
 * @constructor
 */
export default function AuthErrorMessage({
	error,
}: {
	error: Maybe<Error | AuthError | unknown>
}) {
	const t = useTranslations()

	if (!error) {
		return null
	}

	const DefaultError = t("auth.errors.default")
	const errorCode = error instanceof AuthError ? error.message : error

	return (
		<Alert className={"w-full"} type={"error"}>
			<Alert.Heading>{t("auth.errorAlertHeading")}</Alert.Heading>

			<p className={"text-sm font-medium"} data-cy={"auth-error-message"}>
				{t(`auth.errors.${errorCode as any}` as any, {}) || DefaultError}
			</p>
		</Alert>
	)
}
