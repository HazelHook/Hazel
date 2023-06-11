import { LucideProps } from "lucide-react"

import { cn } from "@/lib/utils"

export const SunIcon = ({ className, ...props }: LucideProps) => {
	return (
		<svg
			className={cn("h-5 w-5", className)}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<g clipPath="url(#clip0_25_840)">
				<path
					d="M12 23V22M4.22183 19.7782L4.92893 19.0711M1 12H2M4.22183 4.22183L4.92893 4.92893M12 2V1M19.0711 4.92893L19.7782 4.22183M22 12H23M19.0711 19.0711L19.7782 19.7782M18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12Z"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_25_840">
					<rect width="24" height="24" fill="white" />
				</clipPath>
			</defs>
		</svg>
	)
}
