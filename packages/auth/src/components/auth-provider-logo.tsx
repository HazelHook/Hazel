import Image from "next/image"

import { KeyIcon, PhoneIcon } from "@hazel/icons"

const DEFAULT_IMAGE_SIZE = 22

export const AuthProviderLogo: React.FC<{
	providerId: string
	width?: number
	height?: number
}> = ({ providerId, width, height }) => {
	const image = getOAuthProviderLogos()[providerId]

	if (typeof image === "string") {
		return (
			<Image
				decoding={"async"}
				loading={"lazy"}
				src={image}
				alt={`${providerId} logo`}
				width={width ?? DEFAULT_IMAGE_SIZE}
				height={height ?? DEFAULT_IMAGE_SIZE}
			/>
		)
	}

	return <>{image}</>
}

function getOAuthProviderLogos(): Record<string, string | React.ReactNode> {
	return {
		password: <KeyIcon className={"h-[22px] w-[22px]"} />,
		phone: <PhoneIcon className={"h-[22px] w-[22px]"} />,
		google: "/assets/oauth/google.webp",
		facebook: "/assets/oauth/facebook.webp",
		twitter: "/assets/oauth/twitter.webp",
		github: "/assets/oauth/github.webp",
		microsoft: "/assets/oauth/microsoft.webp",
		apple: "/assets/oauth/apple.webp",
	}
}
