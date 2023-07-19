import { Box, measureElement } from "ink"
import React, { useEffect, useRef, useState } from "react"
import { Separator } from "./Separator.js";
import { useStdoutDimensions } from "../hooks/Dimensions.js";


export function Window({ title, focused, children }: { title: string; focused?: boolean; children: React.ReactNode }) {
    const ref = useRef()
    const [size, setSize] = useState({ width: 0, height: 0 })
    const [columns, rows] = useStdoutDimensions();

    useEffect(() => {
        const size = measureElement(ref.current)
        setSize(size)
    }, [rows, columns])


	return (
        <Box>
		<Box ref={ref} minWidth={title.length + 10} borderStyle="round" borderColor={focused ? "white" : "gray"} flexDirection="column">
            <Separator text={title} width={size.width} />
			{children}
		</Box>
        </Box>
	)
}
