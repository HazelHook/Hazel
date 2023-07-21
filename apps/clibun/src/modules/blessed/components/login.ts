import blessed from "blessed"
import { StyledButton } from "./button.js"

export function login(login: () => void) {
    const box = blessed.box({
        top: "center",
        left: "center",
        padding: {
            left: 1,
            right: 1,
        },
        content: "Welcome to the Hazel CLI!",
        tags: true,
        style: {
            fg: "white",
        },
    })

    const helpText = blessed.text({
        top: 3,
        left: 1,
        content: "",
        tags: true,
        style: {
            fg: "gray",
        },
        hidden: true,
    })


    const loginButton = StyledButton({
        top: 1,
        left: 1,
        content: "Login",
        width: 10,
        height: 3,
        clickable: true,
    })
    loginButton.on("click", () => {
        login()
        helpText.setContent("Please login in your browser...")
        helpText.show()
    })

    const exitButton = StyledButton({
        top: 1,
        left: 12,
        content: "Exit",
        width: 10,
        height: 3,
        clickable: true,
    })
    exitButton.on("click", () => {
        process.exit(0)
    })

    box.append(loginButton)
    box.append(exitButton)
    box.append(helpText)

    return box
}