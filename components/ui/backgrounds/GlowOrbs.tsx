"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Palettes                                                           */
/* ------------------------------------------------------------------ */

/**
 * Curated palette presets. The `theme` palette pulls from the OKLCH token
 * system so it adapts to the active brand palette. The other palettes are
 * fixed aesthetic moods that can be picked when the section visual calls
 * for it (e.g., dark/cinematic heroes).
 */
export const GLOW_ORBS_PALETTES = {
  theme: {
    bg: "oklch(var(--color-base-300))",
    bg2: "oklch(var(--color-base-200))",
    orbs: [
      "oklch(var(--color-primary))",
      "oklch(var(--color-secondary))",
      "oklch(var(--color-accent))",
      "oklch(var(--color-primary))",
      "oklch(var(--color-secondary))",
    ],
  },
  aurora: {
    bg: "#0a0e2a",
    bg2: "#1a1240",
    orbs: ["#ff3ea5", "#7c3aed", "#22d3ee", "#ec4899", "#3b82f6"],
  },
  ember: {
    bg: "#1a0a0e",
    bg2: "#2a1418",
    orbs: ["#f97316", "#ef4444", "#fbbf24", "#dc2626", "#a855f7"],
  },
  forest: {
    bg: "#06121a",
    bg2: "#0a2a24",
    orbs: ["#10b981", "#06b6d4", "#84cc16", "#14b8a6", "#3b82f6"],
  },
  candy: {
    bg: "#1a0a2a",
    bg2: "#2a0a3a",
    orbs: ["#f472b6", "#a78bfa", "#60a5fa", "#fb7185", "#c084fc"],
  },
  mono: {
    bg: "#0a0a0a",
    bg2: "#1a1a1a",
    orbs: ["#ffffff", "#a0a0a0", "#606060", "#d0d0d0", "#404040"],
  },
} as const;

