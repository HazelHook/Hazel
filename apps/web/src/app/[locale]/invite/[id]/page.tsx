import { notFound } from "next/navigation"
import { Heading } from "@//components/ui/heading"
import If from "@//components/ui/if"
import getLogger from "@//core/logger"
import getSupabaseServerClient from "@//core/supabase/server-client"
import { getI18n } from "@//i18n/server"
import db from "@//lib/db"
import ExistingUserInviteForm from "../components/existing-user-invite-form"
import { acceptOrganizationInvite } from "@//server/actions/organization-invite"
import NewUserInviteForm from "../components/new-user-invite-form"

interface Props {
	params: {
		id: string
	}
}

export const metadata = {
	title: "Join Organization",
}

const InvitePage = async ({ params }: Props) => {
	const t = await getI18n()

	const logger = getLogger()
	const client = getSupabaseServerClient()

	const invite = await db.organization.invite.get({ publicId: params.id })

	if (!invite) {
		logger.warn(`User navigated to invite page, but it wasn't found. Redirecting to home page...`)

		return notFound()
	}

	const { data: userSession } = await client.auth.getSession()

	const session = userSession?.session

	const organization = invite.organization

	return (
		<>
			<Heading type={4}>{t("auth.joinOrganizationHeading", { organization: organization.name })}</Heading>

			<div>
				<p className={"text-center"}>
					{t("auth.joinOrganizationSubHeading", { organization: organization.name })}
				</p>

				<p className={"text-center"}>
					<If condition={!session}>{t("auth.signUpToAcceptInvite")}</If>
				</p>
			</div>

			<If condition={session} fallback={<NewUserInviteForm action={acceptOrganizationInvite} code={params.id} />}>
				{(session) => (
					<ExistingUserInviteForm action={acceptOrganizationInvite} code={params.id} session={session} />
				)}
			</If>
		</>
	)
}

export default InvitePage
