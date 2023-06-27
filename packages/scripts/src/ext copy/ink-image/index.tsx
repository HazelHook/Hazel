import React from 'react';
import { Box } from "../ink";
import termImg from 'term-img';
import omit from 'lodash.omit';
import propTypes from 'prop-types';


const Image = props => (
	<Box>
		{termImg.string(props.src, Object.assign(omit(props, ['alt', 'src']), {
			fallback: () => props.alt
		}))}
	</Box>
);

Image.propTypes = {
	alt: propTypes.string,
	src: propTypes.oneOfType([
		propTypes.object,
		propTypes.string
	]).isRequired
};

Image.defaultProps = {
	alt: ''
};

module.exports = Image;
