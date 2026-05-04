"use client";

import { cn } from "@lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FaqAccordionItem {
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  /** Section heading above the accordion */
  headline: string;
  /** Optional supporting text below the headline */
  subheadline?: string;
  /** Array of question/answer pairs */
  items?: FaqAccordionItem[];
  /** Allow multiple items to be open at once (default: false) */
  allowMultiple?: boolean;
  /** Index of the item to expand by default (-1 for none) */
  defaultOpenIndex?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_FAQ_ACCORDION_ITEMS: FaqAccordionItem[] = [
  {
    question: "How long does setup take?",
    answer:
      "Most teams are up and running in under an hour. Connect your accounts, invite your team, and you're live — no migration project required.",
  },
  {
    question: "What does pricing actually look like at scale?",
    answer:
      "Plans start at $29/seat/month and we publish a clear volume discount table. You'll never be surprised by your invoice — and there's no per-feature paywall.",
  },
  {
    question: "Do you offer hands-on support?",
    answer:
      "Yes — every paid plan includes a real human you can email or message. Enterprise tiers add a dedicated solutions engineer for the first 90 days.",
  },
  {
    question: "Will it integrate with the tools we already use?",
    answer:
      "We support 60+ native integrations, plus Zapier, webhooks, and a fully documented API. If something's missing, our team will usually build it within two weeks.",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FaqAccordion({
  headline,
  subheadline,
  items = DEFAULT_FAQ_ACCORDION_ITEMS,
  allowMultiple = false,
  defaultOpenIndex = -1,
  className,
}: FaqAccordionProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>(
    defaultOpenIndex >= 0 ? [defaultOpenIndex] : [],
  );
  const shouldReduceMotion = useReducedMotion();

  const toggleItem = (index: number) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((i) => i !== index));
    } else if (allowMultiple) {
      setExpandedItems([...expandedItems, index]);
    } else {
      setExpandedItems([index]);
    }
  };

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-16 lg:py-24", className)}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold leading-tight text-base-content md:text-4xl">
            {headline}
          </h2>
          {subheadline && (
            <p className="mt-3 text-base text-base-content/60 md:text-lg">
              {subheadline}
            </p>
          )}
        </div>

        {/* Accordion */}
        <div className="flex w-full flex-col divide-y divide-base-300 overflow-hidden rounded-lg border border-base-300">
          {items.map((item, index) => {
            const isExpanded = expandedItems.includes(index);

            return (
              <div className="overflow-hidden" key={index}>
                <button
                  aria-controls={`faq-accordion-content-${index}`}
                  aria-expanded={isExpanded}
                  className={cn(
                    "flex min-h-[44px] w-full items-center justify-between gap-3 bg-base-100 px-4 py-4 text-left transition-colors hover:bg-base-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100 md:px-6",
                  )}
                  id={`faq-accordion-header-${index}`}
                  onClick={() => toggleItem(index)}
                  type="button"
                >
                  <span className="font-medium text-base-content">
                    {item.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="shrink-0 text-base-content/60"
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.2,
                      ease: "easeOut",
                    }}
                  >
                    <FiChevronDown className="h-5 w-5" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
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
                      aria-labelledby={`faq-accordion-header-${index}`}
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
                      id={`faq-accordion-content-${index}`}
                      initial={
                        shouldReduceMotion
                          ? { height: "auto", opacity: 1 }
                          : { height: 0, opacity: 0 }
                      }
                      role="region"
                    >
                      <div className="border-t border-base-300 bg-base-100 px-4 py-4 text-base-content/70 md:px-6">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
