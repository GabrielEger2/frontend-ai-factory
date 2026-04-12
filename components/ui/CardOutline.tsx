"use client";

import { useRef } from "react";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CardOutlineItem {
  /** Background image URL */
  image: string;
  /** Accessible alt text */
  imageAlt: string;
  /** Card heading displayed over the gradient overlay */
  title: string;
  /** Destination URL */
  url: string;
}

export interface CardOutlineGridProps {
  /** Cards to display */
  cards: CardOutlineItem[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CURSOR_WIDTH = 32;
const HOVER_PADDING = 24;

/* ------------------------------------------------------------------ */
/*  Arrow icon (inline SVG)                                            */
/* ------------------------------------------------------------------ */

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
    >
      <path
        d="M5 12h14M12 5l7 7-7 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: single card                                         */
/* ------------------------------------------------------------------ */

function OutlineCard({ card }: { card: CardOutlineItem }) {
  return (
    <a
      href={card.url}
      style={{
        backgroundImage: `url(${card.image})`,
        backgroundPosition: "center",
      }}
      className="outline-card flex aspect-square w-full flex-col justify-end overflow-hidden rounded-box bg-base-300 bg-[size:100%] shadow-lg transition-[background-size] duration-300 hover:bg-[size:110%]"
      aria-label={card.imageAlt}
    >
      <div className="pointer-events-none flex items-center justify-between bg-gradient-to-t from-neutral to-neutral/0 p-6 pt-8 text-xl font-medium text-neutral-content md:text-2xl">
        <h3>{card.title}</h3>
        <ArrowRight className="text-lg" />
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Cursor element                                                     */
/* ------------------------------------------------------------------ */

function Cursor({
  cursorRef,
}: {
  cursorRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={cursorRef}
      style={{
        width: 0,
        height: 0,
        borderRadius: CURSOR_WIDTH,
        top: 0,
        left: 0,
      }}
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 border border-base-content"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * CardOutlineGrid — a set of image cards with a custom cursor that
 * snaps and expands around each card on hover.
 *
 * Based on the "OutlineCards" reference. Adapted to use semantic tokens,
 * slot-driven card data, and project conventions.
 */
export function CardOutlineGrid({ cards, className }: CardOutlineGridProps) {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const el = e.target as HTMLElement;
    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    const isCardHover = el.classList.contains("outline-card");

    if (isCardHover) {
      const { width, height, top, left } = el.getBoundingClientRect();

      cursorEl.style.transition = "0.25s all";
      cursorEl.style.width = `${width + HOVER_PADDING}px`;
      cursorEl.style.height = `${height + HOVER_PADDING}px`;
      cursorEl.style.borderRadius = `${HOVER_PADDING / 2}px`;
      cursorEl.style.top = `${top + window.scrollY + height / 2}px`;
      cursorEl.style.left = `${left + width / 2}px`;
    } else {
      cursorEl.style.transition = "0s all";
      cursorEl.style.width = `${CURSOR_WIDTH}px`;
      cursorEl.style.height = `${CURSOR_WIDTH}px`;
      cursorEl.style.borderRadius = `${CURSOR_WIDTH}px`;
      cursorEl.style.top = `${e.clientY + window.scrollY}px`;
      cursorEl.style.left = `${e.clientX}px`;
    }
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className={cn(
        "relative overflow-hidden px-4 py-16 md:px-8 md:py-24",
        className,
      )}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-8 sm:flex-row">
        {cards.map((card, i) => (
          <OutlineCard key={i} card={card} />
        ))}
      </div>
      <Cursor cursorRef={cursorRef} />
    </section>
  );
}
