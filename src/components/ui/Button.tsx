import React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-6 py-5 text-sm uppercase tracking-[0.25em] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-brown-900 text-warm-bg hover:bg-olive-600 active:bg-olive-700": variant === "solid",
            "border border-warm-border bg-transparent text-brown-900 hover:bg-warm-bg active:bg-brown-100": variant === "outline",
            "bg-transparent text-brown-900 hover:bg-warm-bg active:bg-brown-100": variant === "ghost",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
