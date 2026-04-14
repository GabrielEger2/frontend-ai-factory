import * as React from "react";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Style maps                                                         */
/* ------------------------------------------------------------------ */

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-field text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97]";

const variants = {
  primary: "bg-primary text-primary-content hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-content hover:bg-secondary/80",
  accent: "bg-accent text-accent-content hover:bg-accent/90",
  outline:
    "border border-base-300 bg-base-100 hover:bg-base-200 hover:text-base-content",
  ghost: "hover:bg-base-200 hover:text-base-content",
  link: "text-primary underline-offset-4 hover:underline active:scale-100",
  glow: "hover:shadow-lg hover:brightness-110",
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

/* ------------------------------------------------------------------ */
/*  SlideButton — rounded border button with sliding fill on hover     */
/* ------------------------------------------------------------------ */

export interface SlideButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Color scheme: uses primary, secondary, or accent tokens */
  colorScheme?: "primary" | "secondary" | "accent";
  className?: string;
}

const SlideButton = React.forwardRef<HTMLButtonElement, SlideButtonProps>(
  ({ className, colorScheme = "primary", children, ...props }, ref) => {
    const colorMap = {
      primary:
        "border-primary text-primary before:bg-primary hover:text-primary-content",
      secondary:
        "border-secondary text-secondary before:bg-secondary hover:text-secondary-content",
      accent:
        "border-accent text-accent before:bg-accent hover:text-accent-content",
    } as const;

    return (
      <button
        ref={ref}
        className={cn(
          "relative z-0 inline-flex items-center gap-2 overflow-hidden rounded-box border px-4 py-2 font-semibold uppercase transition-all duration-500",
          "before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:transition-transform before:duration-1000 before:content-['']",
          "hover:scale-105 hover:before:translate-x-[0%] hover:before:translate-y-[0%]",
          "active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100",
          "disabled:pointer-events-none disabled:opacity-50",
          colorMap[colorScheme],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
SlideButton.displayName = "SlideButton";

export { SlideButton };

/* ------------------------------------------------------------------ */
/*  DotExpandLink — pill link with expanding dot + arrow on hover      */
/* ------------------------------------------------------------------ */

export interface DotExpandLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Color scheme for the dot and hover state */
  colorScheme?: "primary" | "secondary" | "accent" | "neutral";
  className?: string;
}

const DotExpandLink = React.forwardRef<HTMLAnchorElement, DotExpandLinkProps>(
  ({ className, colorScheme = "neutral", children, ...props }, ref) => {
    const schemeMap = {
      primary: {
        pill: "bg-primary/10 hover:bg-primary hover:text-primary-content",
        dot: "bg-primary group-hover:bg-primary-content",
        arrow: "group-hover:text-primary",
      },
      secondary: {
        pill: "bg-secondary/10 hover:bg-secondary hover:text-secondary-content",
        dot: "bg-secondary group-hover:bg-secondary-content",
        arrow: "group-hover:text-secondary",
      },
      accent: {
        pill: "bg-accent/10 hover:bg-accent hover:text-accent-content",
        dot: "bg-accent group-hover:bg-accent-content",
        arrow: "group-hover:text-accent",
      },
      neutral: {
        pill: "bg-base-200 hover:bg-neutral hover:text-neutral-content",
        dot: "bg-neutral group-hover:bg-neutral-content",
        arrow: "group-hover:text-neutral",
      },
    } as const;

    const scheme = schemeMap[colorScheme];

    return (
      <a
        ref={ref}
        className={cn(
          "group inline-flex h-10 items-center gap-2 rounded-full pl-3 pr-4 text-sm font-medium text-base-content transition-all duration-300 ease-in-out hover:pl-2",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100",
          scheme.pill,
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "rounded-full p-1 text-sm transition-colors duration-300",
            scheme.dot,
          )}
        >
          {/* Arrow icon — slides in from left on hover */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "-translate-x-[200%] text-[0px] transition-all duration-300 group-hover:translate-x-0 group-hover:text-lg group-active:-rotate-45",
              scheme.arrow,
            )}
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
        <span>{children}</span>
      </a>
    );
  },
);
DotExpandLink.displayName = "DotExpandLink";

export { DotExpandLink };

/* ------------------------------------------------------------------ */
/*  DrawOutlineButton — animated border-draw on hover                  */
/* ------------------------------------------------------------------ */

export interface DrawOutlineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Color of the drawn outline and hover text */
  colorScheme?: "primary" | "secondary" | "accent";
  className?: string;
}

const DrawOutlineButton = React.forwardRef<
  HTMLButtonElement,
  DrawOutlineButtonProps
>(({ className, colorScheme = "primary", children, ...props }, ref) => {
  const colorMap = {
    primary: {
      text: "hover:text-primary",
      line: "bg-primary",
    },
    secondary: {
      text: "hover:text-secondary",
      line: "bg-secondary",
    },
    accent: {
      text: "hover:text-accent",
      line: "bg-accent",
    },
  } as const;

  const scheme = colorMap[colorScheme];

  return (
    <button
      ref={ref}
      className={cn(
        "group relative px-4 py-2 font-medium text-base-content transition-colors duration-400",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100",
        "disabled:pointer-events-none disabled:opacity-50",
        scheme.text,
        className,
      )}
      {...props}
    >
      <span>{children}</span>

      {/* TOP */}
      <span
        className={cn(
          "absolute left-0 top-0 h-[2px] w-0 transition-all duration-100 group-hover:w-full",
          scheme.line,
        )}
      />
      {/* RIGHT */}
      <span
        className={cn(
          "absolute right-0 top-0 h-0 w-[2px] transition-all delay-100 duration-100 group-hover:h-full",
          scheme.line,
        )}
      />
      {/* BOTTOM */}
      <span
        className={cn(
          "absolute bottom-0 right-0 h-[2px] w-0 transition-all delay-200 duration-100 group-hover:w-full",
          scheme.line,
        )}
      />
      {/* LEFT */}
      <span
        className={cn(
          "absolute bottom-0 left-0 h-0 w-[2px] transition-all delay-300 duration-100 group-hover:h-full",
          scheme.line,
        )}
      />
    </button>
  );
});
DrawOutlineButton.displayName = "DrawOutlineButton";

export { DrawOutlineButton };

/* ------------------------------------------------------------------ */
/*  CtaButton — unified CTA with variant prop                          */
/* ------------------------------------------------------------------ */

export type CtaVariant =
  | "default"
  | "slide"
  | "dotExpand"
  | "drawOutline"
  | "glow";
export type ColorScheme = "primary" | "secondary" | "accent" | "neutral";

export interface CtaButtonProps {
  /** Which animated style to render */
  variant?: CtaVariant;
  /** Theme color — maps to design-token color families */
  colorScheme?: ColorScheme;
  /** Destination URL — renders as `<a>` for dotExpand/default, navigates via onClick for button variants */
  href?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export function CtaButton({
  variant = "default",
  colorScheme = "primary",
  href,
  className,
  children,
  onClick,
}: CtaButtonProps) {
  /* SlideButton and DrawOutlineButton don't accept "neutral" */
  const buttonScheme = colorScheme === "neutral" ? "primary" : colorScheme;

  const navigate: React.MouseEventHandler<HTMLElement> = (e) => {
    onClick?.(e);
    if (href && !e.defaultPrevented) {
      window.location.href = href;
    }
  };

  switch (variant) {
    case "slide":
      return (
        <SlideButton
          colorScheme={buttonScheme}
          className={className}
          onClick={navigate}
        >
          {children}
        </SlideButton>
      );
    case "dotExpand":
      return (
        <DotExpandLink
          href={href}
          colorScheme={colorScheme}
          className={className}
          onClick={onClick}
        >
          {children}
        </DotExpandLink>
      );
    case "drawOutline":
      return (
        <DrawOutlineButton
          colorScheme={buttonScheme}
          className={className}
          onClick={navigate}
        >
          {children}
        </DrawOutlineButton>
      );
    case "glow": {
      const glowColors = {
        primary: "bg-primary text-primary-content hover:shadow-primary/40",
        secondary:
          "bg-secondary text-secondary-content hover:shadow-secondary/40",
        accent: "bg-accent text-accent-content hover:shadow-accent/40",
        neutral: "bg-neutral text-neutral-content hover:shadow-neutral/40",
      } as const;
      const glowClass = cn(glowColors[colorScheme], className);
      if (href) {
        return (
          <a
            href={href}
            className={buttonStyles({ variant: "glow", className: glowClass })}
            onClick={onClick}
          >
            {children}
          </a>
        );
      }
      return (
        <Button
          variant="glow"
          className={glowClass}
          onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        >
          {children}
        </Button>
      );
    }
    default:
      if (href) {
        return (
          <a
            href={href}
            className={buttonStyles({ className })}
            onClick={onClick}
          >
            {children}
          </a>
        );
      }
      return (
        <Button
          className={className}
          onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        >
          {children}
        </Button>
      );
  }
}
