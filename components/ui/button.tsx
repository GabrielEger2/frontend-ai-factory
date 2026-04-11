import * as React from "react";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Style maps                                                         */
/* ------------------------------------------------------------------ */

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-field text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const variants = {
  primary: "bg-primary text-primary-content hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-content hover:bg-secondary/80",
  accent: "bg-accent text-accent-content hover:bg-accent/90",
  outline:
    "border border-base-300 bg-base-100 hover:bg-base-200 hover:text-base-content",
  ghost: "hover:bg-base-200 hover:text-base-content",
  link: "text-primary underline-offset-4 hover:underline",
} as const;

const sizes = {
  sm: "h-9 rounded-field px-3",
  md: "h-10 px-4 py-2",
  lg: "h-11 rounded-field px-8",
  icon: "h-10 w-10",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

/* ------------------------------------------------------------------ */
/*  buttonStyles — use on non-button elements (e.g. <a>)              */
/* ------------------------------------------------------------------ */

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

/* ------------------------------------------------------------------ */
/*  Button component                                                   */
/* ------------------------------------------------------------------ */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      className={buttonStyles({ variant, size, className })}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button };
