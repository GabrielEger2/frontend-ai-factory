"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/lib/actions/create-project";
import { SUPPORTED_SEGMENTS, SEGMENT_LABELS } from "@/types/project";

const HEX_RE = /^#?[0-9a-fA-F]{6}$/;

export default function NewProjectPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [companyName, setCompanyName] = useState("");
  const [segment, setSegment] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hasBrandColor, setHasBrandColor] = useState(false);
  const [brandColor, setBrandColor] = useState("#000000");
  const [brandColorHexInput, setBrandColorHexInput] = useState("#000000");
  const [brandColorError, setBrandColorError] = useState<string | null>(null);

  function handleHexInput(raw: string) {
    setBrandColorHexInput(raw);
    if (HEX_RE.test(raw)) {
      const normalized = (raw.startsWith("#") ? raw : `#${raw}`).toUpperCase();
      setBrandColor(normalized);
      setBrandColorError(null);
    } else {
      setBrandColorError("Enter a 6-digit hex color (e.g. #1A2B3C).");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (hasBrandColor && brandColorError) {
      return;
    }

    startTransition(async () => {
      const result = await createProject({
        companyName,
        segment,
        description,
        brandColor: hasBrandColor ? brandColor : undefined,
      });

      if ("projectId" in result) {
        router.push(`/projects/${result.projectId}`);
      } else {
        setError(result.error);
      }
    });
  }

  const inputClasses =
    "w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm";

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">New Project</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Company Name
          </label>
          <input
            id="companyName"
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label
            htmlFor="segment"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Segment
          </label>
          <select
            id="segment"
            required
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            className={inputClasses}
          >
            <option value="" disabled>
              Select a segment...
            </option>
            {SUPPORTED_SEGMENTS.map((seg) => (
              <option key={seg} value={seg}>
                {SEGMENT_LABELS[seg] ?? seg}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the company, its services, target audience..."
            className={inputClasses}
          />
        </div>

        <div>
          <fieldset className="flex flex-col gap-2">
            <legend className="block text-sm font-medium text-slate-700 mb-1">
              Does the company have a brand color?
            </legend>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="hasBrandColor"
                  value="no"
                  checked={!hasBrandColor}
                  onChange={() => {
                    setHasBrandColor(false);
                    setBrandColorError(null);
                  }}
                  className="accent-slate-900"
                />
                No
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="hasBrandColor"
                  value="yes"
                  checked={hasBrandColor}
                  onChange={() => setHasBrandColor(true)}
                  className="accent-slate-900"
                />
                Yes
              </label>
            </div>
          </fieldset>

          {hasBrandColor && (
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  aria-label="Brand color picker"
                  value={brandColor}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setBrandColor(value);
                    setBrandColorHexInput(value);
                    setBrandColorError(null);
                  }}
                  className="h-9 w-12 cursor-pointer rounded border border-slate-300"
                />
                <input
                  type="text"
                  aria-label="Brand color hex value"
                  value={brandColorHexInput}
                  onChange={(e) => handleHexInput(e.target.value)}
                  placeholder="#000000"
                  className={inputClasses}
                />
              </div>
              {brandColorError && (
                <p className="text-xs text-red-600" role="alert">
                  {brandColorError}
                </p>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Generating..." : "Generate Website"}
        </button>
      </form>
    </div>
  );
}
