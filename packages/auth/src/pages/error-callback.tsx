import Link from "next/link"
import { redirect } from "next/navigation"
import { Alert, AlertHeading } from "@hazel/ui/alert"
import { Button } from "@hazel/ui/button"
import { getLogger } from "@hazel/utils"

interface AuthCallbackErrorPageProps {
	searchParams: StringObject
	signInPath: string
}

export function AuthCallbackErrorPage({ searchParams, signInPath }: AuthCallbackErrorPageProps) {
	const error = searchParams.error

	// if there is no error, redirect the user to the sign-in page
	if (!error) {
		redirect(signInPath)
	}

	getLogger().error(error)

	return (
		<div className={"flex flex-col space-y-6 py-4"}>
			<Alert type={"error"}>
				<AlertHeading>Authentication Error</AlertHeading>
				Unfortunately, there was an error authenticating your account. Please try again.
			</Alert>

			<Button>
				<Link href={signInPath}>Sign In</Link>
			</Button>
		</div>
	)
}
