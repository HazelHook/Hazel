import { Handle as DefaultHandle, HandleProps } from "reactflow";

export const Handle = (props: HandleProps) => {
  return (
    <DefaultHandle
      {...props}
      className="w-1 h-2 !bg-card rounded-full border"
    />
  );
};
