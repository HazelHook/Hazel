import React from "react"
import omit from "lodash.omit"
import propTypes from "prop-types"
import termImg from "term-img"

import { Box } from "../ink"

const Image = (props) => (
	<Box>
		{termImg.string(
			props.src,
			Object.assign(omit(props, ["alt", "src"]), {
				fallback: () => props.alt,
			}),
		)}
	</Box>
)

Image.propTypes = {
	alt: propTypes.string,
	src: propTypes.oneOfType([propTypes.object, propTypes.string]).isRequired,
}

Image.defaultProps = {
	alt: "",
}

module.exports = Image
