"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { postFeedback } from "@/lib/actions/post-feedback";

interface FeedbackFormProps {
  /** Share token from the URL — forwarded to postFeedbackAction. */
  token: string;
}

const MESSAGE_MAX = 2000;
const MIN_AGE_MS = 3000; // silently reject submits faster than this

/**
 * Public feedback form rendered on /share/[token]. Required message
 * textarea plus optional name/email fields. Includes a hidden honeypot
 * `website` field and a mount-time age check to silently drop bot
 * submissions — both defenses are matched server-side by the
 * post-feedback Lambda.
 */
export function FeedbackForm({ token }: FeedbackFormProps) {
  const [message, setMessage] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [feedback, setFeedback] = useState<
    { type: "success"; text: string } | { type: "error"; text: string } | null
  >(null);
  const [isPending, startTransition] = useTransition();
  const mountedAt = useRef<number>(Date.now());

  // Reset the mount timestamp on first paint (Strict Mode safe).
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedback(null);

    const trimmed = message.trim();
    if (!trimmed) {
      setFeedback({ type: "error", text: "Please enter a message." });
      return;
    }
    if (trimmed.length > MESSAGE_MAX) {
      setFeedback({
        type: "error",
        text: `Message is too long (max ${MESSAGE_MAX} characters).`,
      });
      return;
    }

    // Honeypot: any value in `website` or a submission faster than the
    // human reaction window silently "succeeds" without hitting the API.
    const age = Date.now() - mountedAt.current;
    if (website.length > 0 || age < MIN_AGE_MS) {
      setFeedback({ type: "success", text: "Thanks for your feedback!" });
      setMessage("");
      setClientName("");
      setClientEmail("");
      return;
    }

    startTransition(async () => {
      const result = await postFeedback(token, {
        message: trimmed,
        clientName: clientName.trim() || undefined,
        clientEmail: clientEmail.trim() || undefined,
      });
      if ("error" in result) {
        setFeedback({ type: "error", text: result.error });
      } else {
        setFeedback({ type: "success", text: "Thanks for your feedback!" });
        setMessage("");
        setClientName("");
        setClientEmail("");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6"
    >
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          Leave feedback
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Share thoughts with the team building this site.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="feedback-message"
          className="text-sm font-medium text-slate-700"
        >
          Message <span className="text-red-600">*</span>
        </label>
        <textarea
          id="feedback-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          maxLength={MESSAGE_MAX}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          placeholder="What did you think?"
        />
        <p className="text-xs text-slate-400">
          {message.length}/{MESSAGE_MAX}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="feedback-name"
            className="text-sm font-medium text-slate-700"
          >
            Name (optional)
          </label>
          <input
            id="feedback-name"
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="feedback-email"
            className="text-sm font-medium text-slate-700"
          >
            Email (optional)
          </label>
          <input
            id="feedback-email"
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
      </div>

      {/* Honeypot — visually hidden, machine-fillable. */}
      <div aria-hidden="true" className="sr-only">
        <label>
          Website
          <input
            type="text"
            name="website"
            autoComplete="off"
            tabIndex={-1}
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      {feedback && (
        <p
          role="alert"
          className={
            feedback.type === "success"
              ? "text-sm text-green-700"
              : "text-sm text-red-600"
          }
        >
          {feedback.text}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Sending..." : "Send feedback"}
      </button>
    </form>
  );
}
