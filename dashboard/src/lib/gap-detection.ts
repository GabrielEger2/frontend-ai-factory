import type { ProjectDetail } from "@/types/project";

export interface SlotGap {
  componentId: string;
  slotName: string;
  missingField: keyof Pick<
    ProjectDetail,
    "phone" | "email" | "address" | "businessHours" | "socialLinks"
  >;
}

type BuyerField = SlotGap["missingField"];

/**
 * Mirror of agents/assembler/handler.ts BUYER_FIELD_TO_SLOT. Sync manually.
 */
const DASHBOARD_BUYER_FIELD_TO_SLOT: Record<
  string,
  Record<string, BuyerField>
> = {
  "footer-reveal-01": {
    phoneUrl: "phone",
    emailUrl: "email",
    addressText: "address",
    hoursText: "businessHours",
    socialLinks: "socialLinks",
  },
  "contact-map-info-01": {
    address: "address",
    phone: "phone",
    email: "email",
    hours: "businessHours",
  },
};

export function computeContentGaps(
  layout: string[],
  project: Pick<
    ProjectDetail,
    "phone" | "email" | "address" | "businessHours" | "socialLinks"
  >,
): SlotGap[] {
  const gaps: SlotGap[] = [];
  for (const componentId of layout) {
    const slotMap = DASHBOARD_BUYER_FIELD_TO_SLOT[componentId];
    if (!slotMap) continue;
    for (const [slotName, field] of Object.entries(slotMap)) {
      const value = project[field as BuyerField];
      const isEmpty =
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0);
      if (isEmpty) {
        gaps.push({ componentId, slotName, missingField: field as BuyerField });
      }
    }
  }
  return gaps;
}
