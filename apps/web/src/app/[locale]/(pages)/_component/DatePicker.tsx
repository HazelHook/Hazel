"use client"

import { useCallback, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@hazel/ui/select"
import { format } from "date-fns"

import { formatDateTime } from "@/lib/utils"
import { CalendarIcon } from "@/components/icons/pika/calendar"
import { CheckTickIcon } from "@/components/icons/pika/checkTick"

import { CustomDatePicker } from "./CustomDatePicker"

type Interval = {
	name: string
	interval: string
}
const intervals: Interval[] = [
	{ name: "Last 24 hours", interval: "24h" },
	{ name: "Last 7 days", interval: "7d" },
	{ name: "Last 14 days", interval: "14d" },
	{ name: "Last 30 days", interval: "30d" },
	{ name: "Last 3 months", interval: "3m" },
	{ name: "Last 6 months", interval: "6m" },
	{ name: "Last 12 months", interval: "1y" },
]

export const DatePicker = () => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const [value, setValue] = useState(
		searchParams?.get("period") || (searchParams?.get("date_to") && "custom") || intervals[1].interval,
	)

	const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(
		searchParams?.get("date_to")
			? {
					from: new Date(searchParams.get("date_from")!),
					to: new Date(searchParams.get("date_to")!),
			  }
			: undefined,
	)

	const createQueryStr = useCallback((name: string, value: string) => {
		const params = new URLSearchParams()
		params.set(name, value)

		return params.toString()
	}, [])

	return (
		<Select
			value={value}
			onValueChange={(value) => {
				if (pathname === "/") {
					router.push(`?${createQueryStr("period", value)}`)
				} else {
					router.push(`${pathname}?${createQueryStr("period", value)}`)
				}

				setDateRange(undefined)
				setValue(value)
			}}
		>
			<SelectTrigger>
				<CalendarIcon className="mr-2 h-4 w-4" />
				{dateRange ? (
					<>
						{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
					</>
				) : (
					<SelectValue placeholder="Select a plan" />
				)}
			</SelectTrigger>
			<SelectContent>
				{intervals.map((interval) => (
					<SelectItem value={interval.interval} key={interval.name}>
						<p className="font-medium">{interval.name}</p>
					</SelectItem>
				))}
				<div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
					{value === "custom" && (
						<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
							<CheckTickIcon className="h-4 w-4" />
						</span>
					)}

					<CustomDatePicker
						onSave={(dateRange) => {
							router.push(
								`${pathname}?
									${createQueryStr("date_from", formatDateTime(dateRange.from)!)}&${createQueryStr(
									"date_to",
									formatDateTime(dateRange.to)!,
								)}`,
							)
							setDateRange(dateRange)
							setValue("custom")
						}}
					/>
				</div>
			</SelectContent>
		</Select>
	)
}
