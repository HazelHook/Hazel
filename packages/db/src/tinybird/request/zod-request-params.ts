import { z } from "zod";

import { period } from "../zod-common";

export const getRequestParams = z.object({
  customer_id: z.string(),
  source_id: z.string().optional(),
  request_id: z.string().optional(),

  limit: z.number().optional(),
  offset: z.number().optional(),
});

export const getRequestsKpiParams = z.object({
  customer_id: z.string(),
  source_id: z.string().optional(),

  success: z.number().optional(),

  period: period.default("daily").optional(),
  start_date: z.date(),
  end_date: z.date().optional(),
});

export const getRequestsTimeseriesParams = z.object({
  customer_id: z.string(),
  source_id: z.string().optional(),

  period: period.default("daily").optional(),
  start_date: z.date(),
  end_date: z.date().optional(),
});
