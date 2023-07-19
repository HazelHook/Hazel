import React from 'react'
import { Box, Text } from 'ink'

export function Separator({text, width}: {
    text: string,
    width: number
}) {
    if(width === 0) {
        return <Text>{text}</Text>
    }
    width = width - 2
    const textWidth = text.length
    const remainingWidth = width - textWidth
    const leftWidth = Math.floor(remainingWidth / 2)
    const rightWidth = remainingWidth - leftWidth

    return (
        <Box width={width}>
            <Text dimColor>{'─'.repeat(leftWidth)}</Text>
            <Text>{text}</Text>
            <Text dimColor>{'─'.repeat(rightWidth)}</Text>
        </Box>
    )
}