import { Box } from "./ext/ink"
import BigText from "./ext/ink-big-text"
import Gradient from "./ext/ink-gradient"
import Options from "./options/options.jsx"

export default function App() {
	return (
		<Box width="100%" display="flex" flexDirection="column">
			<Box
				borderColor="#CC671B"
				borderStyle="round"
				width={"100%"}
				alignItems="center"
				display="flex"
				justifyContent="center"
			>
				<Gradient name="fruit">
					<BigText text="Hazlenut Planter" font="simple" space={false} />
					{"\n"}
				</Gradient>
			</Box>
			<Options />
		</Box>
	)
}
