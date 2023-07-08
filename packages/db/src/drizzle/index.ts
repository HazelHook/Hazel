import { connect } from "@planetscale/database";
import {
  drizzle,
  PlanetScaleDatabase,
} from "drizzle-orm/planetscale-serverless";

import { DrizzleTable } from "./orm/db-table";
import * as schema from "./schema";

export type DB = PlanetScaleDatabase<typeof schema>;

export function connectDB({
  username,
  host,
  password,
}: {
  host: string;
  username: string;
  password: string;
}) {
  const client = connect({
    username,
    host,
    password,
  });

  const db = drizzle(client, { schema });

  return {
    db,
    source: new DrizzleTable("source", schema.source, db),
    destination: new DrizzleTable("destination", schema.destination, db),
    connection: new DrizzleTable("connection", schema.connection, db),
  };
}

// export function connectWDB({
// 	username,
// 	host,
// 	password,
// 	fetch,
// }: {
// 	host: string
// 	username: string
// 	password: string
// 	fetch: any
// }) {
// 	const client = connect({
// 		username,
// 		host,
// 		password,
// 		fetch: (url, init) => {
// 			// @ts-expect-error
// 			init["cache"] = undefined
// 			return fetch(url, init)
// 		},
// 	})
// 	const db = drizzle(client, { schema })

// 	return db
// }
