import blessed from 'blessed';
import { Module, UserData } from '../../module.js';
import { customTable } from '../components/table.js';

export function getForwardMenu(data: UserData, module: Module, rerender: (box: blessed.Widgets.BoxElement) => void) {
    const box = blessed.box({
        padding: {
            left: 1,
            right: 1,
        },
        tags: true,
        keys: true,
        vi: true,
        alwaysScroll:true,
        scrollable: true,
        mouse: true,
        scrollbar: {
            ch: " ",
            track: {
                bg: "gray",
            },
            style: {
                inverse: true,
            },
        },
        style: {
            fg: "white",
        },
        align: "center"
    })

    const title = blessed.text({
        content: "Select the destination you want to observe.",
        tags: true,
        style: {
            fg: "white",
        },
    })
    box.append(title)

    const destinationTable: string[][] = []
    for(const d of data.destinations){
        const conns = data.connections.filter(c => c.destination === d.id)
        const srcs = conns.map(c => data.sources.find(s => s.id === c.source)?.name)

        destinationTable.push([d.name, srcs.join(', '), d.url, d.id])
    }

    const table = customTable(["Name", "Connected Sources", "Destination URL", "ID"], destinationTable, (index) => {
        
    })
    table.top = 3

    box.append(table)

    const screenBox = blessed.box({
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        tags: true,
        style: {
            fg: "white",
        },
    })
    screenBox.append(box)
    rerender(screenBox)
}