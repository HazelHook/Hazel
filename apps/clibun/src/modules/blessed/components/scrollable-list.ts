import blessed from 'blessed'
import { maxStringLength } from '../../../core/lib/util.js'

export function ScrollableList({
    items,
    onSelect,
    selected,
    placeholder,
    noSelectColor,
}: {
    items: string[],
    onSelect: (item: string, index: number) => void,
    selected?: number,
    placeholder?: string,
    noSelectColor?: boolean,
}) {
    const width = maxStringLength([...items, placeholder ?? "..."])

    const list = blessed.list({
        padding: {
            left: 1,
        },
        items,
        tags: true,
        keys: true,
        vi: true,
        mouse: true,
        alwaysScroll: true,
        scrollable: true,
        width: width + 4,
        height: "100%",
        scrollbar: {
            ch: " ",
            track: {
                bg: "gray",
            },
            style: {
                inverse: true,
                fg: "white",
            },
        },
        style: {
            fg: "gray",
            selected: {
                fg: "white",
            }
        },
        border: {
            type: "line",
        },
    })
    if(selected !== undefined)
        list.select(selected)

    if(placeholder && items.length === 0)
        list.setContent(placeholder)

    list.on("select item", onSelect)

    return list
}