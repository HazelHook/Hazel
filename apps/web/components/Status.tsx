import { match } from "ts-pattern";
import { cn } from "ui";

interface StatusProps {
  status: "error" | "success" | "pending";
  size?: number;
}

export const Status = ({ status, size = 5 }: StatusProps) => {
  return (
    <div
      className={cn(
        `h-${size} w-${size} rounded-sm`,
        match(status)
          .with("error", () => "bg-red-600")
          .with("success", () => "bg-green-500")
          .with("pending", () => "bg-yellow-500")
          .exhaustive()
      )}
    />
  );
};
