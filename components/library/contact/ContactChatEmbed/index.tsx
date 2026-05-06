"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiMessageCircle,
  FiClock,
  FiShield,
  FiUsers,
  FiZap,
  FiHeart,
  FiCheck,
} from "react-icons/fi";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ChatProvider =
  | "whatsapp"
  | "intercom"
  | "crisp"
  | "messenger"
  | "telegram"
  | "livechat";

export interface ContactChatEmbedTrustRow {
  /** Optional pre-set icon — defaults to a checkmark */
  icon?: "clock" | "shield" | "users" | "zap" | "heart" | "check";
  /** Bold label (e.g. "Median reply: 4 minutes") */
  label: string;
  /** Optional supporting line */
  description?: string;
}

export interface ContactChatEmbedPreviewMessage {
  /** Who's "speaking" — `agent` is them, `visitor` is you */
  from: "agent" | "visitor";
  /** Message body */
  text: string;
}

export interface ContactChatEmbedAgent {
  /** Display name (e.g. "Marina, Customer Care") */
  name: string;
  /** Optional avatar URL — falls back to an initial chip */
  avatarUrl?: string;
  /** Optional role caption */
  role?: string;
}

export interface ContactChatEmbedProps {
  /** Optional eyebrow above the headline */
  eyebrow?: string;
  /** Section heading */
  headline: string;
  /** Supporting paragraph */
  description?: string;

  /** Provider tag rendered on the chat panel header */
  provider: ChatProvider;
  /** Optional override for the provider label */
  providerLabel?: string;

  /** Primary CTA — opens the chat (e.g. https://wa.me/..., javascript hook for Intercom) */
  ctaText: string;
  ctaUrl: string;
  /** Visual variant for the primary CTA */
  ctaStyle?: CtaVariant;
  /** Color scheme for the primary CTA */
  ctaColorScheme?: ColorScheme;

  /** Optional secondary CTA (e.g. "Email instead") */
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;

  /** Bullet rows rendered in the left/info column */
  trustRows?: ContactChatEmbedTrustRow[];

  /** Agent shown in the chat preview header */
  agent?: ContactChatEmbedAgent;
  /** Online status pill copy (defaults to "Online now") */
  statusLabel?: string;
  /** Whether the green dot pulses — defaults to true (ignored under prefers-reduced-motion) */
  showStatusPulse?: boolean;

  /** Static preview messages staged in the chat surface */
  previewMessages?: ContactChatEmbedPreviewMessage[];
  /** Whether to animate the typing indicator after the messages — defaults to true */
  showTypingIndicator?: boolean;

  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Provider visuals                                                   */
/* ------------------------------------------------------------------ */

const PROVIDER_LABEL: Record<ChatProvider, string> = {
  whatsapp: "WhatsApp",
  intercom: "Intercom",
  crisp: "Crisp",
  messenger: "Messenger",
  telegram: "Telegram",
  livechat: "Live chat",
};

const TRUST_ICONS = {
  clock: FiClock,
  shield: FiShield,
  users: FiUsers,
  zap: FiZap,
  heart: FiHeart,
  check: FiCheck,
} as const;

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function AgentAvatar({ agent }: { agent: ContactChatEmbedAgent }) {
  if (agent.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={agent.avatarUrl}
        alt={agent.name}
        className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-base-100"
      />
    );
  }
  const initial = agent.name.charAt(0).toUpperCase();
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary ring-2 ring-base-100"
    >
      {initial}
    </span>
  );
}

