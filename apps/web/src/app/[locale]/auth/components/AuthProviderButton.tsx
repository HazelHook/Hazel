import { Button } from "@/components/ui/button"
import AuthProviderLogo from "./AuthProviderLogo"

const AuthProviderButton: React.FCC<{
	providerId: string
	onClick: () => unknown
}> = ({ children, providerId, onClick }) => {
	return (
		<Button
			data-cy={"auth-provider-button"}
			color={"custom"}
			className={"w-full relative"}
			onClick={onClick}
			data-provider={providerId}
		>
			<span className={"absolute left-3 flex items-center justify-start"}>
				<AuthProviderLogo providerId={providerId} />
			</span>

			<span className={"flex w-full flex-1 items-center"}>
				<span className={"flex w-full items-center justify-center"}>
					<span className={"text-current"}>{children}</span>
				</span>
			</span>
		</Button>
	)
}

export default AuthProviderButton
