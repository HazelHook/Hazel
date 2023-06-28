import { IconProps } from "./types"

export const AtomIcon = (props: IconProps) => (
	<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
		<g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
			<path d="M11 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" />
			<path d="M15.868 8.132c4.487 4.486 6.392 9.855 4.256 11.992-2.137 2.136-7.506.231-11.992-4.255C3.645 11.381 1.74 6.012 3.876 3.875c2.137-2.136 7.506-.231 11.992 4.256Z" />
			<path d="M8.132 8.132c-4.487 4.486-6.392 9.855-4.256 11.992 2.137 2.136 7.506.231 11.992-4.255 4.487-4.487 6.392-9.856 4.256-11.993-2.137-2.136-7.506-.231-11.992 4.256Z" />
		</g>
		<title>atomIcon</title>
	</svg>
)
