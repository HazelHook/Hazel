"use client"

import { useCallback, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@hazel/ui/select"

export type ProjectPickerProps = {
	data: { id: string; name: string }[]
	defaultValue?: { id: string; name: string }
	searchParamKey: string
}

export const ProjectPicker = ({ data, defaultValue = data[0], searchParamKey }: ProjectPickerProps) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const searchParamVal = searchParams.get(searchParamKey)

	const [value, setValue] = useState(data.find((datum) => datum.id === searchParamVal)?.id || defaultValue?.id)

	const createQueryStr = useCallback(
		(name: string, value?: string) => {
			const params = new URLSearchParams(searchParams)

			if (value) {
				params.set(name, value)
			} else {
				params.delete(name, value)
			}

			return params.toString()
		},
		[searchParams],
	)

	return (
		<Select
			value={value}
			onValueChange={(value) => {
				setValue(value)

				if (value === "all") {
					return router.push(`?${createQueryStr(searchParamKey, undefined)}`)
				}

				if (pathname === "/") {
					router.push(`?${createQueryStr(searchParamKey, value)}`)
				} else {
					router.push(`${pathname}?${createQueryStr(searchParamKey, value)}`)
				}
			}}
		>
			<SelectTrigger>
				<SelectValue placeholder="Select a destination" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">
					<p className="font-medium">All Destinations</p>
				</SelectItem>
				{data.map((datum) => (
					<SelectItem value={datum.id} key={datum.id}>
						<p className="font-medium">{datum.name}</p>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
