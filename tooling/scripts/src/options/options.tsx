import { useState } from "react"

import { Quicklinks } from "@hazel/ui"

import { Box, useInput } from "../ext/ink"
import { HazelAPI } from "./hazel-api.jsx"
import { Planter } from "./planter.jsx"
import { Purger } from "./purger"

const numberOptions = 4
const blocked = [3]

export default function Options() {
	const [option, setOption] = useState(0)
	const [engaged, setEngaged] = useState(false)

	useInput((input, key) => {
		if (!engaged) {
			if (key.upArrow) {
				let newOption = option - 1
				if (newOption < 0) newOption = numberOptions - 1

				setOption(newOption)
			}

			if (key.downArrow) {
				let newOption = option + 1
				if (newOption >= numberOptions) newOption = 0

				setOption(newOption)
			}
		}

		if (key.rightArrow && (option === 0 || option === 3)) {
			setEngaged(true)
		}

		if (key.leftArrow && !blocked.includes(option)) {
			setEngaged(false)
		}
	})

	return (
		<Box width={"100%"} display="flex" borderColor="#CC671B" borderStyle="round">
			<Box width="30" display="flex" flexDirection="column" borderRight={false} gap={0}>
				<Box marginLeft={2} display="flex" flexDirection="column">
					<Planter mode="select" selected={option === 0} engaged={engaged} />
					<Quicklinks mode="select" selected={option === 1} engaged={engaged} />
					<HazelAPI mode="select" selected={option === 2} engaged={engaged} />
					<Purger
						mode="select"
						selected={option === 3}
						engaged={engaged}
						disengage={() => setEngaged(false)}
					/>
				</Box>
			</Box>
			<Box height="100%" display="flex" flexDirection="column">
				<Planter mode="details" selected={option === 0} engaged={engaged} />
				<Quicklinks mode="details" selected={option === 1} engaged={engaged} />
				<HazelAPI mode="details" selected={option === 2} engaged={engaged} />
				<Purger mode="details" selected={option === 3} engaged={engaged} disengage={() => setEngaged(false)} />
			</Box>
		</Box>
	)
}
