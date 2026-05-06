"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FaqTabbedQuestion {
  question: string;
  answer: string;
}

export interface FaqTabbedCategory {
  /** Tab label (e.g. "Billing", "Privacy", "Implementation") */
  label: string;
  /** Optional short description rendered under the active tab title */
  description?: string;
  /** Questions inside this category */
  questions: FaqTabbedQuestion[];
}

export interface FaqTabbedProps {
  /** Section heading above the tab strip */
  headline: string;
  /** Optional supporting text under the headline */
  subheadline?: string;
  /** Categories — each renders as a tab */
  categories?: FaqTabbedCategory[];
  /** Index of the category to show first. Defaults to 0 */
  defaultCategoryIndex?: number;
  /** Index of the question inside the active category to expand by default. -1 for none */
  defaultOpenQuestionIndex?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_FAQ_TABBED_CATEGORIES: FaqTabbedCategory[] = [
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
          "Yes — current report dated 2025-11-12 is on the security portal. We undergo penetration tests quarterly and publish the executive summaries.",
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

function TabStrip({
  categories,
  selectedIndex,
  onSelect,
}: {
  categories: FaqTabbedCategory[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      role="tablist"
      aria-label="FAQ categories"
      className="relative flex flex-wrap gap-2 border-b border-base-300"
    >
      {categories.map((cat, idx) => {
        const isActive = idx === selectedIndex;
        return (
          <button
            key={cat.label}
            role="tab"
            type="button"
            id={`faq-tabbed-tab-${idx}`}
            aria-controls={`faq-tabbed-panel-${idx}`}
            aria-selected={isActive}
            onClick={() => onSelect(idx)}
            className={cn(
              "relative px-4 py-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100 sm:px-5 sm:text-base",
              isActive
                ? "text-base-content"
                : "text-base-content/55 hover:text-base-content",
            )}
          >
            {cat.label}
            {isActive && (
              <motion.span
                layoutId="faq-tabbed-active-underline"
                className="absolute bottom-[-1px] left-3 right-3 h-[2px] bg-primary"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 400, damping: 35 }
                }
              />
            )}
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
  index,
  panelId,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  panelId: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const headerId = `${panelId}-question-${index}`;
  const contentId = `${panelId}-answer-${index}`;

  return (
    <div className="border-b border-base-300 last:border-b-0">
      <button
        type="button"
        id={headerId}
        aria-controls={contentId}
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100 md:py-6"
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
          transition={{
            duration: shouldReduceMotion ? 0 : 0.2,
            ease: "easeOut",
          }}
          className={cn(
            "shrink-0",
            isOpen ? "text-primary" : "text-base-content/60",
          )}
        >
          <FiChevronDown className="h-5 w-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={headerId}
            className="overflow-hidden"
            initial={
              shouldReduceMotion
                ? { height: "auto", opacity: 1 }
                : { height: 0, opacity: 0 }
            }
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
          >
            <p className="pb-5 pr-8 text-base-content/65 md:pb-6">{answer}</p>
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
 * FaqTabbed -- a tabbed/categorized FAQ. The horizontal tab strip sits
 * above an accordion list; switching tabs cross-fades to the next
 * category's questions. Useful when total Q count >= ~10 and questions
 * group cleanly into segments (Pricing, Security, Implementation, etc.).
 */
export default function FaqTabbed({
  headline,
  subheadline,
  categories = DEFAULT_FAQ_TABBED_CATEGORIES,
  defaultCategoryIndex = 0,
  defaultOpenQuestionIndex = -1,
  className,
}: FaqTabbedProps) {
  const safeCategories =
    categories.length > 0 ? categories : DEFAULT_FAQ_TABBED_CATEGORIES;
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
      <div className="mx-auto max-w-5xl px-4 md:px-8">
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

        {/* Tab strip */}
        <TabStrip
          categories={safeCategories}
          selectedIndex={selectedIndex}
          onSelect={handleSelectCategory}
        />

        {/* Tab panel — cross-fades on category switch */}
        <div className="mt-2 min-h-[280px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selectedIndex}
              role="tabpanel"
              id={`faq-tabbed-panel-${selectedIndex}`}
              aria-labelledby={`faq-tabbed-tab-${selectedIndex}`}
              initial={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.2,
                ease: "easeOut",
              }}
            >
              {activeCategory.description && (
                <p className="border-b border-base-300 py-5 text-sm text-base-content/55 md:py-6">
                  {activeCategory.description}
                </p>
              )}

              <div>
                {activeCategory.questions.map((q, idx) => (
                  <QuestionRow
                    key={`${selectedIndex}-${idx}`}
                    question={q.question}
                    answer={q.answer}
                    isOpen={activeOpenIndex === idx}
                    onToggle={() => handleToggleQuestion(idx)}
                    index={idx}
                    panelId={`faq-tabbed-panel-${selectedIndex}`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
