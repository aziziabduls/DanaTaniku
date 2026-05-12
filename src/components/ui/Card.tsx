import React from "react";
import { cn } from "../../lib/utils";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[32px] border border-warm-border bg-warm-surface p-6 md:p-8",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";
