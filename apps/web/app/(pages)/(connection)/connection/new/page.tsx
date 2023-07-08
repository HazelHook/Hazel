import { getDestinations } from "db/src/orm/destination";
import { getSources } from "db/src/orm/source";

import { auth } from "@/lib/auth";
import db from "@/lib/db";

import { createConnectionAction } from "./_actions";
import { NewConnectionForm } from "./form";

const NewConnectionPage = async () => {
  const { userId } = auth();

  const sources = await getSources({ customerId: userId, db });
  const destinations = await getDestinations({ customerId: userId, db });
  return (
    <main className="p-4">
      <NewConnectionForm
        action={createConnectionAction}
        destinations={destinations}
        sources={sources}
      />
    </main>
  );
};

export const runtime = "edge";

export default NewConnectionPage;
