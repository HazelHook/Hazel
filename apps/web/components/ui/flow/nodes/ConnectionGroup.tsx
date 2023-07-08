import React, { memo } from "react";
import { NodeProps } from "reactflow";

import { Icons } from "@/components/icons";

interface DefaultNode extends NodeProps {
  data: {
    label: string;
  };
}

export const ConnectionGroupNode = memo(({ data }: DefaultNode) => {
  return (
    <div className="border bg-card/40 w-full h-full rounded-md min-h-[50px] min-w-[150px]">
      <div className="flex flex-row items-center gap-2 p-2 bg-cyan-500 border w-max rounded-br-sm">
        <Icons.connection />
        <h3 className="font-semibold">{data.label}</h3>
      </div>
    </div>
  );
});
