"use client";

import { cn } from "@lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FaqCategorizedQuestion {
  question: string;
  answer: string;
}

export interface FaqCategorizedCategory {
  /** Sidebar label (e.g. "Billing", "Privacy") */
  label: string;
  /** Optional 1-line caption rendered under the active heading */
  description?: string;
  /** Questions inside this category */
  questions: FaqCategorizedQuestion[];
}

export interface FaqCategorizedProps {
  /** Section heading above the layout */
  headline: string;
  /** Optional supporting text below the headline */
  subheadline?: string;
  /** Sidebar categories — first one is selected by default */
  categories?: FaqCategorizedCategory[];
  /** Index of the category to show first */
  defaultCategoryIndex?: number;
  /** Index of the question inside the active category to expand. -1 for none */
  defaultOpenQuestionIndex?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_FAQ_CATEGORIZED: FaqCategorizedCategory[] = [
  {
    label: "Getting started",
    description: "Setup, onboarding, and the first week of use.",
    questions: [
      {
        question: "How long does the onboarding take in practice?",
        answer:
          "Most teams of 10-30 are running production workflows by day four. We pair you with a solutions engineer for the first two weeks at no extra cost.",
      },
      {
        question: "Do you migrate our existing data?",
        answer:
          "Yes — CSV, Postgres, Airtable, and Notion are first-class. Anything else, we write the importer for you and run a dry-run before cutover.",
      },
      {
        question: "What does the kickoff call cover?",
        answer:
          "Goals for the first quarter, the integrations you actually need on day one, and a written checklist of who owns what. 45 minutes, no slides.",
      },
    ],
  },
  {
    label: "Billing & pricing",
    description: "How seats, plans, and renewals actually work.",
    questions: [
      {
        question: "Can we change plans mid-cycle?",
        answer:
          "Anytime. Upgrades pro-rate the day you flip the switch; downgrades take effect at the next renewal so you don't lose paid days.",
      },
      {
        question: "How do volume discounts work past 50 seats?",
        answer:
          "We publish a tiered discount table — 51-100 seats lose 12%, 101-250 lose 18%, 250+ are quoted by your account team within one business day.",
      },
      {
        question: "Is there a non-profit or education discount?",
        answer:
          "Verified non-profits get 40% off any plan. Accredited schools get 50% off plus unlimited seats for graduating cohorts.",
      },
    ],
  },
  {
    label: "Privacy & security",
    description: "Where your data lives and how it's protected.",
    questions: [
      {
        question: "Is the platform SOC 2 Type II certified?",
        answer:
          "Yes — current report dated 2025-11-12 is on the security portal. We undergo penetration tests quarterly and publish executive summaries.",
      },
      {
        question: "Can we choose EU-only data residency?",
        answer:
          "Available on Business and Enterprise plans. Pick Frankfurt or Stockholm at provisioning time — once chosen, traffic and backups never leave the region.",
      },
      {
        question: "What happens to our data if we cancel?",
        answer:
          "30-day grace window with full export (CSV, Parquet, or Postgres dump). After that we delete and provide a signed deletion certificate within 14 days.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function CategorySidebar({
  categories,
  selectedIndex,
  onSelect,
  orientation,
}: {
  categories: FaqCategorizedCategory[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  orientation: "vertical" | "horizontal";
}) {
  const shouldReduceMotion = useReducedMotion();
  const isVertical = orientation === "vertical";

  return (
    <div
      aria-label="FAQ categories"
      className={cn(
        "relative",
        isVertical
          ? "flex flex-col gap-1"
          : "flex gap-1 overflow-x-auto pb-2 md:pb-0",
      )}
      role="tablist"
    >
      {categories.map((cat, idx) => {
        const isActive = idx === selectedIndex;
        const count = cat.questions.length;

        return (
          <button
            aria-controls={`faq-categorized-panel-${idx}`}
            aria-selected={isActive}
            className={cn(
              "group relative flex shrink-0 items-center justify-between gap-3 rounded-md px-4 py-3 text-left text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100 md:text-base",
              isVertical ? "w-full" : "min-w-fit",
              isActive
                ? "text-base-content"
                : "text-base-content/55 hover:bg-base-200/60 hover:text-base-content",
            )}
            id={`faq-categorized-tab-${idx}`}
            key={cat.label}
            onClick={() => onSelect(idx)}
            role="tab"
            type="button"
          >
            {isActive && (
              <motion.span
                aria-hidden="true"
                className={cn(
                  "absolute bg-primary",
                  isVertical
                    ? "left-0 top-1 bottom-1 w-[3px] rounded-r-full"
                    : "left-3 right-3 bottom-0 h-[2px]",
                )}
                layoutId="faq-categorized-active-marker"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 380, damping: 32 }
                }
              />
            )}
            <span className={cn(isVertical && "pl-2")}>{cat.label}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs tabular-nums transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "bg-base-200 text-base-content/55 group-hover:bg-base-300/70",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function QuestionRow({
  question,
  answer,
  isOpen,
  onToggle,
  panelId,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  panelId: string;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const headerId = `${panelId}-question-${index}`;
  const contentId = `${panelId}-answer-${index}`;

  return (
    <div className="border-b border-base-300 last:border-b-0">
      <button
        aria-controls={contentId}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100 md:py-6"
        id={headerId}
        onClick={onToggle}
        type="button"
      >
        <span
          className={cn(
            "text-base font-medium transition-colors duration-200 md:text-lg",
            isOpen ? "text-primary" : "text-base-content",
          )}
        >
          {question}
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
                ? { height: 0, opacity: 0, transition: { duration: 0 } }
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
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * FaqCategorized — split layout with a vertical category sidebar (rail)
 * on desktop and a horizontal scroll strip on mobile. Selecting a
 * category cross-fades the question list. Use when you have 12+ questions
 * that group cleanly into 3-6 distinct topic buckets.
 */
export default function FaqCategorized({
  headline,
  subheadline,
  categories = DEFAULT_FAQ_CATEGORIZED,
  defaultCategoryIndex = 0,
  defaultOpenQuestionIndex = -1,
  className,
}: FaqCategorizedProps) {
  const safeCategories = useMemo(
    () => (categories.length > 0 ? categories : DEFAULT_FAQ_CATEGORIZED),
    [categories],
  );
  const initialIndex = Math.min(
    Math.max(defaultCategoryIndex, 0),
    safeCategories.length - 1,
  );

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [openMap, setOpenMap] = useState<Record<number, number>>({
    [initialIndex]: defaultOpenQuestionIndex,
  });
  const shouldReduceMotion = useReducedMotion();

  const activeCategory = safeCategories[selectedIndex];
  const activeOpenIndex = openMap[selectedIndex] ?? -1;

  const handleSelectCategory = (idx: number) => {
    setSelectedIndex(idx);
    setOpenMap((prev) =>
      prev[idx] === undefined ? { ...prev, [idx]: -1 } : prev,
    );
  };

  const handleToggleQuestion = (qIdx: number) => {
    setOpenMap((prev) => {
      const current = prev[selectedIndex] ?? -1;
      return {
        ...prev,
        [selectedIndex]: current === qIdx ? -1 : qIdx,
      };
    });
  };

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-16 lg:py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* Header — left-aligned for editorial feel */}
        <div className="mb-8 max-w-2xl md:mb-12">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-base-content md:text-4xl lg:text-5xl">
            {headline}
          </h2>
          {subheadline && (
            <p className="mt-3 text-base text-base-content/60 md:mt-4 md:text-lg">
              {subheadline}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-10 lg:grid-cols-[240px_1fr]">
          {/* Sidebar — vertical on lg, horizontal scroll-strip below */}
          <aside className="lg:hidden">
            <CategorySidebar
              categories={safeCategories}
              onSelect={handleSelectCategory}
              orientation="horizontal"
              selectedIndex={selectedIndex}
            />
          </aside>
          <aside className="hidden border-l border-base-300 pl-2 lg:block">
            <CategorySidebar
              categories={safeCategories}
              onSelect={handleSelectCategory}
              orientation="vertical"
              selectedIndex={selectedIndex}
            />
          </aside>

          {/* Panel */}
          <div className="min-h-[320px]">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                aria-labelledby={`faq-categorized-tab-${selectedIndex}`}
                exit={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }
                }
                id={`faq-categorized-panel-${selectedIndex}`}
                initial={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }
                }
                key={selectedIndex}
                role="tabpanel"
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.2,
                  ease: "easeOut",
                }}
              >
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2 border-b border-base-300 pb-4">
                  <h3 className="text-xl font-semibold text-base-content md:text-2xl">
                    {activeCategory.label}
                  </h3>
                  <span className="text-xs uppercase tracking-wider text-base-content/50">
                    {activeCategory.questions.length}{" "}
                    {activeCategory.questions.length === 1
                      ? "question"
                      : "questions"}
                  </span>
                </div>
                {activeCategory.description && (
                  <p className="border-b border-base-300 py-4 text-sm text-base-content/55 md:text-base">
                    {activeCategory.description}
                  </p>
                )}

                <div>
                  {activeCategory.questions.map((q, idx) => (
                    <QuestionRow
                      answer={q.answer}
                      index={idx}
                      isOpen={activeOpenIndex === idx}
                      key={`${selectedIndex}-${idx}`}
                      onToggle={() => handleToggleQuestion(idx)}
                      panelId={`faq-categorized-panel-${selectedIndex}`}
                      question={q.question}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
