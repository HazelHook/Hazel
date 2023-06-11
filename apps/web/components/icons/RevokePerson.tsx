import { LucideProps } from "lucide-react"

export const RevokePerson = (props: LucideProps) => {
	return (
		<svg
			className="mr-2 text-destructive"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M11 15H7C4.79086 15 3 16.7909 3 19C3 20.1046 3.89543 21 5 21H12M21 13L18.5 15.5M18.5 15.5L16 18M18.5 15.5L21 18M18.5 15.5L16 13M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
