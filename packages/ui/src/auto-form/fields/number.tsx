import { AutoFormInputComponentProps } from "../types"
import AutoFormInput from "./input"

export const AutoFormNumber = ({ fieldProps, ...props }: AutoFormInputComponentProps) => {
	return (
		<AutoFormInput
			fieldProps={{
				type: "number",
				...fieldProps,
			}}
			{...props}
		/>
	)
}

export default AutoFormNumber
