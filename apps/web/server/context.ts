import { getAuth } from "@clerk/nextjs/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export function createContext(opts?: FetchCreateContextFnOptions) {
  return {
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    auth: getAuth(opts?.req! as any),
    headers: opts && Object.fromEntries(opts.req.headers),
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
