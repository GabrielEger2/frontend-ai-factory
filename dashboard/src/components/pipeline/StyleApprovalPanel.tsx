"use client";

import { useState, useTransition } from "react";
import { approveStyle } from "@/lib/actions/approve-style";
import { PalettePicker } from "@/components/ui/PalettePicker";
import type { StyleOutput, Palette } from "@/types/project";

const STYLE_TAGS = [
  "modern",
  "classic",
  "editorial",
  "luxury",
  "playful",
  "minimal",
  "bold",
  "corporate",
] as const;

const MOOD_TAGS = [
  "professional",
  "elegant",
  "fun",
  "serious",
  "friendly",
  "energetic",
  "calm",
  "trustworthy",
] as const;

const FONT_OPTIONS = [
  "Inter",
  "Poppins",
  "Lora",
  "Playfair Display",
  "Nunito",
  "Montserrat",
  "Roboto",
  "Raleway",
];

interface StyleApprovalPanelProps {
  projectId: string;
  initialStyle: StyleOutput;
}

export function StyleApprovalPanel({
  projectId,
  initialStyle,
}: StyleApprovalPanelProps) {
  const [style, setStyle] = useState<StyleOutput>(initialStyle);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function updatePaletteColor(key: keyof Palette, value: string) {
    setStyle((prev) => ({
      ...prev,
      palette: { ...prev.palette, [key]: value },
    }));
  }

  function updateFont(field: "heading" | "body", value: string) {
    setStyle((prev) => ({
      ...prev,
      typography: { ...prev.typography, [field]: value },
    }));
  }

  function toggleStyle(tag: StyleOutput["style"][number]) {
    setStyle((prev) => ({
      ...prev,
      style: prev.style.includes(tag)
        ? prev.style.filter((t) => t !== tag)
        : [...prev.style, tag],
    }));
  }

  function toggleMood(tag: StyleOutput["mood"][number]) {
    setStyle((prev) => ({
      ...prev,
      mood: prev.mood.includes(tag)
        ? prev.mood.filter((t) => t !== tag)
        : [...prev.mood, tag],
    }));
  }

  function handleApprove() {
    setFeedback(null);

    startTransition(async () => {
      const result = await approveStyle(projectId, style);

      if ("message" in result) {
        setFeedback({
          type: "success",
          text: "Style approved — pipeline continuing.",
        });
      } else {
        setFeedback({ type: "error", text: result.error });
      }
    });
  }

  const labelClasses = "block text-sm font-medium text-slate-700 mb-1";
  const sectionClasses = "flex flex-col gap-3";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Style Approval</h2>
        <p className="text-sm text-slate-500 mt-1">
          Review and edit the AI-generated style choices. Click Approve when
          ready.
        </p>
      </div>

      {/* Palette Section */}
      <section className={sectionClasses}>
        <h3 className="text-sm font-semibold text-slate-800">Palette</h3>
        <PalettePicker
          palette={style.palette}
          onChange={(key, val) => updatePaletteColor(key, val)}
        />
      </section>

      {/* Typography Section */}
      <section className={sectionClasses}>
        <h3 className="text-sm font-semibold text-slate-800">Typography</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["heading", "body"] as const).map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <label className={labelClasses}>
                {field === "heading" ? "Heading Font" : "Body Font"}
              </label>
              <input
                type="text"
                list={`font-options-${field}`}
                value={style.typography[field]}
                onChange={(e) => updateFont(field, e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="Select or type a font..."
              />
              <datalist id={`font-options-${field}`}>
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font} />
                ))}
              </datalist>
            </div>
          ))}
        </div>
      </section>

      {/* Style Tags Section */}
      <section className={sectionClasses}>
        <h3 className="text-sm font-semibold text-slate-800">Style Tags</h3>
        <div className="flex flex-wrap gap-2">
          {STYLE_TAGS.map((tag) => {
            const selected = style.style.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleStyle(tag)}
                className={
                  selected
                    ? "rounded-full px-3 py-1 text-xs font-medium bg-slate-900 text-white transition-colors"
                    : "rounded-full px-3 py-1 text-xs font-medium border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                }
              >
                {tag}
              </button>
            );
          })}
        </div>
      </section>

      {/* Mood Tags Section */}
      <section className={sectionClasses}>
        <h3 className="text-sm font-semibold text-slate-800">Mood Tags</h3>
        <div className="flex flex-wrap gap-2">
          {MOOD_TAGS.map((tag) => {
            const selected = style.mood.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleMood(tag)}
                className={
                  selected
                    ? "rounded-full px-3 py-1 text-xs font-medium bg-slate-900 text-white transition-colors"
                    : "rounded-full px-3 py-1 text-xs font-medium border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                }
              >
                {tag}
              </button>
            );
          })}
        </div>
      </section>

      {/* Density Section */}
      <section className={sectionClasses}>
        <h3 className="text-sm font-semibold text-slate-800">Density</h3>
        <div className="flex gap-4">
          {(["low", "medium", "high"] as const).map((level) => (
            <label
              key={level}
              className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"
            >
              <input
                type="radio"
                name="density"
                value={level}
                checked={style.density === level}
                onChange={() =>
                  setStyle((prev) => ({ ...prev, density: level }))
                }
                className="accent-slate-900"
              />
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </label>
          ))}
        </div>
      </section>

      {/* Feedback + Approve Button */}
      <div className="flex flex-col gap-3">
        {feedback && (
          <p
            className={
              feedback.type === "success"
                ? "text-sm text-green-600"
                : "text-sm text-red-600"
            }
            role="alert"
          >
            {feedback.text}
          </p>
        )}
        <button
          type="button"
          onClick={handleApprove}
          disabled={isPending}
          className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed self-start"
        >
          {isPending ? "Approving..." : "Approve Style"}
        </button>
      </div>
    </div>
  );
}
