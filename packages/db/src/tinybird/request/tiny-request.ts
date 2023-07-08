import { Tinybird } from "@chronark/zod-bird";

import { requestEvent, requestEventTimeSeries } from "./zod-request-data";
import {
  getRequestParams,
  getRequestsKpiParams,
  getRequestsTimeseriesParams,
} from "./zod-request-params";

export const buildTinyBirdRequests = (tb: Tinybird) => {
  const publish = tb.buildIngestEndpoint({
    datasource: "event_requests",
    event: requestEvent,
  });

  const get = tb.buildPipe({
    pipe: "requests",
    data: requestEvent,
    parameters: getRequestParams,
  });

  const getKpis = tb.buildPipe({
    pipe: "kpi_requests",
    data: requestEventTimeSeries,
    parameters: getRequestsKpiParams,
  });

  const getTimeseries = tb.buildPipe({
    pipe: "timeline_requests",
    data: requestEventTimeSeries,
    parameters: getRequestsTimeseriesParams,
  });

  return {
    publish,
    get,
    getKpis,
    getTimeseries,
  };
};
