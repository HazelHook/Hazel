import { useInput } from "ink"

interface LayoutDefinition {
    direction: 'v' | 'h'
    elements: number
    confirmEvent?: (index: number) => void
}


export function selectableLayout({layout, selected, setSelected, focused = true}: {layout: LayoutDefinition; selected: number; setSelected: (selected: number) => void; focused: boolean}) {
    useInput((_, key) => {
        if(!focused) return

        if((key.upArrow && layout.direction === 'v') || (key.leftArrow && layout.direction === 'h')){
            if(selected <= 0){
                return
            }
            
            setSelected(selected - 1)
        }else if(key.downArrow && layout.direction === 'v' || (key.rightArrow && layout.direction === 'h')){
            if((selected + 1) >= layout.elements){
                return
            }

            setSelected(selected + 1)
        }

        if(key.return) {
            layout.confirmEvent?.(selected)
        }
    })
}