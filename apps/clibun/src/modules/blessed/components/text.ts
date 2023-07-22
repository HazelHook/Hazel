import blessed from "blessed"

export function Text(props: {
	content: string
	variant: "title" | "subtitle"
}) {
	return blessed.text({
		content: props.content,
		tags: true,
		style: {
			fg: props.variant === "title" ? "white" : "gray",
		},
	})
}
