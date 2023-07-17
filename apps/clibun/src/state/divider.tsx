import React from 'react';
import {Box, Text} from 'ink';

// Divider
export const Divider = ({
	title,
	width= 50,
	padding= 1,
	titlePadding= 1,
	titleColor= 'white',
	dividerChar= '─',
	dividerColor= 'grey'
}) => {
	const titleString = title ?
		`${' '.repeat(titlePadding) + title + ' '.repeat(titlePadding)}` :
		'';
	const numberOfCharsPerSide = width / 2;
	const dividerSideString = dividerChar.repeat(numberOfCharsPerSide);

	const paddingString = ' '.repeat(padding);

	return (
		<Box flexDirection="row">
			<Text>
				{paddingString}
				<Text color={dividerColor}>{dividerSideString}</Text>
				<Text color={titleColor}>{titleString}</Text>
				<Text color={dividerColor}>{dividerSideString}</Text>
				{paddingString}
			</Text>
		</Box>
	);
};
