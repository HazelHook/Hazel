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
		// rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
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
				<rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
				<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
				<AnimatePresence>
					{copied && (
						<motion.path
							d="m9 14 2 2 4-4"
							key="check"
							initial={{
								pathLength: 0,
							}}
							animate={{
								pathLength: 1,
							}}
							exit={{
								pathLength: 0,
							}}
						/>
					)}
				</AnimatePresence>
			</svg>
		</div>
	)
}
