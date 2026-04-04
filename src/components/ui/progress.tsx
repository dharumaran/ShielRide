"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number;
    indicatorClassName?: string;
  }
>(({ className, value = 0, indicatorClassName, ...props }, ref) => {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-slate-100",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full bg-blue-600 transition-all duration-500",
          indicatorClassName
        )}
        style={{ width: `${v}%` }}
      />
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };
