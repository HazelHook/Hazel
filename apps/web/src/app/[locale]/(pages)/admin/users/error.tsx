"use client"

import Alert from "@hazel/ui/alert"
import { Container } from "@hazel/ui/container"

function UsersAdminPageError() {
	return (
		<Container>
			<Alert type={"error"}>
				<Alert.Heading>Could not load users</Alert.Heading>
				<p>There was an error loading the users. Please check your console errors.</p>
			</Alert>
		</Container>
	)
}

export default UsersAdminPageError
