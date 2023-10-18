import { notFound } from "next/navigation"
import getLogger from "@/core/logger"
import getSupabaseServerClient from "@/core/supabase/server-client"
import { Heading } from "@hazel/ui/heading"
import If from "@hazel/ui/if"
import { useTranslations } from "next-intl"

import { acceptOrganizationInvite } from "@/server/actions/organization-invite"
import db from "@/lib/db"

import ExistingUserInviteForm from "../components/existing-user-invite-form"
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
	const t = useTranslations()

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
					{t("auth.joinOrganizationSubHeading", {
						organization: organization.name,
					})}
				</p>

				<p className={"text-center"}>
					<If condition={!session}>{t("auth.signUpToAcceptInvite")}</If>
				</p>
			</div>

			<If condition={session} fallback={<NewUserInviteForm action={acceptOrganizationInvite} code={params.id} />}>
				{(session) => <ExistingUserInviteForm action={acceptOrganizationInvite} code={params.id} session={session} />}
			</If>
		</>
	)
}

export default InvitePage
