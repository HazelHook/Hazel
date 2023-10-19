import { redirect } from "next/navigation"
import { Button } from "@hazel/ui/button"
import { Alert, AlertHeading } from "@hazel/ui/alert"
import Link from "next/link"

interface AuthCallbackErrorPageProps {
	searchParams: StringObject
	signInPath: string
}

export function AuthCallbackErrorPage({ searchParams, signInPath }: AuthCallbackErrorPageProps) {
	const error = searchParams.error

	// TODO: LOG THIS
	// if there is no error, redirect the user to the sign-in page
	if (!error) {
		redirect(signInPath)
	}

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
