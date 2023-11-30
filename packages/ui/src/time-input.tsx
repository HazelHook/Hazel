"use client"

import { Input } from "@hazel/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@hazel/ui/select"
import { forwardRef, useEffect, useState } from "react"

export type TimeTypes = "seconds" | "minutes" | "hours" | "days"

export type TimeInputProps = {
	value: number // IN MILLIS
	onChange: (val: number) => void
}

export const TimeInput = forwardRef(({ value, onChange, ...rest }: TimeInputProps) => {
	const [currVal, setCurrVal] = useState(value)
	const [type, setType] = useState<TimeTypes>(determineType(value))

	useEffect(() => {
		onChange(currVal)
	}, [currVal, onChange])

	return (
		<div className="flex flex-row">
			<Input
				type="number"
				onChange={(e) => {
					const val = parseFloat(e.target.value)
					setCurrVal(convertToMillis(Number.isNaN(val) ? 0 : val, type))
				}}
				value={convertMillis(currVal, type)}
				className="rounded-e-none max-w-xs"
			/>
			<Select value={type} onValueChange={setType as any}>
				<SelectTrigger className="rounded-s-none w-max">
					<SelectValue placeholder="Select a timestamp" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value="seconds">seconds</SelectItem>
						<SelectItem value="minutes">minutes</SelectItem>
						<SelectItem value="hours">hours</SelectItem>
						<SelectItem value="days">days</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	)
})

function determineType(millis: number): TimeTypes {
	if (millis % (1000 * 60 * 60 * 24) === 0) return "days"
	if (millis % (1000 * 60 * 60) === 0) return "hours"
	if (millis % (1000 * 60) === 0) return "minutes"
	return "seconds"
}

export function convertMillis(millis: number, format: TimeTypes): number {
	switch (format) {
		case "seconds":
			return millis / 1000
		case "minutes":
			return millis / (1000 * 60)
		case "hours":
			return millis / (1000 * 60 * 60)
		case "days":
			return millis / (1000 * 60 * 60 * 24)
		default:
			throw new Error("Invalid format")
	}
}

export function convertToMillis(value: number, type: TimeTypes): number {
	switch (type) {
		case "seconds":
			return value * 1000
		case "minutes":
			return value * 1000 * 60
		case "hours":
			return value * 1000 * 60 * 60
		case "days":
			return value * 1000 * 60 * 60 * 24
		default:
			throw new Error("Invalid time type")
	}
}
