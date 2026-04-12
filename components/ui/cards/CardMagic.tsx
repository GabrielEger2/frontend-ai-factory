"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CardMagicBaseProps {
  children?: React.ReactNode;
  className?: string;
  /** Radius of the cursor-following gradient in px. Defaults to 200 */
  gradientSize?: number;
  /** Border gradient start color. Defaults to primary token */
  gradientFrom?: string;
  /** Border gradient end color. Defaults to secondary token */
  gradientTo?: string;
}

interface CardMagicGradientProps extends CardMagicBaseProps {
  mode?: "gradient";
  /** Spotlight fill color. Defaults to base-300 equivalent */
  gradientColor?: string;
  /** Spotlight opacity. Defaults to 0.8 */
  gradientOpacity?: number;
  glowFrom?: never;
  glowTo?: never;
  glowAngle?: never;
  glowSize?: never;
  glowBlur?: never;
  glowOpacity?: never;
}

interface CardMagicOrbProps extends CardMagicBaseProps {
  mode: "orb";
  glowFrom?: string;
  glowTo?: string;
  glowAngle?: number;
  glowSize?: number;
  glowBlur?: number;
  glowOpacity?: number;
  gradientColor?: never;
  gradientOpacity?: never;
}

export type CardMagicProps = CardMagicGradientProps | CardMagicOrbProps;

type ResetReason = "enter" | "leave" | "global" | "init";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function isOrbMode(props: CardMagicProps): props is CardMagicOrbProps {
  return props.mode === "orb";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CardMagic — a wrapper card that adds a cursor-following gradient
 * border effect. Supports two modes:
 *
 * - **gradient** (default): spotlight that follows the pointer inside
 *   the card, with a radial gradient border.
 * - **orb**: a soft glowing orb that follows the pointer with spring
 *   physics.
 *
 * Wrap any content (including `<CardBase />`) to apply the effect.
 */
export function CardMagic(props: CardMagicProps) {
  const {
    children,
    className,
    gradientSize = 200,
    gradientFrom = "#9E7AFF",
    gradientTo = "#FE8BBB",
    mode = "gradient",
  } = props;

  const gradientColor = !isOrbMode(props)
    ? (props.gradientColor ?? "#262626")
    : "#262626";
  const gradientOpacity = !isOrbMode(props)
    ? (props.gradientOpacity ?? 0.8)
    : 0.8;

  const glowFrom = isOrbMode(props) ? (props.glowFrom ?? "#ee4f27") : "#ee4f27";
  const glowTo = isOrbMode(props) ? (props.glowTo ?? "#6b21ef") : "#6b21ef";
  const glowAngle = isOrbMode(props) ? (props.glowAngle ?? 90) : 90;
  const glowSize = isOrbMode(props) ? (props.glowSize ?? 420) : 420;
  const glowBlur = isOrbMode(props) ? (props.glowBlur ?? 60) : 60;
  const glowOpacity = isOrbMode(props) ? (props.glowOpacity ?? 0.9) : 0.9;

  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkTheme(prefersDark.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkTheme(e.matches);
    prefersDark.addEventListener("change", handler);
    return () => prefersDark.removeEventListener("change", handler);
  }, []);

  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);

  const orbX = useSpring(mouseX, { stiffness: 250, damping: 30, mass: 0.6 });
  const orbY = useSpring(mouseY, { stiffness: 250, damping: 30, mass: 0.6 });
  const orbVisible = useSpring(0, { stiffness: 300, damping: 35 });

  const modeRef = useRef(mode);
  const glowOpacityRef = useRef(glowOpacity);
  const gradientSizeRef = useRef(gradientSize);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    glowOpacityRef.current = glowOpacity;
  }, [glowOpacity]);
  useEffect(() => {
    gradientSizeRef.current = gradientSize;
  }, [gradientSize]);

  const reset = useCallback(
    (reason: ResetReason = "leave") => {
      if (modeRef.current === "orb") {
        orbVisible.set(reason === "enter" ? glowOpacityRef.current : 0);
        return;
      }
      const off = -gradientSizeRef.current;
      mouseX.set(off);
      mouseY.set(off);
    },
    [mouseX, mouseY, orbVisible],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY],
  );

  useEffect(() => {
    reset("init");
  }, [reset]);

  useEffect(() => {
    const handleGlobalPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) reset("global");
    };
    const handleBlur = () => reset("global");
    const handleVisibility = () => {
      if (document.visibilityState !== "visible") reset("global");
    };

    window.addEventListener("pointerout", handleGlobalPointerOut);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("pointerout", handleGlobalPointerOut);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [reset]);

  return (
    <motion.div
      className={cn(
        "group relative isolate overflow-hidden rounded-box border border-transparent",
        className,
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => reset("leave")}
      onPointerEnter={() => reset("enter")}
      style={{
        background: useMotionTemplate`
          linear-gradient(var(--color-base-200) 0 0) padding-box,
          radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
            ${gradientFrom},
            ${gradientTo},
            oklch(var(--color-base-300)) 100%
          ) border-box
        `,
      }}
    >
      {/* Opaque inner background */}
      <div className="absolute inset-px z-20 rounded-[inherit] bg-base-200" />

      {/* Gradient spotlight (gradient mode) */}
      {mode === "gradient" && (
        <motion.div
          suppressHydrationWarning
          className="pointer-events-none absolute inset-px z-30 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
                ${gradientColor},
                transparent 100%
              )
            `,
            opacity: gradientOpacity,
          }}
        />
      )}

      {/* Glowing orb (orb mode) */}
      {mode === "orb" && (
        <motion.div
          suppressHydrationWarning
          aria-hidden="true"
          className="pointer-events-none absolute z-30"
          style={{
            width: glowSize,
            height: glowSize,
            x: orbX,
            y: orbY,
            translateX: "-50%",
            translateY: "-50%",
            borderRadius: 9999,
            filter: `blur(${glowBlur}px)`,
            opacity: orbVisible,
            background: `linear-gradient(${glowAngle}deg, ${glowFrom}, ${glowTo})`,
            mixBlendMode: isDarkTheme ? "screen" : "multiply",
            willChange: "transform, opacity",
          }}
        />
      )}

      {/* Children (content) */}
      <div className="relative z-40">{children}</div>
    </motion.div>
  );
}
