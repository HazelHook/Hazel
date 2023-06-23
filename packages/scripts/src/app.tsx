import React from "react"
// @ts-expect-error
import { Box, Text } from "ink"
// @ts-expect-error
import Gradient from "ink-gradient"
// @ts-expect-error
import BigText from "ink-big-text"
import Options from "./options/options.js"

type Props = {
	name: string | undefined
}

export default function App() {
	return (
		<Box width="100%" display="flex" flexDirection="column">
			<Box borderColor='#CC671B' borderStyle='round' width={'100%'} alignItems='center' display='flex' justifyContent='center'>
				<Gradient name="fruit">
					<BigText text="Hazlenut Planter" font="simple" space={false}/>
					{'\n'}
				</Gradient>
			</Box>
			<Options/>
		</Box>
	)
}
