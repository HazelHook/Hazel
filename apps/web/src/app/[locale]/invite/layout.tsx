import AuthPageShell from "../auth/components/AuthPageShell"

async function InvitePageLayout({ children }: React.PropsWithChildren) {
	return <AuthPageShell>{children}</AuthPageShell>
}

export default InvitePageLayout
