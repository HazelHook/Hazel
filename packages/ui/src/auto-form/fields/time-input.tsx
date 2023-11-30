import { FormControl, FormDescription, FormItem, FormLabel } from "../../form"
import { TimeInput } from "../../time-input"
import { AutoFormInputComponentProps } from "../types"

export default function AutoFormTimeInput({
	label,
	isRequired,
	field,
	fieldConfigItem,
	fieldProps,
}: AutoFormInputComponentProps) {
	return (
		<FormItem className="space-y-2">
			<FormLabel>
				{label}
				{isRequired && <span className="text-destructive"> *</span>}
			</FormLabel>
			<FormControl>
				<TimeInput onChange={field.onChange} value={field.value} {...fieldProps} />
			</FormControl>
			{fieldConfigItem.description && <FormDescription>{fieldConfigItem.description}</FormDescription>}
		</FormItem>
	)
}
