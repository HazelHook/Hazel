import { Container } from "@hazel/ui/container"
import { PageHeader } from "@hazel/ui/page-header"

import { auth } from "@/lib/auth"
import { UserUpdateEmailForm } from "@/components/forms/user/user-update-email-form"

const UpdateEmailPage = async () => {
	const { user } = await auth()

	return (
		<Container>
			<PageHeader title="Update Email Page" subtitle="Update your Email " />

			<UserUpdateEmailForm currentEmail={user.email} />
		</Container>
	)
}

export const runtime = "edge"

export default UpdateEmailPage
