import { useState } from "react"

import { Button } from "@hazel/ui/button"
import { Calendar } from "@hazel/ui/calendar"
import { Dialog, DialogClose, DialogContentWithoutClose, DialogTrigger } from "@hazel/ui/dialog"
import { subDays } from "date-fns"
import { DateRange } from "react-day-picker"

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
		<Dialog>
			<DialogTrigger asChild>
				<button type="button" className="font-medium w-full flex justify-start">
					Custom
				</button>
			</DialogTrigger>
			<DialogContentWithoutClose className="sm:max-w-[1024px] w-min">
				<div className="flex flex-col gap-2 w-min">
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={setDate}
						numberOfMonths={2}
					/>
					<div className="flex flex-row justify-end gap-2">
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
	)
}
