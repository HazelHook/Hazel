import React, { useState } from 'react'
import { Box, Text, useInput } from "ink";
import WebSocket from "ws";
import { Divider } from './divider.js';

type Message = {
    requestId: string
    source: string
    data: any
    headers: Record<string, string>
    timestamp: Date
    method: "GET" | "POST"
}

const messages: Message[] = []
export function handleWebhookMessage(data: WebSocket.RawData) {
    const deserialized = JSON.parse(data.toString())

    const msg: Message = {
        requestId: deserialized.requestId,
        method: deserialized.method,
        source: deserialized.source,
        data: JSON.parse(deserialized.data), // This should be extended with cleartext, xml etc.
        timestamp: new Date(deserialized.timestamp),
        headers: deserialized.headers,
    }

    messages.push(msg)
}

function DateTime({date, minTime, maxTime}: {date: Date, minTime: Date, maxTime: Date}){
    const fullDelta = maxTime.getTime() - minTime.getTime()
    function n(num: number, len = 2){
        let text = num.toString()

        while(text.length < len){
            text = `0${text}`
        }

        return text
    }

        const minColor = [167, 101, 36]
        const maxColor = [230, 241, 0]
        const delta    = [maxColor[0] - minColor[0], maxColor[1] - minColor[1], maxColor[2] - minColor[2]]

        const multiplier = (date.getTime() - minTime.getTime()) / fullDelta
        
        const colorArr = [
            (minColor[0] + delta[0] * multiplier).toFixed(),
            (minColor[1] + delta[1] * multiplier).toFixed(),
            (minColor[2] + delta[2] * multiplier).toFixed(),
        ]

        const color = 
            `rgb(${colorArr[0]},${colorArr[2]},${colorArr[2]})`

    return <Text color={color}>
        [{n(date.getHours())}:{n(date.getMinutes())}:{n(date.getSeconds())}]
    </Text>
}

function Headers({headers}: {headers: Record<string, string>}) {
    const entries = Object.entries(headers)
    const maxName = entries.reduce((p, c) => {
        return p > c[0].length ? p : c[0].length 
    }, 0)

    return (
        <Box flexDirection='column'>
            {
                entries.map(e => {
                    const repeat = maxName - e[0].length
                    return <Text>
                        {` ${capitalizeHeader(e[0])}`}{' '.repeat(repeat)}{` │ ${e[1] }`}
                    </Text>
                })
            }
        </Box>
    )
}

function Webhook({messages}: {messages: Message[]}){
    const [selected, setSelected] = useState(0)

    useInput((_, key) => {
        if(key.upArrow) {
            const newS = selected - 1
            setSelected(newS < 0 ? 0 : newS)
        }else if(key.downArrow){
            const newS = selected + 1
            setSelected(newS > messages.length ? messages.length : newS)
        }
    })

    const minTime = messages.at(0)?.timestamp
    const maxTime = messages.at(messages.length - 1)?.timestamp

    // const leftContent = 
   
    return <Box flexDirection='row'>
        <Box flexDirection='column' borderStyle='single'>
            {/* <Divider title="Requests" /> */}
            {messages.map((msg, i) => {
                return <Box height={1} key={i}>
                    <DateTime date={msg.timestamp} maxTime={maxTime} minTime={minTime}/>
                    <Text>
                        {` ${msg.source} `}
                    </Text>
                </Box>
            })}
        </Box>
        <Box flexDirection='column' borderStyle='single'>
            <Box>
                <Text>
                    {messages[selected].method === 'POST' ? ' POST   ' : ' GET    '}
                </Text>
                <Text>
                    Latency: 431ms
                </Text>
            </Box>
            <Divider title="Headers" />
            <Headers headers={messages[selected].headers}/>
        </Box>
    </Box>
}



function capitalizeHeader(name: string){
    if(name.startsWith("x-")){
        return name.toUpperCase()
    }

    const split = name.split("-")

    return split.map(s => s[0].toUpperCase() + s.substring(1)).join("-")
}

export function DummyWebhook(){
    const uniques: Message[] = [
        {
            timestamp: new Date(1689607812776),
            requestId: 'req_QhHhMpmTC4rWVoaFolMhQ',
            source: "Kombo",
            method: "POST",
            headers: {"accept":"*/*","accept-encoding":"gzip, deflate, br","connection":"keep-alive","content-length":"21","content-type":"application/json","host":"127.0.0.1:3003","user-agent":"PostmanRuntime/7.32.2"},
            data: {
                "id": "5gjAtURLPbnTiwgkaBfiA3WJ",
                "type": "sync-finished",
                "data": {
                  "sync_id": "EY2KfFEZ5Vc2FVfVUQFpRduM",
                  "sync_state": "SUCCEEDED",
                  "sync_started_at": "2022-11-02T10:50:10.242Z",
                  "sync_ended_at": "2022-11-02T10:50:14.751Z",
                  "sync_duration_seconds": 14.509,
                  "integration_id": "personio:hris-dev",
                  "integration_tool": "personio",
                  "integration_category": "HRIS"
                }
              }              
        },
        {
            timestamp: new Date(1689607812776),
            requestId: 'req_QhHhMpmTCsdklk2olMhQ',
            source: "Stripe",
            method: "GET",
            headers: {"accept":"*/*","accept-encoding":"gzip, deflate, br","connection":"keep-alive","content-length":"21","content-type":"application/json","host":"127.0.0.1:3003","user-agent":"PostmanRuntime/7.32.2"},
            data: {
                "id": "5gjAtURfdfdTiwgkaBfiA3WJ",
                "type": "customer-acquired",
                "data": {
                  "customer_id": "usr_sdkl32d0pe2ss",
                  "level": "premium",
                  "plan": "yearly",
                  "state": "confirmed"
                }
              }
        },
    ]

    let result: Message[] = []

    for(let i = 0; i < 25; i++){
        const current = {
            ...uniques[i%uniques.length]
        }
        current.timestamp = new Date(current.timestamp.getTime() + (1000 * 3600 * 1.0) * Math.random())
        result.push(current)
    }

    result = result.sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime())

    return <Webhook messages={result}/>
}