export type GlowOrbsPalette = keyof typeof GLOW_ORBS_PALETTES;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface GlowOrbsProps {
  /** Palette preset. @default "theme" */
  palette?: GlowOrbsPalette;
  /** Number of glowing orbs (clamped to 2–10). @default 5 */
  orbCount?: number;
  /** Blur radius in pixels applied to each orb. @default 110 */
  blur?: number;
  /** Animation speed multiplier. 0 disables drift. @default 1 */
  speed?: number;
  /** Track the mouse for a subtle parallax effect. @default true */
  interactive?: boolean;
  /** Render a subtle starfield over the gradient base. @default false */
  showStars?: boolean;
  /** Render an overlay vignette to focus content. @default true */
  vignette?: boolean;
  /** Additional CSS classes for the container. */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function GlowOrbs({
  palette = "theme",
  orbCount = 5,
  blur = 110,
  speed = 1,
  interactive = true,
  showStars = false,
  vignette = true,
  className,
}: GlowOrbsProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const resolved = GLOW_ORBS_PALETTES[palette] ?? GLOW_ORBS_PALETTES.theme;
  const count = Math.max(2, Math.min(10, Math.round(orbCount)));

  // Mouse position normalized to [-0.5, 0.5] around the container center.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20, mass: 0.5 });

  useEffect(() => {
    if (!interactive || shouldReduceMotion) {
      mouseX.set(0);
      mouseY.set(0);
      return;
    }

    const handleMove = (event: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(nx);
      mouseY.set(ny);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [interactive, shouldReduceMotion, mouseX, mouseY]);

  // Pre-compute deterministic orb seeds so positions are stable per render.
  const orbs = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const seed = i * 37.13;
      const sin = Math.sin(seed) * 0.5 + 0.5;
      const cos = Math.cos(seed * 1.7) * 0.5 + 0.5;
      const sin2 = Math.sin(seed * 2.3) * 0.5 + 0.5;
      const sin3 = Math.sin(seed * 3.1) * 0.5 + 0.5;
      const sin4 = Math.sin(seed * 0.7) * 0.5 + 0.5;
      return {
        id: i,
        color: resolved.orbs[i % resolved.orbs.length],
        x: 8 + sin * 80,
        y: 8 + cos * 80,
        size: 32 + sin2 * 38,
        amp: 6 + sin3 * 14,
        phase: seed,
        parallax: 0.4 + (i / count) * 0.9,
        opacity: 0.55 + sin4 * 0.4,
      };
    });
  }, [count, resolved]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className,
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 70% 50%, ${resolved.bg2} 0%, ${resolved.bg} 60%, #000 110%)`,
        }}
      />

      {showStars && <Stars />}

      <div className="absolute inset-0">
        {orbs.map((orb) => (
          <Orb
            key={`${palette}-${orb.id}`}
            orb={orb}
            blur={blur}
            speed={speed}
            interactive={interactive && !shouldReduceMotion}
            shouldReduceMotion={!!shouldReduceMotion}
            mouseX={smoothX}
            mouseY={smoothY}
          />
        ))}
      </div>

      {vignette && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Orb (single animated blob)                                         */
/* ------------------------------------------------------------------ */

interface OrbConfig {
  id: number;
  color: string;
  x: number;
  y: number;
  size: number;
  amp: number;
  phase: number;
  parallax: number;
  opacity: number;
}

interface OrbProps {
  orb: OrbConfig;
  blur: number;
  speed: number;
  interactive: boolean;
  shouldReduceMotion: boolean;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

function Orb({
  orb,
  blur,
  speed,
  interactive,
  shouldReduceMotion,
  mouseX,
  mouseY,
}: OrbProps) {
  // Drift uses a long, looped keyframe animation (Framer Motion handles
  // the rAF). The keyframes trace one full sine/cosine cycle around the
  // orb's anchor position.
  const driftDuration = shouldReduceMotion || speed === 0 ? 0 : 36 / speed;

  const xKeyframes = useMemo(() => {
    if (shouldReduceMotion || speed === 0) return [`${orb.x}vw`];
    const steps = 8;
    return Array.from({ length: steps + 1 }).map((_, i) => {
      const t = (i / steps) * Math.PI * 2;
      const v = orb.x + Math.sin(t + orb.phase) * orb.amp;
      return `${v}vw`;
    });
  }, [orb.x, orb.amp, orb.phase, shouldReduceMotion, speed]);

  const yKeyframes = useMemo(() => {
    if (shouldReduceMotion || speed === 0) return [`${orb.y}vh`];
    const steps = 8;
    return Array.from({ length: steps + 1 }).map((_, i) => {
      const t = (i / steps) * Math.PI * 2;
      const v = orb.y + Math.cos(t * 0.78 + orb.phase * 1.3) * orb.amp * 0.8;
      return `${v}vh`;
    });
  }, [orb.y, orb.amp, orb.phase, shouldReduceMotion, speed]);

  const scaleKeyframes = useMemo(() => {
    if (shouldReduceMotion || speed === 0) return [1];
    return [1, 1 + 0.08, 1 - 0.04, 1];
  }, [shouldReduceMotion, speed]);

  // Parallax adds a small horizontal/vertical translate driven by the
  // mouse motion values. Range ~ +/- 80px * orb.parallax.
  const parallaxX = useTransform(mouseX, (v) =>
    interactive ? v * orb.parallax * 80 : 0,
  );
  const parallaxY = useTransform(mouseY, (v) =>
    interactive ? v * orb.parallax * 80 : 0,
  );

  return (
    <motion.div
      className="absolute left-0 top-0 rounded-full will-change-transform"
      style={{
        width: `${orb.size}vmax`,
        height: `${orb.size}vmax`,
        marginLeft: `-${orb.size / 2}vmax`,
        marginTop: `-${orb.size / 2}vmax`,
        x: parallaxX,
        y: parallaxY,
        background: `radial-gradient(circle at 50% 50%, ${orb.color}, ${orb.color}00 70%)`,
        filter: `blur(${blur}px)`,
        opacity: orb.opacity,
        mixBlendMode: "screen",
      }}
      animate={
        shouldReduceMotion || speed === 0
          ? { left: xKeyframes[0], top: yKeyframes[0] }
          : {
              left: xKeyframes,
              top: yKeyframes,
              scale: scaleKeyframes,
            }
      }
      transition={
        shouldReduceMotion || speed === 0
          ? { duration: 0 }
          : {
              duration: driftDuration,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Stars (subtle decorative twinkle)                                  */
/* ------------------------------------------------------------------ */

function Stars() {
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        backgroundImage: [
          "radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.7), transparent 50%)",
          "radial-gradient(1px 1px at 28% 72%, rgba(255,255,255,0.5), transparent 50%)",
          "radial-gradient(1px 1px at 41% 34%, rgba(255,255,255,0.6), transparent 50%)",
          "radial-gradient(1px 1px at 56% 82%, rgba(255,255,255,0.4), transparent 50%)",
          "radial-gradient(1px 1px at 67% 12%, rgba(255,255,255,0.7), transparent 50%)",
          "radial-gradient(1px 1px at 78% 56%, rgba(255,255,255,0.5), transparent 50%)",
          "radial-gradient(1px 1px at 89% 28%, rgba(255,255,255,0.6), transparent 50%)",
          "radial-gradient(1px 1px at 8% 88%, rgba(255,255,255,0.5), transparent 50%)",
          "radial-gradient(1px 1px at 33% 8%, rgba(255,255,255,0.4), transparent 50%)",
          "radial-gradient(1px 1px at 95% 70%, rgba(255,255,255,0.6), transparent 50%)",
        ].join(", "),
      }}
      animate={{ opacity: [0.45, 0.75, 0.45] }}
      transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
    />
  );
}
