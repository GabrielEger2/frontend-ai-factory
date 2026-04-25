"use client";

import { cn } from "@lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FaqMinimalItem {
  question: string;
  answer: string;
}

export interface FaqMinimalProps {
  /** Section heading above the FAQ list */
  headline: string;
  /** Optional supporting text below the headline */
  subheadline?: string;
  /** Array of question/answer pairs */
  items?: FaqMinimalItem[];
  /** Index of the item to expand by default (-1 for none) */
  defaultOpenIndex?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_FAQ_MINIMAL_ITEMS: FaqMinimalItem[] = [
  {
    question: "Can I try it before committing?",
    answer:
      "Every plan starts with a 14-day trial — no credit card required. You'll have access to every feature, not a stripped-down demo.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "You can export everything as CSV or JSON at any time. We hold your data for 30 days after cancellation, then delete it permanently.",
  },
  {
    question: "Is there a free plan for small teams?",
    answer:
      "Yes — teams of three or fewer can use the Starter tier indefinitely with all core features included. We only charge once you outgrow it.",
  },
  {
    question: "How do you handle privacy and compliance?",
    answer:
      "We're SOC 2 Type II and GDPR compliant, encrypt data at rest and in transit, and offer EU-only data residency on Business and Enterprise plans.",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-component                                                      */
/* ------------------------------------------------------------------ */

function Question({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="border-b border-base-300">
      <button
        aria-controls={`faq-minimal-content-${index}`}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100 md:py-6"
        id={`faq-minimal-header-${index}`}
        onClick={onToggle}
        type="button"
      >
        <span
          className={cn(
            "text-lg font-medium transition-colors duration-200",
            isOpen ? "text-primary" : "text-base-content",
          )}
        >
          {question}
        </span>
        <motion.span
          animate={{
            rotate: isOpen ? 180 : 0,
          }}
          className={cn(
            "shrink-0 transition-colors duration-200",
            isOpen ? "text-primary" : "text-base-content/60",
          )}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.2,
            ease: "easeOut",
          }}
        >
          <FiChevronDown className="text-xl" />
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
            aria-labelledby={`faq-minimal-header-${index}`}
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
            id={`faq-minimal-content-${index}`}
            initial={
              shouldReduceMotion
                ? { height: "auto", opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            role="region"
          >
            <p className="pb-5 text-base-content/60 md:pb-6">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FaqMinimal({
  headline,
  subheadline,
  items = DEFAULT_FAQ_MINIMAL_ITEMS,
  defaultOpenIndex = -1,
  className,
}: FaqMinimalProps) {
  const [openIndex, setOpenIndex] = useState<number>(defaultOpenIndex);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-16 lg:py-24", className)}
    >
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-semibold leading-tight text-base-content md:text-4xl">
            {headline}
          </h2>
          {subheadline && (
            <p className="mt-3 text-base text-base-content/60 md:text-lg">
              {subheadline}
            </p>
          )}
        </div>

        {/* FAQ list */}
        <div>
          {items.map((item, index) => (
            <Question
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onToggle={() => toggleItem(index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
