"use client";

import { cn } from "@lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { FiChevronDown, FiSearch, FiX } from "react-icons/fi";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FaqSearchItem {
  question: string;
  answer: string;
  /** Optional extra keywords to surface in matches but never render */
  tags?: string[];
}

export interface FaqSearchProps {
  /** Section heading above the search bar */
  headline: string;
  /** Optional supporting text below the headline */
  subheadline?: string;
  /** Placeholder text inside the search input */
  searchPlaceholder?: string;
  /** Empty-state copy when zero questions match */
  emptyStateText?: string;
  /** Question/answer pairs */
  items?: FaqSearchItem[];
  /** Index of the item to expand by default (-1 for none) */
  defaultOpenIndex?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_FAQ_SEARCH_ITEMS: FaqSearchItem[] = [
  {
    question: "How long does setup take for a 25-person team?",
    answer:
      "Most teams of 20-30 are running in under an afternoon. Connect your existing SSO, import your member directory, and the workspace is provisioned automatically — no migration project required.",
    tags: ["onboarding", "setup", "sso", "import"],
  },
  {
    question: "Do you offer EU-only data residency?",
    answer:
      "Yes. Frankfurt and Stockholm regions are available on Business and Enterprise plans. Once selected at provisioning, traffic and backups never leave the chosen region.",
    tags: ["gdpr", "privacy", "residency", "europe"],
  },
  {
    question: "What's included in the 14-day trial?",
    answer:
      "Every feature on the Business plan is unlocked for the full 14 days, including SSO, audit logs, and the API. No credit card required, and we'll never auto-charge you when the trial ends.",
    tags: ["trial", "pricing", "billing"],
  },
  {
    question: "How do you handle billing for annual contracts?",
    answer:
      "Annual contracts are invoiced once at signing with NET-30 terms. We accept ACH, wire, and major cards. Mid-cycle seat additions pro-rate against your renewal date so you never lose paid days.",
    tags: ["billing", "pricing", "invoice", "annual"],
  },
  {
    question: "Can I export my data if we cancel?",
    answer:
      "Anytime — CSV, JSON, and Postgres dumps are all available from the admin dashboard. After cancellation we keep your export-ready archive for 30 days, then permanently delete it and send a signed deletion certificate.",
    tags: ["export", "cancel", "data", "gdpr"],
  },
  {
    question: "What integrations ship out of the box?",
    answer:
      "Slack, Notion, Linear, GitHub, Figma, and the Google and Microsoft suites are all native. We also publish a documented REST and webhook API for anything custom — most teams need fewer than three custom integrations.",
    tags: ["integrations", "slack", "api", "webhooks"],
  },
  {
    question: "How does volume pricing work past 50 seats?",
    answer:
      "Public discounts apply automatically: 51-100 seats get 12% off, 101-250 get 18%, and 250+ are quoted by your account team within one business day. We never use a hidden 'enterprise upcharge'.",
    tags: ["pricing", "discount", "volume", "enterprise"],
  },
  {
    question: "Is the platform SOC 2 Type II certified?",
    answer:
      "Yes — the current Type II report dated November 2025 is in our security portal. We undergo penetration testing each quarter and publish executive summaries to customers under NDA.",
    tags: ["security", "soc2", "compliance", "audit"],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Wrap matched substrings in <mark> elements without using dangerouslySetInnerHTML.
 * Falls back to the original string when the query is empty or doesn't match.
 */
function highlight(text: string, query: string) {
  const trimmed = query.trim();
  if (trimmed.length === 0) return text;

  const re = new RegExp(`(${escapeRegex(trimmed)})`, "ig");
  const parts = text.split(re);
  if (parts.length <= 1) return text;

  return parts.map((part, i) =>
    re.test(part) ? (
      <mark key={i} className="rounded-[2px] bg-primary/15 px-0.5 text-primary">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function matches(item: FaqSearchItem, query: string): boolean {
  const trimmed = query.trim().toLowerCase();
  if (trimmed.length === 0) return true;
  if (item.question.toLowerCase().includes(trimmed)) return true;
  if (item.answer.toLowerCase().includes(trimmed)) return true;
  if (item.tags?.some((t) => t.toLowerCase().includes(trimmed))) return true;
  return false;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * FaqSearch — search-driven FAQ with live filter and keyword highlighting.
 *
 * Uses a debounced input visually, live filters the question list, and
 * highlights matched substrings in both question and answer. Designed for
 * help-center sized FAQ libraries (10+ questions) where scrolling is too slow.
 */
export default function FaqSearch({
  headline,
  subheadline,
  searchPlaceholder = "Search questions, topics, or keywords...",
  emptyStateText = "No questions match that search. Try a shorter keyword or browse all topics.",
  items = DEFAULT_FAQ_SEARCH_ITEMS,
  defaultOpenIndex = -1,
  className,
}: FaqSearchProps) {
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(
    defaultOpenIndex >= 0 ? `idx-${defaultOpenIndex}` : null,
  );
  const shouldReduceMotion = useReducedMotion();

  const filtered = useMemo(() => {
    return items
      .map((item, idx) => ({ item, originalIndex: idx }))
      .filter(({ item }) => matches(item, query));
  }, [items, query]);

  const trimmedQuery = query.trim();
  const resultCount = filtered.length;
  const hasQuery = trimmedQuery.length > 0;

  const toggle = (key: string) => {
    setOpenKey((current) => (current === key ? null : key));
  };

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-16 lg:py-24", className)}
    >
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-8 text-center md:mb-10">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-base-content md:text-4xl">
            {headline}
          </h2>
          {subheadline && (
            <p className="mx-auto mt-3 max-w-xl text-base text-base-content/60 md:text-lg">
              {subheadline}
            </p>
          )}
        </div>

        {/* Search input */}
        <div className="relative mb-6 md:mb-8">
          <FiSearch
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-base-content/50"
          />
          <input
            aria-label="Search frequently asked questions"
            className="h-12 w-full rounded-full border border-base-300 bg-base-100 pl-11 pr-12 text-base text-base-content placeholder:text-base-content/45 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 md:h-14 md:text-lg"
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            type="search"
            value={query}
          />
          {query.length > 0 && (
            <button
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-base-content/55 transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setQuery("")}
              type="button"
            >
              <FiX className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Result counter */}
        {hasQuery && (
          <p aria-live="polite" className="mb-4 text-sm text-base-content/55">
            {resultCount === 0
              ? "No matches"
              : `${resultCount} ${resultCount === 1 ? "result" : "results"} for "${trimmedQuery}"`}
          </p>
        )}

        {/* Results */}
        {resultCount === 0 ? (
          <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/40 px-6 py-10 text-center text-base text-base-content/60">
            {emptyStateText}
          </div>
        ) : (
          <ul className="divide-y divide-base-300 border-y border-base-300">
            {filtered.map(({ item, originalIndex }) => {
              const key = `idx-${originalIndex}`;
              const isOpen = openKey === key;
              const headerId = `faq-search-header-${originalIndex}`;
              const contentId = `faq-search-content-${originalIndex}`;

              return (
                <li className="overflow-hidden" key={key}>
                  <button
                    aria-controls={contentId}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100 md:py-6"
                    id={headerId}
                    onClick={() => toggle(key)}
                    type="button"
                  >
                    <span
                      className={cn(
                        "text-base font-medium transition-colors duration-200 md:text-lg",
                        isOpen ? "text-primary" : "text-base-content",
                      )}
                    >
                      {highlight(item.question, query)}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className={cn(
                        "shrink-0",
                        isOpen ? "text-primary" : "text-base-content/55",
                      )}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.2,
                        ease: "easeOut",
                      }}
                    >
                      <FiChevronDown className="h-5 w-5" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        animate={
                          shouldReduceMotion
                            ? { height: "auto", opacity: 1 }
                            : {
                                height: "auto",
                                opacity: 1,
                                transition: {
                                  height: { duration: 0.25, ease: "easeOut" },
                                  opacity: { duration: 0.2, ease: "easeOut" },
                                },
                              }
                        }
                        aria-labelledby={headerId}
                        className="overflow-hidden"
                        exit={
                          shouldReduceMotion
                            ? {
                                height: 0,
                                opacity: 0,
                                transition: { duration: 0 },
                              }
                            : {
                                height: 0,
                                opacity: 0,
                                transition: {
                                  height: { duration: 0.2, ease: "easeIn" },
                                  opacity: { duration: 0.15, ease: "easeIn" },
                                },
                              }
                        }
                        id={contentId}
                        initial={
                          shouldReduceMotion
                            ? { height: "auto", opacity: 1 }
                            : { height: 0, opacity: 0 }
                        }
                        role="region"
                      >
                        <p className="pb-5 pr-8 text-base-content/65 leading-relaxed md:pb-6">
                          {highlight(item.answer, query)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