function TypingDot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="inline-block h-1.5 w-1.5 rounded-full bg-base-content/40"
      animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
      transition={{
        duration: 1,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_PREVIEW_MESSAGES: ContactChatEmbedPreviewMessage[] = [
  { from: "agent", text: "Hi! How can we help today?" },
  {
    from: "agent",
    text: "Asking about pricing, onboarding, or something else?",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * ContactChatEmbed -- a chat-first contact section. Left column is
 * editorial copy with reassurance bullets ("median reply: 4 min",
 * "real humans, never offshored"); right column is a stylised chat
 * panel preview that opens WhatsApp / Intercom / Crisp when clicked.
 *
 * The chat panel is a static visual that mimics the live widget — the
 * primary CTA is what actually opens the chat. This avoids embedding
 * a third-party widget directly in the section while still giving the
 * visitor a clear preview of who they'll be talking to.
 */
export default function ContactChatEmbed({
  eyebrow,
  headline,
  description,
  provider,
  providerLabel,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  secondaryCtaText,
  secondaryCtaUrl,
  trustRows,
  agent,
  statusLabel = "Online now",
  showStatusPulse = true,
  previewMessages = DEFAULT_PREVIEW_MESSAGES,
  showTypingIndicator = true,
  className,
}: ContactChatEmbedProps) {
  const shouldReduceMotion = useReducedMotion();
  const resolvedProviderLabel = providerLabel ?? PROVIDER_LABEL[provider];

  // Stage preview messages with a small reveal stagger; respects RM.
  const [revealedCount, setRevealedCount] = useState(
    shouldReduceMotion ? previewMessages.length : 0,
  );

  useEffect(() => {
    if (shouldReduceMotion) {
      setRevealedCount(previewMessages.length);
      return;
    }
    setRevealedCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    previewMessages.forEach((_, idx) => {
      timers.push(
        setTimeout(
          () => setRevealedCount((n) => Math.max(n, idx + 1)),
          400 + idx * 600,
        ),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [previewMessages, shouldReduceMotion]);

  const reveal = shouldReduceMotion
    ? { initial: false }
    : ({
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.3, ease: "easeOut" as const },
      } as const);

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-16 lg:py-24", className)}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 md:px-8 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_3fr)] lg:gap-16">
        {/* ----- Left — context + reassurance ----- */}
        <motion.div className="flex flex-col gap-6" {...reveal}>
          <div className="flex flex-col gap-3">
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                {eyebrow}
              </span>
            )}
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-base-content md:text-4xl lg:text-5xl">
              {headline}
            </h2>
            {description && (
              <p className="max-w-xl text-base leading-relaxed text-base-content/65 md:text-lg">
                {description}
              </p>
            )}
          </div>

          {trustRows && trustRows.length > 0 && (
            <ul className="mt-2 flex flex-col gap-4 border-t border-base-300 pt-6">
              {trustRows.map((row, idx) => {
                const Icon = TRUST_ICONS[row.icon ?? "check"];
                return (
                  <li key={idx} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-base-content md:text-base">
                        {row.label}
                      </span>
                      {row.description && (
                        <span className="text-sm text-base-content/65">
                          {row.description}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-2 flex flex-col gap-4 border-t border-base-300 pt-6 sm:flex-row sm:items-center">
            <div className="self-start">
              <CtaButton
                variant={ctaStyle}
                colorScheme={ctaColorScheme}
                href={ctaUrl}
              >
                {ctaText}
              </CtaButton>
            </div>
            {secondaryCtaText && secondaryCtaUrl && (
              <a
                href={secondaryCtaUrl}
                className="text-sm font-medium text-base-content/70 underline-offset-4 transition-colors hover:text-base-content hover:underline"
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
        </motion.div>

        {/* ----- Right — chat preview ----- */}
        <motion.div
          className="flex flex-col gap-3"
          {...reveal}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
        >
          <div
            role="img"
            aria-label={`${resolvedProviderLabel} chat preview${
              agent ? ` with ${agent.name}` : ""
            }`}
            className="overflow-hidden rounded-2xl border border-base-300 bg-base-200 shadow-sm"
          >
            {/* Header */}
            <header className="flex items-center justify-between gap-4 border-b border-base-300 bg-base-100 px-4 py-3 md:px-5">
              <div className="flex min-w-0 items-center gap-3">
                {agent ? (
                  <>
                    <AgentAvatar agent={agent} />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-semibold text-base-content md:text-base">
                        {agent.name}
                      </span>
                      {agent.role && (
                        <span className="truncate text-xs text-base-content/60">
                          {agent.role}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <FiMessageCircle className="h-5 w-5" />
                  </span>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="relative inline-flex h-2.5 w-2.5 items-center justify-center">
                  <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-success" />
                  {showStatusPulse && !shouldReduceMotion && (
                    <motion.span
                      className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-success"
                      animate={{ scale: [1, 2.2], opacity: [0.55, 0] }}
                      transition={{
                        duration: 1.6,
                        ease: "easeOut",
                        repeat: Infinity,
                      }}
                      aria-hidden="true"
                    />
                  )}
                </span>
                <span className="text-xs font-medium text-base-content/65">
                  {statusLabel}
                </span>
              </div>
            </header>

            {/* Message log */}
            <div className="flex flex-col gap-3 px-4 py-5 md:px-5 md:py-6">
              {previewMessages.map((msg, idx) => {
                const isAgent = msg.from === "agent";
                const isVisible = idx < revealedCount;
                return (
                  <motion.div
                    key={idx}
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, y: 8, scale: 0.97 }
                    }
                    animate={
                      isVisible
                        ? { opacity: 1, y: 0, scale: 1 }
                        : { opacity: 0, y: 8, scale: 0.97 }
                    }
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={cn(
                      "flex",
                      isAgent ? "justify-start" : "justify-end",
                    )}
                  >
                    <p
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed md:text-base",
                        isAgent
                          ? "rounded-bl-sm bg-base-100 text-base-content"
                          : "rounded-br-sm bg-primary text-primary-content",
                      )}
                    >
                      {msg.text}
                    </p>
                  </motion.div>
                );
              })}

              {showTypingIndicator && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{
                    opacity: revealedCount >= previewMessages.length ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-start"
                  aria-hidden="true"
                >
                  <span className="inline-flex items-center gap-1 rounded-2xl rounded-bl-sm bg-base-100 px-3 py-2.5">
                    <TypingDot delay={0} />
                    <TypingDot delay={0.18} />
                    <TypingDot delay={0.36} />
                  </span>
                </motion.div>
              )}
            </div>

            {/* Footer — mock composer */}
            <div className="flex items-center gap-3 border-t border-base-300 bg-base-100 px-4 py-3 md:px-5">
              <span className="flex-1 truncate rounded-full bg-base-200 px-4 py-2 text-sm text-base-content/45">
                Write a message...
              </span>
              <a
                href={ctaUrl}
                className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-content transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100"
              >
                Open
              </a>
            </div>
          </div>

          <p className="text-right text-xs text-base-content/50">
            Powered by {resolvedProviderLabel}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
