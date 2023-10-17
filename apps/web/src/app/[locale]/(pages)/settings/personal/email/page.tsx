import { auth } from "@/lib/auth"

import { Container } from "@/components/ui/container"
import { PageHeader } from "@/components/ui/page-header"
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

export default UpdateEmailPage
