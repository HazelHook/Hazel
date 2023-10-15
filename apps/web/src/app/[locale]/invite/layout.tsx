import { I18Provider } from "@//components/i18-provider"
import AuthPageShell from "../auth/components/AuthPageShell"

async function InvitePageLayout({ children }: React.PropsWithChildren) {
	return (
		<I18Provider>
			<AuthPageShell>{children}</AuthPageShell>
		</I18Provider>
	)
}

export default InvitePageLayout
