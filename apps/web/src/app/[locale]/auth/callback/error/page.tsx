import { redirect } from "next/navigation"
// import { Alert, AlertHeading } from "@hazel/ui"
import { Button } from "@hazel/ui/button"

interface Params {
	searchParams: StringObject
}

function AuthCallbackErrorPage({ searchParams }: Params) {
	const error = searchParams.error
	console.error(error)

	// if there is no error, redirect the user to the sign-in page
	if (!error) {
		redirect("/auth/sign-in")
	}

	return (
		<div className={"flex flex-col space-y-6 py-4"}>
			{/* <Alert type={"error"}>
				<AlertHeading>Authentication Error</AlertHeading>
				Unfortunately, there was an error authenticating your account. Please try again.
			</Alert> */}

			<Button>
				<a href={"/auth/sign-in"}>Sign In</a>
			</Button>
		</div>
	)
}

export default AuthCallbackErrorPage
