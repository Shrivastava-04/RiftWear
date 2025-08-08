import { cn } from "@/lib/utils";
import * as React from "react"; // Explicitly import React for JSX

// Removed TypeScript type annotation for props
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
