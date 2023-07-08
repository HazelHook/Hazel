"use server";

import { createConnection } from "db/src/orm/connection";

import { createAction, protectedProcedure } from "@/server/trpc";
import db from "@/lib/db";

import { formSchema } from "./schema";

/**
 * Either inline procedures using trpc's flexible
 * builder api, with input parsers and middleware
 * Wrap the procedure in a `createAction` call to
 * make it server-action friendly
 */
export const createConnectionAction = createAction(
  protectedProcedure.input(formSchema).mutation(async (opts) => {
    const source = await db.query.source.findFirst({
      where: (source, { eq }) => eq(source.publicId, opts.input.publicSourceId),
    });

    const destination = await db.query.destination.findFirst({
      where: (source, { eq }) =>
        eq(source.publicId, opts.input.publiceDestinationId),
    });

    if (!destination || !source) {
      throw new Error("Doesnt exist bruw");
    }

    const connection = await createConnection({
      data: {
        name: opts.input.name,
        sourceId: source.id,
        destinationId: destination.id,
        customerId: opts.ctx.auth.userId,
      },
      db,
    });

    return {
      id: connection.publicId,
    };
  })
);
