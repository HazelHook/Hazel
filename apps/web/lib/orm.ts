import { cache } from "react"

import { getConnection } from "db/src/orm/connection"

export const getCachedConnection = cache(getConnection)
