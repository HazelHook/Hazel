import { RequestClient } from "../../core/lib/request-client.js";
import { CLIRequestEvent, CLIResponseEvent, Module, ModuleData } from "../module.js";
import { handelUserDataReceived } from "./menu.js";

global.hazelModuleInitialized = false

export class BasicModule extends Module {
    private triggerEvent: (event: CLIRequestEvent) => void;
    private client: RequestClient;

    private constructor() {
        super()
        global.hazelModuleInitialized = true
    }
    
    override async init(data: ModuleData) {
        this.client = data.client
    }

    override setRequestEventCallback(callback: (data: CLIRequestEvent) => void) {
        this.triggerEvent = callback;
    }

    override onResponseEvent(event: CLIResponseEvent): void {
        if(event.type === "login"){
            console.log("Logged in!")
        } else if(event.type === "user-data"){
            handelUserDataReceived(event, this)
        }
    }

    override start(token?: string) {
        if(!token){
            console.log("To use the Hazel CLI, please login.")
            console.log("Confirm with Y/n")
            const stdin = process.openStdin()
            stdin.addListener("data", async (data) => {
                const input = data.toString().trim()
                if(input.toUpperCase() === "Y"){
                    this.triggerEvent({
                        type: "login"
                    })
                }else {
                    console.log("Exiting.")
                    process.exit(0)
                }
            })
        }else {
            this.client.setToken(token)
            console.log("Logged in!")
            this.triggerEvent({
                type: "user-data"
            })
        }
    }

    override triggerRequestEvent(event: CLIRequestEvent): void {
        this.triggerEvent(event)
    }

    static create(): BasicModule {
        if(global.hazelModuleInitialized){
            throw new Error("Module already initialized.")
        }

        return new BasicModule();
    }
}