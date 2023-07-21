import { Module, UserDataResponseEvent } from "../module.js";
import blessed from "blessed"
import { StyledButton } from "./components/button.js";
import { getObserveMenu } from "./observe/observe.js";
import { getForwardMenu } from "./forward/forward.js";
import { Text } from "./components/text.js";


export function getMenu(event: UserDataResponseEvent, module: Module, rerender: (element: blessed.Widgets.BoxElement) => void){
    const box = blessed.box({
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
    })

    const titleBox = blessed.box({
        width: 40,
        height: 6,
        left: "center",
        top: "center",
    })
    box.append(titleBox)

    const titleText = "Select an action."
    const title = blessed.text({
        content: titleText,
        style: {
            fg: "white",
        },
        left: 'center'
    })
    titleBox.append(title)

    const observe = StyledButton({
        top: 2,
        left: 0,
        content: "Observe webhook",
        width: 20,
        height: 3,
        clickable: true,
        hoverText: "Observe webhook traffic, useful for debugging purposes."
    })
    observe.on("click", () => {
        getObserveMenu(event.data, module, rerender)
    })

    const forward = StyledButton({
        top: 2,
        left: 20,
        content: "Forward webhook",
        width: 20,
        height: 3,
        clickable: true,
        hoverText: "Forward webhook to localhost, similar to tools like ngrok."
    })
    forward.on("click", () => {
        getForwardMenu(event.data, module, rerender)
    })

    titleBox.append(observe)
    titleBox.append(forward)
    rerender(box)
}