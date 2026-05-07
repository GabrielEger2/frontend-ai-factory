"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  Music2,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { createProject } from "@/lib/actions/create-project";
import { SUPPORTED_SEGMENTS, SEGMENT_LABELS } from "@/types/project";
import {
  TONE_KEYWORDS,
  COMPANY_SIZES,
  RANKED_OBJECTIVE_IDS,
  RANKED_OBJECTIVE_LABELS,
  PRIMARY_CTA_OPTIONS,
  PRIMARY_CTA_LABELS,
  type CompanySize,
  type PrimaryCta,
} from "@/lib/constants";
import { selectableCategories } from "@/lib/manifest-utils";
import { FormProgressSidebar } from "./_components/FormProgressSidebar";

/* ─── Validators ─────────────────────────────────────────────────── */
const HEX_RE = /^#?[0-9a-fA-F]{6}$/;
const PHONE_RE = /^[\d\s\-()+]{8,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_RE = /^\d{5}-?\d{3}$/;
const URL_RE = /^https?:\/\/.+/i;

/* ─── Page-type options (closed enum mirrored from agents) ───────── */
const PAGE_TYPES = [
  "landing",
  "store",
  "portfolio",
  "services",
  "about",
] as const;
const PAGE_TYPE_LABELS: Record<(typeof PAGE_TYPES)[number], string> = {
  landing: "Landing Page",
  store: "Store / E-commerce",
  portfolio: "Portfolio",
  services: "Services",
  about: "About / Institutional",
};

/* ─── Day-of-week table ──────────────────────────────────────────── */
const DAYS = [
  { id: "mon", short: "Mon", full: "Monday" },
  { id: "tue", short: "Tue", full: "Tuesday" },
  { id: "wed", short: "Wed", full: "Wednesday" },
  { id: "thu", short: "Thu", full: "Thursday" },
  { id: "fri", short: "Fri", full: "Friday" },
  { id: "sat", short: "Sat", full: "Saturday" },
  { id: "sun", short: "Sun", full: "Sunday" },
] as const;
type DayId = (typeof DAYS)[number]["id"];

interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

const EMPTY_HOURS: Record<DayId, DayHours> = {
  mon: { open: "", close: "", closed: false },
  tue: { open: "", close: "", closed: false },
  wed: { open: "", close: "", closed: false },
  thu: { open: "", close: "", closed: false },
  fri: { open: "", close: "", closed: false },
  sat: { open: "", close: "", closed: false },
  sun: { open: "", close: "", closed: false },
};

/* ─── Brazilian states (Brazil-only target market for SiteGen) ───── */
const BR_STATES = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;

/* ─── Address model ──────────────────────────────────────────────── */
interface AddressInput {
  zip: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

const EMPTY_ADDRESS: AddressInput = {
  zip: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

/* ─── Social platforms (icon-driven select) ──────────────────────── */
interface SocialPlatform {
  id: string;
  label: string;
  icon: LucideIcon;
  placeholder: string;
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    placeholder: "https://instagram.com/handle",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: Facebook,
    placeholder: "https://facebook.com/page",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    placeholder: "https://linkedin.com/company/...",
  },
  {
    id: "twitter",
    label: "Twitter / X",
    icon: Twitter,
    placeholder: "https://x.com/handle",
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: Youtube,
    placeholder: "https://youtube.com/@channel",
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: Music2,
    placeholder: "https://tiktok.com/@handle",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    placeholder: "https://wa.me/5511999999999",
  },
  {
    id: "website",
    label: "Website",
    icon: Globe,
    placeholder: "https://example.com",
  },
];

interface SocialLinkRow {
  platform: string;
  url: string;
}

function formatCategoryLabel(category: string): string {
  return category
    .split("/")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" / ");
}

/* ─── Address → single-line string ───────────────────────────────── */
function formatAddress(a: AddressInput): string {
  const streetLine = [a.street.trim(), a.number.trim()]
    .filter(Boolean)
    .join(", ");
  const cityState = [a.city.trim(), a.state.trim()].filter(Boolean).join(" - ");
  return [
    streetLine,
    a.complement.trim(),
    a.neighborhood.trim(),
    cityState,
    a.zip.trim(),
  ]
    .filter(Boolean)
    .join(", ");
}

function isAddressEmpty(a: AddressInput): boolean {
  return Object.values(a).every((v) => !v.trim());
}

/* ─── Business hours → readable string with consecutive grouping ─── */
function formatBusinessHours(hours: Record<DayId, DayHours>): string {
  type Segment = { from: DayId; to: DayId; signature: string; label: string };
  const segments: Segment[] = [];
  let current: Segment | null = null;

  for (const day of DAYS) {
    const h = hours[day.id];
    let signature: string | null = null;
    let label = "";
    if (h.closed) {
      signature = "closed";
      label = "closed";
    } else if (h.open && h.close) {
      signature = `${h.open}-${h.close}`;
      label = `${h.open}–${h.close}`;
    }
    if (signature === null) {
      if (current) {
        segments.push(current);
        current = null;
      }
      continue;
    }
    if (current && current.signature === signature) {
      current.to = day.id;
    } else {
      if (current) segments.push(current);
      current = { from: day.id, to: day.id, signature, label };
    }
  }
  if (current) segments.push(current);

  return segments
    .map((s) => {
      const fromShort = DAYS.find((d) => d.id === s.from)!.short;
      const toShort = DAYS.find((d) => d.id === s.to)!.short;
      const range = s.from === s.to ? fromShort : `${fromShort}–${toShort}`;
      return `${range} ${s.label}`;
    })
    .join(", ");
}

function isHoursEmpty(hours: Record<DayId, DayHours>): boolean {
  return DAYS.every((d) => {
    const h = hours[d.id];
    return !h.closed && !h.open && !h.close;
  });
}

export default function NewProjectPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Company basics
  const [companyName, setCompanyName] = useState("");
  const [segment, setSegment] = useState("");
  const [niche, setNiche] = useState("");
  const [region, setRegion] = useState("");
  const [companySize, setCompanySize] = useState<CompanySize | "">("");
  const [pageType, setPageType] = useState<
    "landing" | "store" | "portfolio" | "services" | "about" | ""
  >("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hasBrandColor, setHasBrandColor] = useState(false);
  const [brandColor, setBrandColor] = useState("#000000");
  const [brandColorHexInput, setBrandColorHexInput] = useState("#000000");
  const [brandColorError, setBrandColorError] = useState<string | null>(null);

  // Brand & tone
  const [brandToneKeywords, setBrandToneKeywords] = useState<string[]>([]);
  const [rankedObjectives, setRankedObjectives] = useState<
    Array<{ id: string; rank: number }>
  >([]);
  const [primaryCta, setPrimaryCta] = useState<PrimaryCta | "">("");

  // Offer
  const [mainService, setMainService] = useState("");
  const [whatMakesSpecial, setWhatMakesSpecial] = useState<string[]>([
    "",
    "",
    "",
  ]);
  const [whatMakesSpecialErrors, setWhatMakesSpecialErrors] = useState<
    Record<number, string>
  >({});
  const [keyResults, setKeyResults] = useState("");

  // Site sections
  const [desiredSections, setDesiredSections] = useState<string[]>([]);
  const [sectionsError, setSectionsError] = useState<string | null>(null);

  // Contact info — structured
  const [businessHours, setBusinessHours] =
    useState<Record<DayId, DayHours>>(EMPTY_HOURS);
  const [address, setAddress] = useState<AddressInput>(EMPTY_ADDRESS);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailValue, setEmailValue] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [zipError, setZipError] = useState<string | null>(null);

  // Social links
  const [socialLinks, setSocialLinks] = useState<SocialLinkRow[]>([]);
  const [socialErrors, setSocialErrors] = useState<Record<number, string>>({});

  const categories = useMemo(() => selectableCategories(), []);

  const sections = useMemo(() => {
    const defs = [
      {
        id: "company",
        label: "Company basics",
        isDone: Boolean(companyName.trim() && segment && description.trim()),
      },
      {
        id: "brand",
        label: "Brand & tone",
        isDone: brandToneKeywords.length > 0 || rankedObjectives.length > 0,
      },
      {
        id: "offer",
        label: "Offer",
        isDone: Boolean(mainService.trim()),
      },
      {
        id: "sections",
        label: "Site sections",
        isDone: desiredSections.length > 0,
      },
      {
        id: "contact",
        label: "Contact info",
        isDone: Boolean(
          phone.trim() ||
          emailValue.trim() ||
          address.street.trim() ||
          address.zip.trim() ||
          address.city.trim(),
        ),
      },
    ];
    let foundActive = false;
    return defs.map((d) => {
      if (d.isDone) return { ...d, state: "done" as const };
      if (!foundActive) {
        foundActive = true;
        return { ...d, state: "active" as const };
      }
      return { ...d, state: "pending" as const };
    });
  }, [
    companyName,
    segment,
    description,
    brandToneKeywords,
    rankedObjectives,
    mainService,
    desiredSections,
    phone,
    emailValue,
    address.street,
    address.zip,
    address.city,
  ]);

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

  function updateBullet(index: number, value: string) {
    setWhatMakesSpecial((prev) =>
      prev.map((b, i) => (i === index ? value : b)),
    );
    setWhatMakesSpecialErrors((prev) => {
      const { [index]: _omit, ...rest } = prev;
      return rest;
    });
  }

  function addBullet() {
    setWhatMakesSpecial((prev) => (prev.length < 5 ? [...prev, ""] : prev));
  }

  function removeBullet(index: number) {
    setWhatMakesSpecial((prev) =>
      prev.length > 3 ? prev.filter((_, i) => i !== index) : prev,
    );
    setWhatMakesSpecialErrors((prev) => {
      const { [index]: _omit, ...rest } = prev;
      return rest;
    });
  }

  function toggleRankedObjective(id: string) {
    setRankedObjectives((prev) => {
      const existing = prev.find((o) => o.id === id);
      if (existing) {
        return prev
          .filter((o) => o.id !== id)
          .sort((a, b) => a.rank - b.rank)
          .map((o, i) => ({ id: o.id, rank: i + 1 }));
      }
      return [...prev, { id, rank: prev.length + 1 }];
    });
  }

  function moveRankedObjective(id: string, direction: "up" | "down") {
    setRankedObjectives((prev) => {
      const sorted = [...prev].sort((a, b) => a.rank - b.rank);
      const idx = sorted.findIndex((o) => o.id === id);
      if (idx === -1) return prev;
      const swapWith = direction === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= sorted.length) return prev;
      const reordered = [...sorted];
      [reordered[idx], reordered[swapWith]] = [
        reordered[swapWith],
        reordered[idx],
      ];
      return reordered.map((o, i) => ({ id: o.id, rank: i + 1 }));
    });
  }

  function toggleDesired(category: string) {
    setSectionsError(null);
    setDesiredSections((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  }

  function updateAddress<K extends keyof AddressInput>(key: K, value: string) {
    setAddress((prev) => ({ ...prev, [key]: value }));
    if (key === "zip") setZipError(null);
  }

  function updateHours(day: DayId, patch: Partial<DayHours>) {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], ...patch },
    }));
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
    setSocialErrors((prev) => {
      const { [index]: _omit, ...rest } = prev;
      return rest;
    });
  }

  function removeSocialLink(index: number) {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
    setSocialErrors((prev) => {
      const { [index]: _omit, ...rest } = prev;
      return rest;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSectionsError(null);

    if (hasBrandColor && brandColorError) return;

    // Phone validation
    let phoneErr: string | null = null;
    const phoneTrim = phone.trim();
    if (phoneTrim && !PHONE_RE.test(phoneTrim)) {
      phoneErr = "Use digits, spaces, +, -, ( ) only (8–20 chars).";
    }
    setPhoneError(phoneErr);

    // Email validation
    let emailErr: string | null = null;
    const emailTrim = emailValue.trim();
    if (emailTrim && !EMAIL_RE.test(emailTrim)) {
      emailErr = "Enter a valid email like name@company.com.";
    }
    setEmailError(emailErr);

    // ZIP validation (only if ZIP field is non-empty)
    let zipErr: string | null = null;
    if (address.zip.trim() && !ZIP_RE.test(address.zip.trim())) {
      zipErr = "ZIP must be 8 digits, e.g. 01234-567.";
    }
    setZipError(zipErr);

    // Social link validation
    const newSocialErrors: Record<number, string> = {};
    socialLinks.forEach((row, i) => {
      const url = row.url.trim();
      const platform = row.platform.trim();
      if (!url && !platform) return;
      if (!platform) newSocialErrors[i] = "Pick a platform.";
      else if (!url) newSocialErrors[i] = "Add a URL.";
      else if (!URL_RE.test(url))
        newSocialErrors[i] = "URL must start with http:// or https://.";
    });
    setSocialErrors(newSocialErrors);

    // What makes special — bullet length validation
    const newBulletErrors: Record<number, string> = {};
    whatMakesSpecial.forEach((bullet, i) => {
      if (bullet.trim().length > 120) {
        newBulletErrors[i] = "Keep each bullet under 120 characters.";
      }
    });
    setWhatMakesSpecialErrors(newBulletErrors);

    if (
      phoneErr ||
      emailErr ||
      zipErr ||
      Object.keys(newSocialErrors).length > 0 ||
      Object.keys(newBulletErrors).length > 0
    ) {
      return;
    }

    const cleanedSocialLinks = socialLinks
      .map((row) => ({ platform: row.platform.trim(), url: row.url.trim() }))
      .filter((row) => row.platform.length > 0 && row.url.length > 0);

    const addressString = isAddressEmpty(address)
      ? undefined
      : formatAddress(address);
    const hoursString = isHoursEmpty(businessHours)
      ? undefined
      : formatBusinessHours(businessHours) || undefined;

    startTransition(async () => {
      const result = await createProject({
        companyName,
        segment,
        niche: niche.trim() || undefined,
        region: region.trim() || undefined,
        companySize: companySize || undefined,
        pageType: pageType || undefined,
        description,
        brandColor: hasBrandColor ? brandColor : undefined,
        brandToneKeywords:
          brandToneKeywords.length > 0 ? brandToneKeywords : undefined,
        objectives:
          rankedObjectives.length > 0
            ? [...rankedObjectives]
                .sort((a, b) => a.rank - b.rank)
                .map((o) => o.id)
            : undefined,
        rankedObjectives:
          rankedObjectives.length > 0 ? rankedObjectives : undefined,
        primaryCta: primaryCta || undefined,
        mainService: mainService.trim() || undefined,
        whatMakesSpecial:
          whatMakesSpecial.map((s) => s.trim()).filter(Boolean).length > 0
            ? whatMakesSpecial.map((s) => s.trim()).filter(Boolean)
            : undefined,
        keyResults: keyResults.trim() || undefined,
        desiredSections:
          desiredSections.length > 0 ? desiredSections : undefined,
        businessHours: hoursString,
        address: addressString,
        phone: phoneTrim || undefined,
        email: emailTrim || undefined,
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

  /* ─── Shared classes ─────────────────────────────────────────── */
  const inputClasses =
    "w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1";
  const errorTextClasses = "text-xs text-red-600 mt-1";
  const sectionClasses = "px-6 py-8 sm:px-8";
  const sectionTitleClasses = "text-base font-semibold text-slate-900";
  const sectionSubtitleClasses = "text-sm text-slate-500 mt-1";
  const sectionHeaderClasses = "mb-6";
  const pillClasses = (selected: boolean) =>
    selected
      ? "rounded-full px-3 py-1 text-xs font-medium bg-slate-900 text-white transition-colors"
      : "rounded-full px-3 py-1 text-xs font-medium border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors";

  return (
    <div className="mx-auto pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">New Project</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tell us about the company. The AI will generate a complete website
          based on these details.
        </p>
      </div>

      <div className="flex gap-8 items-start">
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm divide-y divide-slate-200"
        >
          {/* ── Company basics ─────────────────────────────────────── */}
          <section className={sectionClasses}>
            <header className={sectionHeaderClasses}>
              <h2 className={sectionTitleClasses}>Company basics</h2>
              <p className={sectionSubtitleClasses}>
                Core information used by every agent in the pipeline.
              </p>
            </header>
            <div className="flex flex-col gap-6">
              <div>
                <label htmlFor="companyName" className={labelClasses}>
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
                <label htmlFor="segment" className={labelClasses}>
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
                <label htmlFor="niche" className={labelClasses}>
                  Niche
                </label>
                <input
                  id="niche"
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g. artisan bakery, enterprise SaaS"
                  className={inputClasses}
                />
                <p className="text-xs text-slate-500 mt-1">
                  More specific than segment. Optional.
                </p>
              </div>

              <div>
                <label htmlFor="region" className={labelClasses}>
                  Region
                </label>
                <input
                  id="region"
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. São Paulo, SP"
                  className={inputClasses}
                />
              </div>

              <div>
                <label htmlFor="companySize" className={labelClasses}>
                  Company size
                </label>
                <select
                  id="companySize"
                  value={companySize}
                  onChange={(e) =>
                    setCompanySize(e.target.value as CompanySize | "")
                  }
                  className={inputClasses}
                >
                  <option value="">Select a company size...</option>
                  {COMPANY_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="pageType" className={labelClasses}>
                  Page type
                </label>
                <select
                  id="pageType"
                  value={pageType}
                  onChange={(e) =>
                    setPageType(
                      e.target.value as
                        | "landing"
                        | "store"
                        | "portfolio"
                        | "services"
                        | "about"
                        | "",
                    )
                  }
                  className={inputClasses}
                >
                  <option value="">Select a page type...</option>
                  {PAGE_TYPES.map((pt) => (
                    <option key={pt} value={pt}>
                      {PAGE_TYPE_LABELS[pt]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className={labelClasses}>
                  Description
                </label>
                <textarea
                  id="description"
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What the company does, who it serves, what makes it different. The more specific, the better the AI output."
                  className={inputClasses}
                />
              </div>

              <div>
                <fieldset className="flex flex-col gap-2">
                  <legend className={labelClasses}>
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
                      <p className={errorTextClasses} role="alert">
                        {brandColorError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── Brand & tone ───────────────────────────────────────── */}
          <section className={sectionClasses}>
            <header className={sectionHeaderClasses}>
              <h2 className={sectionTitleClasses}>Brand &amp; tone</h2>
              <p className={sectionSubtitleClasses}>
                Shapes the voice and visual mood of the generated copy.
              </p>
            </header>
            <div className="flex flex-col gap-6">
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
                  Objectives (ranked)
                </p>
                <p className="text-xs text-slate-500 mb-2">
                  Pick what the website should achieve, then order by priority.
                </p>
                <div className="flex flex-wrap gap-2">
                  {RANKED_OBJECTIVE_IDS.map((id) => {
                    const selected = rankedObjectives.some((o) => o.id === id);
                    return (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleRankedObjective(id)}
                        className={pillClasses(selected)}
                      >
                        {RANKED_OBJECTIVE_LABELS[id]}
                      </button>
                    );
                  })}
                </div>

                {rankedObjectives.length > 0 && (
                  <ol className="mt-3 flex flex-col gap-1.5">
                    {[...rankedObjectives]
                      .sort((a, b) => a.rank - b.rank)
                      .map((obj, idx, arr) => (
                        <li
                          key={obj.id}
                          className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5"
                        >
                          <span className="text-xs font-semibold text-slate-500 w-6">
                            #{obj.rank}
                          </span>
                          <span className="text-sm text-slate-800 flex-1">
                            {RANKED_OBJECTIVE_LABELS[
                              obj.id as keyof typeof RANKED_OBJECTIVE_LABELS
                            ] ?? obj.id}
                          </span>
                          <button
                            type="button"
                            aria-label={`Move ${obj.id} up`}
                            onClick={() => moveRankedObjective(obj.id, "up")}
                            disabled={idx === 0}
                            className="rounded border border-slate-300 px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            aria-label={`Move ${obj.id} down`}
                            onClick={() => moveRankedObjective(obj.id, "down")}
                            disabled={idx === arr.length - 1}
                            className="rounded border border-slate-300 px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                          >
                            ↓
                          </button>
                        </li>
                      ))}
                  </ol>
                )}
              </div>

              <div>
                <fieldset className="flex flex-col gap-2">
                  <legend className="block text-sm font-medium text-slate-700 mb-1">
                    Primary call-to-action
                  </legend>
                  <p className="text-xs text-slate-500 mb-2">
                    What is the single most important action for visitors?
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {PRIMARY_CTA_OPTIONS.map((cta) => (
                      <label
                        key={cta}
                        className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="primaryCta"
                          value={cta}
                          checked={primaryCta === cta}
                          onChange={() => setPrimaryCta(cta)}
                          className="accent-slate-900"
                        />
                        {PRIMARY_CTA_LABELS[cta]}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
          </section>

          {/* ── Offer ──────────────────────────────────────────────── */}
          <section className={sectionClasses}>
            <header className={sectionHeaderClasses}>
              <h2 className={sectionTitleClasses}>Offer</h2>
              <p className={sectionSubtitleClasses}>
                Describe what you sell and what makes it worth choosing.
              </p>
            </header>
            <div className="flex flex-col gap-6">
              <div>
                <label htmlFor="mainService" className={labelClasses}>
                  Main service
                </label>
                <input
                  id="mainService"
                  type="text"
                  value={mainService}
                  onChange={(e) => setMainService(e.target.value)}
                  placeholder="The headline thing you sell or do"
                  className={inputClasses}
                />
              </div>

              <div>
                <p className="block text-sm font-medium text-slate-700 mb-1">
                  What makes you special
                </p>
                <p className="text-xs text-slate-500 mb-2">
                  3 to 5 short bullets. Max 120 characters each.
                </p>
                <div className="flex flex-col gap-2">
                  {whatMakesSpecial.map((bullet, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          aria-label={`Bullet ${i + 1}`}
                          value={bullet}
                          onChange={(e) => updateBullet(i, e.target.value)}
                          maxLength={120}
                          placeholder={`Bullet ${i + 1}`}
                          className={inputClasses}
                        />
                        {whatMakesSpecial.length > 3 && (
                          <button
                            type="button"
                            onClick={() => removeBullet(i)}
                            aria-label={`Remove bullet ${i + 1}`}
                            className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      {whatMakesSpecialErrors[i] && (
                        <p className={errorTextClasses} role="alert">
                          {whatMakesSpecialErrors[i]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {whatMakesSpecial.length < 5 && (
                  <button
                    type="button"
                    onClick={addBullet}
                    className="mt-2 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    + Add bullet
                  </button>
                )}
              </div>

              <div>
                <label htmlFor="keyResults" className={labelClasses}>
                  Key results <span className="text-slate-400">(optional)</span>
                </label>
                <textarea
                  id="keyResults"
                  rows={3}
                  value={keyResults}
                  onChange={(e) => setKeyResults(e.target.value)}
                  placeholder="Stats, proof-points or outcomes (used for stats sections)"
                  className={inputClasses}
                />
              </div>
            </div>
          </section>

          {/* ── Site sections ──────────────────────────────────────── */}
          <section className={sectionClasses}>
            <header className={sectionHeaderClasses}>
              <h2 className={sectionTitleClasses}>Site sections</h2>
              <p className={sectionSubtitleClasses}>
                Pick which kinds of sections must appear in the generated site.
                Navigation and footer are always included.
              </p>
            </header>
            <div className="flex flex-col gap-6">
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

              {sectionsError && (
                <p className={errorTextClasses} role="alert">
                  {sectionsError}
                </p>
              )}
            </div>
          </section>

          {/* ── Contact info ───────────────────────────────────────── */}
          <section className={sectionClasses}>
            <header className={sectionHeaderClasses}>
              <h2 className={sectionTitleClasses}>Contact info</h2>
              <p className={sectionSubtitleClasses}>
                Optional. Used to populate the contact and footer sections of
                the generated site.
              </p>
            </header>
            <div className="flex flex-col gap-6">
              {/* Phone & email side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className={labelClasses}>
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneError(null);
                    }}
                    placeholder="+55 11 99999-9999"
                    aria-invalid={phoneError ? "true" : "false"}
                    className={inputClasses}
                  />
                  {phoneError && (
                    <p className={errorTextClasses} role="alert">
                      {phoneError}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className={labelClasses}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={emailValue}
                    onChange={(e) => {
                      setEmailValue(e.target.value);
                      setEmailError(null);
                    }}
                    placeholder="contact@company.com"
                    aria-invalid={emailError ? "true" : "false"}
                    className={inputClasses}
                  />
                  {emailError && (
                    <p className={errorTextClasses} role="alert">
                      {emailError}
                    </p>
                  )}
                </div>
              </div>

              {/* Address — structured */}
              <div className="flex flex-col gap-3">
                <p className="block text-sm font-medium text-slate-700">
                  Address
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="addr-zip"
                      className="text-xs text-slate-600"
                    >
                      ZIP
                    </label>
                    <input
                      id="addr-zip"
                      type="text"
                      inputMode="numeric"
                      value={address.zip}
                      onChange={(e) => updateAddress("zip", e.target.value)}
                      placeholder="01234-567"
                      className={inputClasses}
                    />
                    {zipError && (
                      <p className={errorTextClasses} role="alert">
                        {zipError}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="addr-street"
                      className="text-xs text-slate-600"
                    >
                      Street
                    </label>
                    <input
                      id="addr-street"
                      type="text"
                      value={address.street}
                      onChange={(e) => updateAddress("street", e.target.value)}
                      placeholder="Av. Paulista"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label
                      htmlFor="addr-number"
                      className="text-xs text-slate-600"
                    >
                      Number
                    </label>
                    <input
                      id="addr-number"
                      type="text"
                      value={address.number}
                      onChange={(e) => updateAddress("number", e.target.value)}
                      placeholder="1234"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="addr-complement"
                      className="text-xs text-slate-600"
                    >
                      Complement
                    </label>
                    <input
                      id="addr-complement"
                      type="text"
                      value={address.complement}
                      onChange={(e) =>
                        updateAddress("complement", e.target.value)
                      }
                      placeholder="Apt 5"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="addr-neighborhood"
                      className="text-xs text-slate-600"
                    >
                      Neighborhood
                    </label>
                    <input
                      id="addr-neighborhood"
                      type="text"
                      value={address.neighborhood}
                      onChange={(e) =>
                        updateAddress("neighborhood", e.target.value)
                      }
                      placeholder="Bela Vista"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="addr-city"
                      className="text-xs text-slate-600"
                    >
                      City
                    </label>
                    <input
                      id="addr-city"
                      type="text"
                      value={address.city}
                      onChange={(e) => updateAddress("city", e.target.value)}
                      placeholder="São Paulo"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="addr-state"
                      className="text-xs text-slate-600"
                    >
                      State
                    </label>
                    <select
                      id="addr-state"
                      value={address.state}
                      onChange={(e) => updateAddress("state", e.target.value)}
                      className={inputClasses}
                    >
                      <option value="">—</option>
                      {BR_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Business hours — day-by-day grid */}
              <div className="flex flex-col gap-2">
                <p className="block text-sm font-medium text-slate-700">
                  Business hours
                </p>
                <div className="rounded-md border border-slate-200 divide-y divide-slate-200">
                  {DAYS.map((day) => {
                    const h = businessHours[day.id];
                    return (
                      <div
                        key={day.id}
                        className="flex flex-wrap items-center gap-3 px-3 py-2"
                      >
                        <span className="w-12 text-sm font-medium text-slate-700">
                          {day.short}
                        </span>
                        <input
                          type="time"
                          aria-label={`${day.full} open`}
                          value={h.open}
                          disabled={h.closed}
                          onChange={(e) =>
                            updateHours(day.id, { open: e.target.value })
                          }
                          className="border border-slate-300 rounded-md px-2 py-1 text-sm disabled:bg-slate-50 disabled:text-slate-400"
                        />
                        <span className="text-slate-400 text-sm">–</span>
                        <input
                          type="time"
                          aria-label={`${day.full} close`}
                          value={h.close}
                          disabled={h.closed}
                          onChange={(e) =>
                            updateHours(day.id, { close: e.target.value })
                          }
                          className="border border-slate-300 rounded-md px-2 py-1 text-sm disabled:bg-slate-50 disabled:text-slate-400"
                        />
                        <label className="ml-auto flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={h.closed}
                            onChange={(e) =>
                              updateHours(day.id, {
                                closed: e.target.checked,
                                ...(e.target.checked
                                  ? { open: "", close: "" }
                                  : {}),
                              })
                            }
                            className="accent-slate-900"
                          />
                          Closed
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* ── Social links ───────────────────────────────────────── */}
          <section className={sectionClasses}>
            <header className={sectionHeaderClasses}>
              <h2 className={sectionTitleClasses}>Social links</h2>
              <p className={sectionSubtitleClasses}>
                Add any social profiles to surface in the footer.
              </p>
            </header>
            <div className="flex flex-col gap-3">
              {socialLinks.length === 0 && (
                <p className="text-xs text-slate-500">
                  No social links yet. Add a row to include one.
                </p>
              )}

              {socialLinks.map((row, index) => {
                const platform = SOCIAL_PLATFORMS.find(
                  (p) => p.id === row.platform,
                );
                const Icon = platform?.icon ?? Globe;
                return (
                  <div key={index} className="flex flex-col gap-1">
                    <div className="flex flex-col sm:flex-row gap-2 items-stretch">
                      <div className="flex items-center gap-2 sm:w-56">
                        <Icon
                          className="h-5 w-5 text-slate-500 shrink-0"
                          aria-hidden
                        />
                        <select
                          aria-label={`Social platform ${index + 1}`}
                          value={row.platform}
                          onChange={(e) =>
                            updateSocialLink(index, "platform", e.target.value)
                          }
                          className={inputClasses}
                        >
                          <option value="">Select platform…</option>
                          {SOCIAL_PLATFORMS.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="url"
                        aria-label={`Social URL ${index + 1}`}
                        value={row.url}
                        onChange={(e) =>
                          updateSocialLink(index, "url", e.target.value)
                        }
                        placeholder={platform?.placeholder ?? "https://..."}
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
                    {socialErrors[index] && (
                      <p className={errorTextClasses} role="alert">
                        {socialErrors[index]}
                      </p>
                    )}
                  </div>
                );
              })}

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
          </section>

          {/* ── Footer ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3 px-6 py-5 sm:px-8 bg-slate-50 rounded-b-lg">
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="bg-slate-900 text-white px-5 py-2 rounded-md hover:bg-slate-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Generating..." : "Generate Website"}
              </button>
            </div>
          </div>
        </form>
        <FormProgressSidebar sections={sections} />
      </div>
    </div>
  );
}
