import { Module, UserDataResponseEvent } from "../module.js";
import blessed from "blessed"
import { StyledButton } from "./components/button.js";
import { getObserveMenu } from "./observe/observe.js";


export function getMenu(event: UserDataResponseEvent, module: Module, rerender: (element: blessed.Widgets.BoxElement) => void){
    const box = blessed.box({
        top: "center",
        left: 0,
        padding: {
            left: 1,
            right: 1,
        },
        tags: true,
        style: {
            fg: "white",
        },
        align: "center",
        width: 'shrink'
    })
    const title = blessed.text({
        content: "Select the tool you want to use.",
        tags: true,
        style: {
            fg: "white",
        },
    })
    box.append(title)

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

    })

    // const form = blessed.form({
    //     top: 1,
    //     left: 23,
    // })
    // form.append(blessed.text({
    //     top: 1,
    //     left: 1,
    //     content: "Webhook URL:",
    //     tags: true,
    //     style: {
    //         fg: "white",
    //     },
    // }))
    // const url = blessed.textbox({
    //     top: 1,
    //     left: 1,
    //     width: 50,
    //     height: 3,
    //     inputOnFocus: true,
    //     style: {
    //         fg: "white",
    //         bg: "gray",
    //     },
    // })
    // form.append(url)

    // form.append(blessed.text({
    //     top: 5,
    //     left: 1,
    //     content: "Select Destination:",
    //     tags: true,
    //     style: {
    //         fg: "white",
    //     },
    // }))
    // for(const destination of event.data.destinations){
    //     const radio = blessed.radiobutton({
    //         top: 5,
    //         left: 1,
    //         content: destination.name,
    //         width: 20,
    //         height: 3,
    //         clickable: true,
    //     })
    //     form.append(radio)
    // }

    // const submit = StyledButton({
    //     top: 5,
    //     left: 1,
    //     content: "Submit",
    //     width: 20,
    //     height: 3,
    //     clickable: true,
    // })
    // submit.on("click", () => {
    //     module.triggerRequestEvent({
    //         type: "websocket-connect",
    //     } as any)
    // })
    // form.append(submit)
        

    box.append(observe)
    box.append(forward)
    // box.append(form)

    rerender(box)
}