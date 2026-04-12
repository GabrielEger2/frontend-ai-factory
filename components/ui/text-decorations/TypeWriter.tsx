"use client";

import React, { useEffect, useRef, useState } from "react";

export interface TypeWriterProps {
  /** Single string or array of strings to cycle through */
  text: string | string[];
  /** Typing speed in ms per character (default: 50) */
  speed?: number;
  /** Deletion speed in ms per character (default: 30) */
  deleteSpeed?: number;
  /** Delay before starting to type in ms (default: 0) */
  startDelay?: number;
  /** Delay after finishing a string before deleting in ms (default: 2000) */
  pauseDelay?: number;
  /** Delay after deleting before typing next string in ms (default: 500) */
  deleteDelay?: number;
  /** Whether to loop through strings continuously (default: true when multiple strings) */
  loop?: boolean;
  /** Show blinking cursor (default: true) */
  cursor?: boolean;
  /** Custom cursor character (default: "|") */
  cursorChar?: string;
  /** Cursor blink speed in ms (default: 530) */
  cursorBlinkSpeed?: number;
  /** HTML tag to render as (default: "span") */
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
  /** Additional CSS classes */
  className?: string;
  /** CSS classes for the cursor */
  cursorClassName?: string;
  /** Callback when a string finishes typing */
  onComplete?: (index: number) => void;
  /** Callback when all strings have been typed (only fires if loop is false) */
  onAllComplete?: () => void;
  /** Whether to start typing only when element is in view (default: false) */
  startOnView?: boolean;
}

export function TypeWriter({
  text,
  speed = 50,
  deleteSpeed = 30,
  startDelay = 0,
  pauseDelay = 2000,
  deleteDelay = 500,
  loop,
  cursor = true,
  cursorChar = "|",
  cursorBlinkSpeed = 530,
  as: Tag = "span",
  className,
  cursorClassName,
  onComplete,
  onAllComplete,
  startOnView = false,
}: TypeWriterProps) {
  const strings = Array.isArray(text) ? text : [text];
  const shouldLoop = loop ?? strings.length > 1;
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  const [displayed, setDisplayed] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isInView, setIsInView] = useState(!startOnView);
  const elementRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Intersection observer for startOnView
  useEffect(() => {
    if (!startOnView || !elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [startOnView]);

  // Reduced motion: show full text immediately
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayed(strings[strings.length - 1]);
    }
  }, [prefersReducedMotion, strings]);

  // Cursor blink
  useEffect(() => {
    if (!cursor || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, cursorBlinkSpeed);

    return () => clearInterval(interval);
  }, [cursor, cursorBlinkSpeed, prefersReducedMotion]);

  // Typing engine
  useEffect(() => {
    if (prefersReducedMotion || !isInView) return;

    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isMounted = true;

    function tick() {
      if (!isMounted) return;

      const currentString = strings[stringIndex];

      if (!isDeleting) {
        charIndex++;
        setDisplayed(currentString.slice(0, charIndex));

        if (charIndex === currentString.length) {
          onComplete?.(stringIndex);

          if (strings.length === 1 && !shouldLoop) {
            onAllComplete?.();
            return;
          }

          if (!shouldLoop && stringIndex === strings.length - 1) {
            onAllComplete?.();
            return;
          }

          timeoutRef.current = setTimeout(() => {
            isDeleting = true;
            tick();
          }, pauseDelay);
          return;
        }

        // Random variation for natural feel (+-30%)
        const variation = speed * (0.7 + Math.random() * 0.6);
        timeoutRef.current = setTimeout(tick, variation);
      } else {
        charIndex--;
        setDisplayed(currentString.slice(0, charIndex));

        if (charIndex === 0) {
          isDeleting = false;
          stringIndex = (stringIndex + 1) % strings.length;
          timeoutRef.current = setTimeout(tick, deleteDelay);
          return;
        }

        timeoutRef.current = setTimeout(tick, deleteSpeed);
      }
    }

    timeoutRef.current = setTimeout(tick, startDelay);

    return () => {
      isMounted = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    strings,
    speed,
    deleteSpeed,
    startDelay,
    pauseDelay,
    deleteDelay,
    shouldLoop,
    prefersReducedMotion,
    isInView,
    onComplete,
    onAllComplete,
  ]);

  return (
    <Tag ref={elementRef as React.Ref<never>} className={className}>
      {displayed}
      {cursor && (
        <span
          className={cursorClassName}
          style={{ opacity: cursorVisible ? 1 : 0 }}
          aria-hidden="true"
        >
          {cursorChar}
        </span>
      )}
    </Tag>
  );
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
