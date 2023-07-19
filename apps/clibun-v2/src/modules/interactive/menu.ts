import { prettyTimestamp } from "../../core/lib/print-util.js";
import { Module, UserDataResponseEvent } from "../module.js";
import prompt from "prompt-sync"


export function handelUserDataReceived(event: UserDataResponseEvent, module: Module){
    console.log("Which utility would you like to use?")
    console.log("1. Observe a webhook")
    console.log("2. Forward a webhook to localhost")
    
    let response
    do{
        if(response){
            console.log("Invalid option.")
        }

        response = prompt({
            sigint: true,
            eot: true,
        })({
            ask: "Enter a number: ",
        })
    } while(!response || !["1", "2"].includes(response))

    if(response === "1"){
        console.log("Which webhook destination would you like to observe?")
    }else if(response === "2"){
        console.log("Which webhook destination would you like to forward to localhost?")
    }

    const destinations = event.data.destinations
    const destinationIndexes = destinations.map((_,i) => `${i + 1}`)

    destinations.forEach((destination, index) => {
        console.log(`${index + 1}. ${destination.name}`)
    })

    let destinationIndex
    do{
        if(destinationIndex){
            console.log("Invalid option.")
        }


        destinationIndex = prompt({
            sigint: true,
            eot: true,
        })({
            ask: "Enter a number: ",
        })
    } while(!destinationIndex || !destinationIndexes.includes(destinationIndex))

    const destinationId = destinations[parseInt(destinationIndex) - 1].id

    if(response === "1"){
        module.triggerRequestEvent({
            type: "websocket-connect",
            destinationId,
            onClose() {
                console.log("Observation ended, returning to menu.")
                console.log()
                module.triggerRequestEvent({
                    type: "user-data"
                })
            },
            onMessage(data) {
                console.log(`[${prettyTimestamp(data.timestamp)}] ${data.method}`)
                console.log(' Headers:')

                const longestHeader = Object.keys(data.headers).reduce((a, b) => a.length > b.length ? a : b)
                Object.keys(data.headers).forEach((header) => {
                    console.log(`  ${header.padEnd(longestHeader.length)} : ${data.headers[header]}`)
                })

                console.log(' Body:')
                console.log(data.data.split("\n").map((line) => `  ${line}`).join("\n"))

                console.log()
            },
            onOpen() {
                console.log(" Observing...")
            },

        })
    }
}