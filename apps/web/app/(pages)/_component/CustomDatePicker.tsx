"use client"

import { useState } from "react"
import { subDays } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogClose, DialogContentWithoutClose, DialogTrigger } from "@/components/ui/dialog"

interface CustomDatePickerProps {
	className?: string
	onSave?: (data: { from: Date; to: Date }) => void
}

export function CustomDatePicker({ className, onSave }: CustomDatePickerProps) {
	const [date, setDate] = useState<DateRange | undefined>({
		from: subDays(new Date(), 20),
		to: new Date(),
	})

	return (
		<div className={cn("grid gap-2", className)}>
			<Dialog>
				<DialogTrigger asChild>
					<p className="font-medium">Custom</p>
				</DialogTrigger>
				<DialogContentWithoutClose className="w-auto sm:max-w-[1024px]">
					<div className="flex flex-col gap-2">
						<Calendar
							initialFocus
							mode="range"
							defaultMonth={date?.from}
							selected={date}
							onSelect={setDate}
							numberOfMonths={2}
						/>
						<div className="flex w-full flex-row justify-end gap-2">
							<DialogClose asChild>
								<Button variant="secondary">Cancel</Button>
							</DialogClose>
							<DialogClose asChild>
								<Button
									disabled={!date || !date.from || !date.to}
									onClick={() => {
										if (onSave && date && date.from && date.to) {
											onSave(date as any)
										}
									}}
								>
									Save
								</Button>
							</DialogClose>
						</div>
					</div>
				</DialogContentWithoutClose>
			</Dialog>
		</div>
	)
}
