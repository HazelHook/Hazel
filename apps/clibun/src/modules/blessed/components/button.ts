import blessed from "blessed"
type ButtonProps = Parameters<typeof blessed.button>[0]
export const StyledButton = (props: ButtonProps) => {

	const style: ButtonProps = {
		style: {
			fg: "gray",
			hover: {
				fg: "white",
			},
		},
		border: {
			type: "line",
		},
		align: "center",
	}
	
	return blessed.button(mergeStyles(props, style))
}

function mergeStyles(props: any, style: any) {
	const styled = Object.entries(style)

	for (const [key, value] of styled) {
		if(typeof value === "object") {
			props[key] ??= {}
			mergeStyles(props[key], value)
		} else {
			props[key] ??= value
		}
	}

	return props
}