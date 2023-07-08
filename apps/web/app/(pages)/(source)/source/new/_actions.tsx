"use server";

import { createSource } from "db/src/orm/source";

import { createAction, protectedProcedure } from "@/server/trpc";
import db from "@/lib/db";

import { formSchema } from "./schema";

/**
 * Either inline procedures using trpc's flexible
 * builder api, with input parsers and middleware
 * Wrap the procedure in a `createAction` call to
 * make it server-action friendly
 */
export const createSourceAction = createAction(
  protectedProcedure.input(formSchema).mutation(async (opts) => {
    const source = await createSource({
      data: { ...opts.input, customerId: opts.ctx.auth.userId },
      db,
    });

    return {
      id: source.publicId,
    };
  })
);
