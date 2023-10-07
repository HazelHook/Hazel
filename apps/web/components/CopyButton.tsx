"use client"

import { FC, ReactNode, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"

interface CopyButtonProps {
	value: string
	children: ReactNode
}

export const CopyButton: FC<CopyButtonProps> = (props) => {
	const [copied, setCopied] = useState(false)
	const handleClipboard = () => {
		navigator.clipboard.writeText(props.value)
		setCopied(true)
		toast.success("Copied to Clipboard")
	}

	useEffect(() => {
		if (copied === true) {
			setTimeout(() => {
				setCopied(false)
			}, 3000)
		}
	}, [copied])

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div className="flex gap-2 items-center" onClick={handleClipboard}>
			{props.children}
			<svg
				className="w-[14px] h-[14px]"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title>Copy</title>
				<path d="M16.9018 16.9018C17.1375 16.8669 17.3474 16.8195 17.5451 16.7553C19.0673 16.2607 20.2607 15.0673 20.7553 13.5451C21 12.7919 21 11.8613 21 10C21 8.13872 21 7.20808 20.7553 6.45492C20.2607 4.93273 19.0673 3.73931 17.5451 3.24472C16.7919 3 15.8613 3 14 3C12.1387 3 11.2081 3 10.4549 3.24472C8.93273 3.73931 7.73931 4.93273 7.24472 6.45492C7.18049 6.65258 7.13312 6.86246 7.09819 7.09819M16.9018 16.9018C17 16.2393 17 15.3728 17 14C17 12.1387 17 11.2081 16.7553 10.4549C16.2607 8.93273 15.0673 7.73931 13.5451 7.24472C12.7919 7 11.8613 7 10 7C8.6272 7 7.76066 7 7.09819 7.09819M16.9018 16.9018C16.8669 17.1375 16.8195 17.3474 16.7553 17.5451C16.2607 19.0673 15.0673 20.2607 13.5451 20.7553C12.7919 21 11.8613 21 10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14C3 12.1387 3 11.2081 3.24472 10.4549C3.73931 8.93273 4.93273 7.73931 6.45492 7.24472C6.65258 7.18049 6.86246 7.13312 7.09819 7.09819" />

				<AnimatePresence>
					{copied && (
						<motion.path
							d="M7 14.2587L9.0362 16.2927C10.0155 14.5802 11.3709 13.1125 13 12"
							key="check"
							initial={{
								pathLength: 0,
								pathOffset: 0,
							}}
							animate={{
								pathLength: 1,
								pathOffset: 0,
								transition: { duration: 0.5, ease: "easeInOut" },
							}}
							exit={{
								pathOffset: 1,
								pathLength: 1,
								transition: { duration: 0.5, ease: "easeInOut" },
							}}
						/>
					)}
				</AnimatePresence>
			</svg>
		</div>
	)
}
