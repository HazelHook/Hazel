import Link from "next/link";
import { getSources } from "db/src/orm/source";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { AddIcon } from "@/components/icons/pika/add";

import { columns } from "./columns";

const SourcePage = async () => {
  const { userId } = auth();

  const sources = await getSources({ customerId: userId, db: db });
  return (
    <main className="p-4">
      <div className="flex flex-row justify-between mb-4">
        <h3 className="text-xl font-semibold">Sources</h3>
        <Link href="/source/new" className={buttonVariants()}>
          <AddIcon className="mr-2" />
          New Source
        </Link>
      </div>
      <DataTable rootPath="/source" columns={columns} data={sources} />
    </main>
  );
};

export const runtime = "edge";

export default SourcePage;
