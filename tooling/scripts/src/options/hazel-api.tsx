import { Text } from "../ext/ink"

export function HazelAPI({
	mode,
	selected,
	engaged,
}: {
	mode: "details" | "select"
	selected?: boolean
	engaged: boolean
}) {
	if (mode === "details") {
		if (!selected) return null
		return <Text>Expose Hazel API here.</Text>
	} else if (mode === "select") {
		if (selected) {
			return (
				<Text bold color="#CC671B" dimColor={engaged}>
					{">"} Hazel API
				</Text>
			)
		}
		return (
			<Text color="#CC671B" dimColor>
				{" "}
				Hazel API
			</Text>
		)
	}
}
