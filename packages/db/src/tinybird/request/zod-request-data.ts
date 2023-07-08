import { z } from "zod";

import {
  body,
  hazelVersion,
  headers,
  successState,
  timestamp,
} from "../zod-common";

export const requestEventTimeSeries = z
  .object({
    customer_id: z.string(),
    source_id: z.string(),

    date: z.date(),
    events: z.number(),
  })
  .describe("Contains the number of events for a given source and date.");
export type RequestEventTimeSeries = z.infer<typeof requestEventTimeSeries>;

export const requestEvent = z.object({
  // IDs
  id: z.string(),
  customer_id: z.string(),
  source_id: z.string(),
  request_id: z.string(),

  // Metadata
  version: hazelVersion,

  // Timestamps
  timestamp,

  // Status
  validated: successState,
  rejected: successState,

  // Data
  body,
  headers,
});
export type RequestEvent = z.infer<typeof requestEvent>;