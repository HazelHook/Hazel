import blessed from 'blessed';
import { Module, UserData } from '../../module.js';
import { ScrollableList } from '../components/scrollable-list.js';
import { ScrollablePanel } from '../components/scrollable-panel.js';
import { renderList } from '../../../core/lib/print-util.js';

let selectedDestination = 0


export function getForwardMenu(data: UserData, module: Module, rerender: (box: blessed.Widgets.BoxElement) => void) {
    const destinations = ScrollableList({
        items: data.destinations.map(d => `● ${d.name}`),
        onSelect(_, index) {
            selectedDestination = index
            getForwardMenu(data, module, rerender)
        },
        selected: selectedDestination,
    })

    const indicators = blessed.box({
        width: 1,
        height: "100%-2",
        left: 2,
        top: 1,
        tags: true,
    })
    
    indicators.setContent(
        data.destinations.map(d => '{bold}{red-fg}●{/red-fg}{/bold}').join('\n')
    )


    const detailBox = ScrollablePanel({
        width: `100%-${destinations.width}`,
        height: "100%",
        left: destinations.width,
        top: 0,
    })

    const destination = data.destinations[selectedDestination]

    const content = renderList({
        Name: destination.name,
        URL: destination.url,
        ID: destination.id,
        Sources: data.connections.filter(c => c.destination === destination.id).map(c => data.sources.find(s => s.id === c.source)?.name).join(', '),
    })
        
    detailBox.setContent(`{bold}${destination.name}{/bold}\n\n${content}`)
    detailBox.append(blessed.textbox({
        width: "100%-8",
        height: 3,
        top: 6,
        left: 0,
        value: "",
        fg: "gray",
        keys: true,
        vi: true,
        mouse: true,
        inputOnFocus: true,
        style: {
            fg: "gray",
            focus: {
                fg: "white",
            },
            hover: {
                fg: "white",
            },
        },
        border: {
            type: "line",
        }
    }))

    // const destinationTable: string[][] = []
    // for(const d of data.destinations){
    //     const conns = data.connections.filter(c => c.destination === d.id)
    //     const srcs = conns.map(c => data.sources.find(s => s.id === c.source)?.name)

    //     destinationTable.push([d.name, srcs.join(', '), d.url, d.id])
    // }

    // const table = customTable(["Name", "Connected Sources", "Destination URL", "ID"], destinationTable, (index) => {
        
    // })

    // table.top = 3

    // box.append(table)

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
    screenBox.append(destinations)
    screenBox.append(detailBox)
    indicators.setFront()
    screenBox.append(indicators)
    rerender(screenBox)
}