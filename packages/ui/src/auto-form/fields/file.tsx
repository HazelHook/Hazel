import { AutoFormInputComponentProps } from "../types"
import AutoFormInput from "./input"

export default function AutoFormFile({ fieldProps, ...props }: AutoFormInputComponentProps) {
	return (
		<AutoFormInput
			fieldProps={{
				type: "file",
				...fieldProps,
			}}
			{...props}
		/>
	)
}
