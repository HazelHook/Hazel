"use client"

import { useCallback } from "react"
import useRefresh from "@/core/hooks/use-refresh"
import { useSignOut } from "@hazel/auth/hooks"
import { useAction } from "@hazel/server/actions/client"
import { Button } from "@hazel/ui/button"
import type { Session } from "@supabase/auth-helpers-nextjs"
import { useTranslations } from "next-intl"

import type { acceptOrganizationInvite } from "@/server/actions/organization-invite"

function ExistingUserInviteForm(
	props: React.PropsWithChildren<{
		session: Session
		code: string
		action: typeof acceptOrganizationInvite
	}>,
) {
	const t = useTranslations()
	const signOut = useSignOut()
	const refresh = useRefresh()

	const inviteAcceptAction = useAction(props.action)

	const onSignOut = useCallback(async () => {
		await signOut()
		refresh()
	}, [refresh, signOut])

	return (
		<>
			<div className={"flex flex-col space-y-4"}>
				<p className={"text-center text-sm"}>
					{t("auth.clickToAcceptAs", { email: props.session.user.email })}
				</p>

				<Button
					className="w-full"
					loading={inviteAcceptAction.status === "loading"}
					onClick={() => inviteAcceptAction.mutate({ inviteId: props.code })}
					data-cy={"accept-invite-submit-button"}
				>
					{t("auth.acceptInvite")}
				</Button>

				<div>
					<div className={"flex flex-col space-y-4"}>
						<p className={"text-center"}>
							<span className={"text-center text-sm text-muted-foreground"}>
								{t("auth.acceptInviteWithDifferentAccount")}
							</span>
						</p>

						<div className={"flex justify-center"}>
							<Button
								data-cy={"invite-sign-out-button"}
								disabled={inviteAcceptAction.status === "loading"}
								variant={"ghost"}
								size={"sm"}
								onClick={onSignOut}
								type={"button"}
							>
								{t("auth.signOut")}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ExistingUserInviteForm
