import React, { useState, useEffect } from "react"
import { Button, ButtonProps } from "./ui/button"

interface LoadingButtonProps extends ButtonProps {
	loading: boolean
	loadingTime?: number
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
	loading: propLoading,
	loadingTime = 1000,
	children,
	...props
}) => {
	const [internalLoading, setInternalLoading] = useState<boolean>(propLoading)
	const [loadingChangeTimestamp, setLoadingChangeTimestamp] = useState<number | null>(null)

	useEffect(() => {
		if (loadingChangeTimestamp === null) {
			setLoadingChangeTimestamp(Date.now())
			setInternalLoading(propLoading)
		} else {
			const timePassed = Date.now() - loadingChangeTimestamp
			const remainingTime = Math.max(0, loadingTime - timePassed)

			const timeoutId = setTimeout(() => {
				setLoadingChangeTimestamp(Date.now())
				setInternalLoading(propLoading)
			}, remainingTime)

			return () => clearTimeout(timeoutId)
		}
	}, [propLoading])

	return (
		<Button {...props} loading={internalLoading} disabled={internalLoading}>
			{children}
		</Button>
	)
}
