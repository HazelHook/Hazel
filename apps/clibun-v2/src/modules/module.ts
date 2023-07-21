import { RequestClient } from "../core/lib/request-client.js";


export type Message = {
	requestId: string
	sourceId: string
    responseId: string
    query: Record<string, string>
	data: any
	headers: Record<string, string>
	received_at: Date
    response_at: Date
    request_at: Date
	method: "GET" | "POST"
}

export type WebsocketRequestEvent = {
    type: 'websocket-connect';
    destinationId: string;
    onMessage: (data: Message) => void;
    onOpen: () => void;
    onClose: () => void;
}
export type UserData = {
    sources: {
        name: string;
        id: string;
    }[]
    connections: {
        id: string;
        name: string;
        source: string;
        destination: string;
    }[]
    destinations: {
        name: string;
        id: string;
        url: string
    }[]        
}

export type LoginRequestEvent = {
    type: 'login';
}
export type UserDataRequestEvent = {
    type: 'user-data';
}
export type CLIRequestEvent = WebsocketRequestEvent | LoginRequestEvent | UserDataRequestEvent;

export type LoginResponseEvent = {
    type: 'login';
}
export type UserDataResponseEvent = {
    type: 'user-data';
    data: UserData;
}

export type CLIResponseEvent = LoginResponseEvent | UserDataResponseEvent;

export type ModuleData = {
    client: RequestClient
    port: string
}


export abstract class Module {
    abstract init(data: ModuleData): Promise<void>;
    abstract setRequestEventCallback(callback: (data: CLIRequestEvent) => void): void;
    abstract triggerRequestEvent(event: CLIRequestEvent): void;
    abstract onResponseEvent(event: CLIResponseEvent): void;
    abstract start(token: string): void;
}
