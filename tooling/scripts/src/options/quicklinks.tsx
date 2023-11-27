import { Text } from "../ext/ink"

export function Quicklinks({
	mode,
	selected,
	engaged,
}: {
	mode: "details" | "select"
	selected?: boolean
	engaged?: boolean
}) {
	if (mode === "details") {
		if (!selected) return null
		return <Text>A collection of useful quicklinks for internal use.</Text>
	}
	if (selected) {
		return (
			<Text bold color="#CC671B" dimColor={engaged}>
				{">"} Quicklinks
			</Text>
		)
	}
	return (
		<Text color="#CC671B" dimColor>
			{" "}
			Quicklinks
		</Text>
	)
}
