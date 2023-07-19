import React from "react";
import { render } from "ink";
import { RequestClient } from "../../core/lib/request-client.js";
import { CLIRequestEvent, CLIResponseEvent, Module, ModuleData } from "../module.js";
import { handelUserDataReceived } from "./menu.js";
import { Window } from "./components/Window.js";
import { TextList } from "./components/TextList.js";

global.hazelModuleInitialized = false

export class InteractiveModule extends Module {
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
        if(event.type === "user-data"){
            handelUserDataReceived(event, this)
        }
    }

    override start(token?: string) {
        if(token){
            render(<Window title=" Hazel CLI Login " focused>
                <TextList items={["Login", "Exit"]} onSelect={(index) => {
                    if(index === 0){
                        this.triggerEvent({
                            type: "login"
                        })
                    }else {
                        process.exit(0)
                    }
                }} vertical />
            </Window>, {
                patchConsole: true  
            })
        }else {
            this.client.setToken(token)
            this.triggerEvent({
                type: "user-data"
            })
        }
    }

    override triggerRequestEvent(event: CLIRequestEvent): void {
        this.triggerEvent(event)
    }

    static create(): InteractiveModule {
        if(global.hazelModuleInitialized){
            throw new Error("Module already initialized.")
        }

        return new InteractiveModule();
    }
}