"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/lib/actions/create-project";
import { SUPPORTED_SEGMENTS, SEGMENT_LABELS } from "@/types/project";
import { TONE_KEYWORDS, OBJECTIVES } from "@/lib/constants";
import { selectableCategories } from "@/lib/manifest-utils";

const HEX_RE = /^#?[0-9a-fA-F]{6}$/;

interface SocialLinkRow {
  platform: string;
  url: string;
}

const OBJECTIVE_LABELS: Record<string, string> = {
  more_leads: "More leads",
  drive_whatsapp: "Drive WhatsApp",
  showcase_portfolio: "Showcase portfolio",
  increase_signups: "Increase signups",
  brand_awareness: "Brand awareness",
  drive_purchases: "Drive purchases",
  support_inquiries: "Support inquiries",
};

function formatCategoryLabel(category: string): string {
  // "layout/grid" -> "Layout / Grid"; "cta" -> "Cta"
  return category
    .split("/")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" / ");
}

export default function NewProjectPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Company basics
  const [companyName, setCompanyName] = useState("");
  const [segment, setSegment] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hasBrandColor, setHasBrandColor] = useState(false);
  const [brandColor, setBrandColor] = useState("#000000");
  const [brandColorHexInput, setBrandColorHexInput] = useState("#000000");
  const [brandColorError, setBrandColorError] = useState<string | null>(null);

  // Brand & tone
  const [brandToneKeywords, setBrandToneKeywords] = useState<string[]>([]);
  const [objectives, setObjectives] = useState<string[]>([]);

  // Site sections
  const [desiredSections, setDesiredSections] = useState<string[]>([]);
  const [excludedSections, setExcludedSections] = useState<string[]>([]);
  const [sectionsError, setSectionsError] = useState<string | null>(null);

  // Contact info
  const [businessHours, setBusinessHours] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [emailValue, setEmailValue] = useState("");

  // Social links
  const [socialLinks, setSocialLinks] = useState<SocialLinkRow[]>([]);

  const categories = useMemo(() => selectableCategories(), []);

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

  function toggleToneKeyword(tag: string) {
    setBrandToneKeywords((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function toggleObjective(tag: string) {
    setObjectives((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function toggleDesired(category: string) {
    setSectionsError(null);
    setDesiredSections((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  }

  function toggleExcluded(category: string) {
    setSectionsError(null);
    setExcludedSections((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  }

  function addSocialLink() {
    setSocialLinks((prev) => [...prev, { platform: "", url: "" }]);
  }

  function updateSocialLink(
    index: number,
    field: "platform" | "url",
    value: string,
  ) {
    setSocialLinks((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }

  function removeSocialLink(index: number) {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSectionsError(null);

    if (hasBrandColor && brandColorError) {
      return;
    }

    // Validate that no category appears in both include & exclude lists.
    const overlap = desiredSections.filter((c) => excludedSections.includes(c));
    if (overlap.length > 0) {
      setSectionsError(
        `A section can't be included and excluded at the same time: ${overlap.join(", ")}`,
      );
      return;
    }

    // Filter out social link rows where both fields are blank.
    const cleanedSocialLinks = socialLinks
      .map((row) => ({ platform: row.platform.trim(), url: row.url.trim() }))
      .filter((row) => row.platform.length > 0 || row.url.length > 0);

    startTransition(async () => {
      const result = await createProject({
        companyName,
        segment,
        description,
        brandColor: hasBrandColor ? brandColor : undefined,
        brandToneKeywords:
          brandToneKeywords.length > 0 ? brandToneKeywords : undefined,
        objectives: objectives.length > 0 ? objectives : undefined,
        desiredSections:
          desiredSections.length > 0 ? desiredSections : undefined,
        excludedSections:
          excludedSections.length > 0 ? excludedSections : undefined,
        businessHours: businessHours.trim() || undefined,
        address: address.trim() || undefined,
        phone: phone.trim() || undefined,
        email: emailValue.trim() || undefined,
        socialLinks:
          cleanedSocialLinks.length > 0 ? cleanedSocialLinks : undefined,
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

  const summaryClasses =
    "cursor-pointer select-none text-base font-semibold text-slate-900 py-2";

  const detailsClasses = "border border-slate-200 rounded-md px-4 bg-white";

  const pillClasses = (selected: boolean) =>
    selected
      ? "rounded-full px-3 py-1 text-xs font-medium bg-slate-900 text-white transition-colors"
      : "rounded-full px-3 py-1 text-xs font-medium border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors";

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">New Project</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* ── Company basics ─────────────────────────────────────────── */}
        <details className={detailsClasses} open>
          <summary className={summaryClasses}>Company basics</summary>
          <div className="flex flex-col gap-6 pt-2 pb-4">
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
          </div>
        </details>

        {/* ── Brand & tone ──────────────────────────────────────────── */}
        <details className={detailsClasses}>
          <summary className={summaryClasses}>Brand &amp; tone</summary>
          <div className="flex flex-col gap-6 pt-2 pb-4">
            <div>
              <p className="block text-sm font-medium text-slate-700 mb-2">
                Brand tone keywords
              </p>
              <p className="text-xs text-slate-500 mb-2">
                Choose words that describe the brand&apos;s personality.
              </p>
              <div className="flex flex-wrap gap-2">
                {TONE_KEYWORDS.map((tag) => {
                  const selected = brandToneKeywords.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleToneKeyword(tag)}
                      className={pillClasses(selected)}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="block text-sm font-medium text-slate-700 mb-2">
                Objectives
              </p>
              <p className="text-xs text-slate-500 mb-2">
                What should the website achieve for the business?
              </p>
              <div className="flex flex-wrap gap-2">
                {OBJECTIVES.map((tag) => {
                  const selected = objectives.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleObjective(tag)}
                      className={pillClasses(selected)}
                    >
                      {OBJECTIVE_LABELS[tag] ?? tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </details>

        {/* ── Site sections ─────────────────────────────────────────── */}
        <details className={detailsClasses}>
          <summary className={summaryClasses}>Site sections</summary>
          <div className="flex flex-col gap-6 pt-2 pb-4">
            <p className="text-xs text-slate-500">
              Pick which kinds of sections must (or must not) appear in the
              generated site. Navigation and footer are always included.
            </p>

            <div>
              <p className="block text-sm font-medium text-slate-700 mb-2">
                Sections to include
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const selected = desiredSections.includes(category);
                  return (
                    <button
                      key={`incl-${category}`}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleDesired(category)}
                      className={pillClasses(selected)}
                    >
                      {formatCategoryLabel(category)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="block text-sm font-medium text-slate-700 mb-2">
                Sections to exclude
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const selected = excludedSections.includes(category);
                  return (
                    <button
                      key={`excl-${category}`}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleExcluded(category)}
                      className={pillClasses(selected)}
                    >
                      {formatCategoryLabel(category)}
                    </button>
                  );
                })}
              </div>
            </div>

            {sectionsError && (
              <p className="text-xs text-red-600" role="alert">
                {sectionsError}
              </p>
            )}
          </div>
        </details>

        {/* ── Contact info ──────────────────────────────────────────── */}
        <details className={detailsClasses}>
          <summary className={summaryClasses}>Contact info</summary>
          <div className="flex flex-col gap-6 pt-2 pb-4">
            <div>
              <label
                htmlFor="businessHours"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Business hours
              </label>
              <input
                id="businessHours"
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                placeholder="Mon–Fri 9am–6pm"
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, number, city, state"
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+55 11 99999-9999"
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="contact@company.com"
                className={inputClasses}
              />
            </div>
          </div>
        </details>

        {/* ── Social links ──────────────────────────────────────────── */}
        <details className={detailsClasses}>
          <summary className={summaryClasses}>Social links</summary>
          <div className="flex flex-col gap-3 pt-2 pb-4">
            {socialLinks.length === 0 && (
              <p className="text-xs text-slate-500">
                No social links yet. Add a row to include one.
              </p>
            )}

            {socialLinks.map((row, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-2 items-stretch"
              >
                <input
                  type="text"
                  aria-label={`Social platform ${index + 1}`}
                  value={row.platform}
                  onChange={(e) =>
                    updateSocialLink(index, "platform", e.target.value)
                  }
                  placeholder="Platform (e.g. Instagram)"
                  className={`${inputClasses} sm:max-w-xs`}
                />
                <input
                  type="url"
                  aria-label={`Social URL ${index + 1}`}
                  value={row.url}
                  onChange={(e) =>
                    updateSocialLink(index, "url", e.target.value)
                  }
                  placeholder="https://..."
                  className={inputClasses}
                />
                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors self-start sm:self-auto"
                >
                  Remove
                </button>
              </div>
            ))}

            <div>
              <button
                type="button"
                onClick={addSocialLink}
                className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Add row
              </button>
            </div>
          </div>
        </details>

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
