import { createSourceAction } from "./_actions";
import { NewSourceForm } from "./form";

const NewSourcePage = () => {
  return (
    <main className="p-4">
      <NewSourceForm action={createSourceAction} />
    </main>
  );
};

export const runtime = "edge";

export default NewSourcePage;
