import React from "react";
import { cn } from "../../lib/utils";

import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "solid" | "outline" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={props.disabled ? undefined : { scale: 1.02 }}
        whileTap={props.disabled ? undefined : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-8 py-4 text-sm tracking-widest font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50 disabled:grayscale",
          {
            "bg-terracotta-600 text-white hover:bg-terracotta-700 shadow-md shadow-terracotta-900/10": variant === "solid",
            "border border-warm-border bg-warm-surface text-brown-900 hover:border-terracotta-500 hover:text-terracotta-600": variant === "outline",
            "bg-transparent text-brown-500 hover:bg-olive-50 hover:text-brown-900": variant === "ghost",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
