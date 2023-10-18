"use client"

import { createContext, ReactNode, useContext, useMemo, useState } from "react"
import { AlertExclamationIcon, CheckTickCircleIcon, CrossIcon, InfoCircleIcon, InfoTriangleIcon } from "@hazel/icons"
import { cva } from "class-variance-authority"
import classNames from "clsx"

import { Button } from "./button"
import Heading from "./heading"

type AlertType = "success" | "error" | "warn" | "info"

const icons = {
	success: (className: string) => <CheckTickCircleIcon className={className} />,
	error: (className: string) => <AlertExclamationIcon className={className} />,
	warn: (className: string) => <InfoTriangleIcon className={className} />,
	info: (className: string) => <InfoCircleIcon className={className} />,
}

const AlertContext = createContext<Maybe<AlertType>>(undefined)
const alertClassNameBuilder = getClassNameBuilder()
const alertIconClassNameBuilder = getIconClassNameBuilder()

const Alert: React.FC<{
	type: "success" | "error" | "warn" | "info"
	useCloseButton?: boolean
	className?: string
	children: ReactNode
}> & {
	Heading: typeof AlertHeading
} = ({ children, type, useCloseButton, className }) => {
	const [visible, setVisible] = useState(true)

	if (!visible) {
		return null
	}

	const alertClassName = alertClassNameBuilder({ type })

	return (
		<div className={classNames(alertClassName, className)}>
			<AlertContext.Provider value={type}>
				<span className={"flex items-center space-x-2"}>
					<span>{children}</span>
				</span>

				{useCloseButton && (
					<Button variant="ghost" className={"dark:hover:bg-transparent"} onClick={() => setVisible(false)}>
						<CrossIcon className={"h-6"} />
					</Button>
				)}
			</AlertContext.Provider>
		</div>
	)
}

function AlertHeading({ children }: React.PropsWithChildren) {
	const type = useContext(AlertContext)
	const className = alertIconClassNameBuilder({ type })

	const Icon = useMemo(() => (type ? icons[type](className) : null), [type, className])

	return (
		<div className={"mb-2 flex items-center space-x-2"}>
			<span>{Icon}</span>

			<Heading type={6}>
				<span className={"text-base font-semibold"}>{children}</span>
			</Heading>
		</div>
	)
}

Alert.Heading = AlertHeading

function getClassNameBuilder() {
	return cva(["p-4 relative flex items-center justify-between text-gray-700 rounded-lg text-sm border"], {
		variants: {
			type: {
				success: "bg-green-50 dark:bg-green-500/10 dark:text-green-500 text-green-800 border-green-500/10",
				info: "bg-sky-50 dark:bg-sky-500/10 dark:text-sky-500 text-sky-800 border-sky-500/10",
				error: "bg-red-50 dark:bg-red-500/10 dark:text-red-500 text-red-800 border-red-500/10",
				warn: "bg-yellow-50 dark:bg-yellow-500/5 dark:text-yellow-500 text-yellow-800 border-yellow-500/10",
			},
		},
		defaultVariants: {
			type: "info",
		},
	})
}

function getIconClassNameBuilder() {
	return cva(["rounded-full h-5"], {
		variants: {
			type: {
				success: "text-green-700",
				info: "text-blue-700",
				error: "text-red-700",
				warn: "text-yellow-700",
			},
		},
		defaultVariants: {
			type: "info",
		},
	})
}

export default Alert

export { Alert, AlertHeading }
