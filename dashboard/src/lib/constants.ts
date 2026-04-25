/**
 * Controlled vocabularies shared across the dashboard form surfaces.
 *
 * Mirror of `agents/shared/constants.ts` — keep in sync with
 * agents/shared/constants.ts. The agent-side file is the source of truth;
 * any change there must be reflected here (and vice versa).
 */

export const TONE_KEYWORDS = [
  "confident",
  "reserved",
  "formal",
  "friendly",
  "playful",
  "serious",
  "energetic",
  "calm",
  "bold",
  "trustworthy",
] as const;

export const OBJECTIVES = [
  "more_leads",
  "drive_whatsapp",
  "showcase_portfolio",
  "increase_signups",
  "brand_awareness",
  "drive_purchases",
  "support_inquiries",
] as const;

export const STYLE_TAGS = [
  "modern",
  "classic",
  "editorial",
  "luxury",
  "playful",
  "minimal",
  "bold",
  "corporate",
] as const;

export const MOOD_TAGS = [
  "professional",
  "elegant",
  "fun",
  "serious",
  "friendly",
  "energetic",
  "calm",
  "trustworthy",
] as const;

export type ToneKeyword = (typeof TONE_KEYWORDS)[number];
export type Objective = (typeof OBJECTIVES)[number];
export type StyleTag = (typeof STYLE_TAGS)[number];
export type MoodTag = (typeof MOOD_TAGS)[number];
