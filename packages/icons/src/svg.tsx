import { IconProps } from "./types"

export const SvgIcon = (props: IconProps) => (
	<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M12 5v14m0-14a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm0 14a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm7-7H5m14 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0ZM5 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm1.707-5.293a1 1 0 1 0-1.414-1.414 1 1 0 0 0 1.414 1.414Zm0 0 10.586 10.586m0-10.586a1 1 0 1 0 1.414-1.415 1 1 0 0 0-1.414 1.415Zm0 0L6.707 17.293m10.586 0a1 1 0 1 0 1.415 1.414 1 1 0 0 0-1.415-1.414Zm-10.586 0a1 1 0 1 0-1.415 1.414 1 1 0 0 0 1.415-1.414Z"
		/>
		<title>svgIcon</title>
	</svg>
)
