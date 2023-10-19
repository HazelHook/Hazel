import { Logo } from "@hazel/ui/logo"

import { AuthConfig, AuthConfigProvider } from "../provider"

export function AuthPageShell({ children, ...rest }: React.PropsWithChildren<AuthConfig>) {
	return (
		<AuthConfigProvider {...rest}>
			<div
				className={
					"flex h-screen flex-col items-center justify-center space-y-4 md:space-y-8 lg:space-y-16 bg-background"
				}
			>
				<Logo />

				<div
					className={
						"flex w-full max-w-sm flex-col items-center space-y-4 rounded-xl border-transparent bg-card px-2 py-1 shadow-lg md:w-8/12 md:border md:px-8 md:py-6 md:shadow-xl lg:w-5/12 lg:px-6 xl:w-4/12 2xl:w-3/12"
					}
				>
					{children}
				</div>
			</div>
		</AuthConfigProvider>
	)
}
