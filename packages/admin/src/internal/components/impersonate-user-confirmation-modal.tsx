"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import type { impersonateUserAction } from "@hazel/auth/actions"
import { useAction } from "@hazel/server/actions/client"
import { Alert, AlertHeading } from "@hazel/ui/alert"
import { Button } from "@hazel/ui/button"
import { If } from "@hazel/ui/if"
import { Modal } from "@hazel/ui/modal"
import { PageLoadingIndicator } from "@hazel/ui/page-loading-indicator"
import { User } from "@supabase/supabase-js"

import { ImpersonateUserAuthSetter } from "./impersonate-user-auth-setter"

function ImpersonateUserConfirmationModal({
	user,
	impersonateAction,
}: React.PropsWithChildren<{
	user: User
	impersonateAction: typeof impersonateUserAction
}>) {
	const action = useAction(impersonateAction)
	const router = useRouter()
	const [isOpen, setIsOpen] = useState(true)

	const displayText = user.email ?? user.phone ?? ""

	const onDismiss = () => {
		router.back()

		setIsOpen(false)
	}

	return (
		<Modal heading={"Impersonate User"} isOpen={isOpen} setIsOpen={onDismiss}>
			<If condition={action.data}>
				{(tokens) => {
					return (
						<>
							<ImpersonateUserAuthSetter tokens={tokens as any} />

							<PageLoadingIndicator>Setting up your session...</PageLoadingIndicator>
						</>
					)
				}}
			</If>

			<If condition={action.error}>
				<Alert type={"error"}>
					<AlertHeading>Impersonation Error</AlertHeading>
					Sorry, something went wrong. Please check the logs.
				</Alert>
			</If>

			<If condition={!action.error && !action.data}>
				<div className={"flex flex-col space-y-4"}>
					<div className={"flex flex-col space-y-2 text-sm"}>
						<p>
							You are about to impersonate the account belonging to <b>{displayText}</b> with ID{" "}
							<b>{user.id}</b>.
						</p>

						<p>
							You will be able to log in as them, see and do everything they can. To return to your own
							account, simply log out.
						</p>

						<p>Like Uncle Ben said, with great power comes great responsibility. Use this power wisely.</p>
					</div>

					<div className={"flex space-x-2.5 justify-end"}>
						<Modal.CancelButton disabled={action.status === "loading"} onClick={onDismiss}>
							Cancel
						</Modal.CancelButton>

						<Button
							type={"button"}
							loading={action.status === "loading"}
							variant={"destructive"}
							onClick={() => action.mutate({ userId: user.id })}
						>
							Yes, let&apos;s do it
						</Button>
					</div>
				</div>
			</If>
		</Modal>
	)
}

export default ImpersonateUserConfirmationModal
