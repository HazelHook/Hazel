// eslint-disable-next-line import/no-unassigned-import
import "./devtools-window-polyfill.js"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import devtools from "react-devtools-core"

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
;(devtools as any).connectToDevTools()
