import { forwardRef } from "react"
import { AutoFormInputComponentProps } from "../types"
import AutoFormInput from "./input"

export const AutoFormNumber = forwardRef(({ fieldProps, ...props }: AutoFormInputComponentProps) => {
	return (
		<AutoFormInput
			fieldProps={{
				type: "number",
				...fieldProps,
			}}
			{...props}
		/>
	)
})

export default AutoFormNumber
