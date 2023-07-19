import React, { useState } from "react"
import { Box, useInput, Text } from "ink"

type TextListProps = {
    items: string[], onSelect: (index: number) => void, onFocus?: (index: number) => void
} & (
    {
        vertical: true
        horizontal?: false
    } | {
        horizontal: true
        vertical?: false
    }
)

export function TextList({
    items, onSelect, onFocus, vertical, horizontal
}: TextListProps) {
    const [selected, setSelected] = useState(-1)
    const [focused, setFocused] = useState(0)

    useInput((_, key) => {
        if((key.upArrow && vertical) || (key.leftArrow && horizontal)){
            if(focused > 0){
                setFocused(focused - 1)
                onFocus?.(focused - 1)
            }
        }else if((key.downArrow && vertical) || (key.rightArrow && horizontal)){
            if(focused < items.length - 1){
                setFocused(focused + 1)
                onFocus?.(focused + 1)
            }
        }

        if(key.return){
            setSelected(focused)
            onSelect(focused)
        }
    })

    return (
        <Box flexDirection={horizontal ? 'row' : 'column'}>
            {items.map((item, index) => (
                <Text key={index} dimColor={focused !== index} color={selected === index ? 'green' : 'white'}>{item}</Text>
            ))}
        </Box>
    )
}