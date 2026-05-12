import React from "react";
import { cn } from "../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-2xl border-2 border-warm-border bg-warm-surface px-6 py-4 text-base font-medium transition-all",
          "placeholder:text-brown-300 placeholder:font-normal",
          "focus:border-olive-500 focus:outline-none focus:ring-4 focus:ring-olive-500/10",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-warm-bg",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
