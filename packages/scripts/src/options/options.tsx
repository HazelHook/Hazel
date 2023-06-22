import React, { useState } from "react"
import { Box, useInput, Newline } from "ink"
import { Planter } from "./planter.js"
import { Quicklinks } from "./quicklinks.js";
import { HazelAPI } from "./hazel-api.js";

export default function Options() {
	const [option, setOption] = useState(0)
	const [engaged, setEngaged] = useState(false)

    
	useInput((input, key) => {
		if(!engaged){
			if (key.upArrow) {
				let newOption = option - 1
				if(newOption < 0)
					newOption = 2
	
				
				setOption(newOption)
			}
	
			if (key.downArrow) {
				let newOption = option + 1
				if(newOption >= 3)
					newOption = 0
	
				
				setOption(newOption)
			}
		}


		if(key.rightArrow && option === 0){
			setEngaged(true)
		}

		if(key.leftArrow){
			setEngaged(false)
		}
	});

	return (
		<Box
			width={"100%"}
			display="flex"
			borderColor="#CC671B"
			borderStyle="round"
		>
			<Box width="30" display="flex" flexDirection="column" borderRight={false} gap={0}>
				<Box marginLeft={2} display="flex" flexDirection="column">
					<Planter mode="select" selected={option === 0} engaged={engaged}/>
					<Quicklinks mode="select" selected={option === 1} engaged={engaged}/>
					<HazelAPI mode="select" selected={option === 2} engaged={engaged}/>
				</Box>
			</Box>
			<Box height="100%" display="flex" flexDirection="column">
				<Planter mode="details" selected={option === 0} engaged={engaged}/>
				<Quicklinks mode="details" selected={option === 1} engaged={engaged}/>
				<HazelAPI mode="details" selected={option === 2} engaged={engaged}/>
            </Box>
		</Box>
	)
}
