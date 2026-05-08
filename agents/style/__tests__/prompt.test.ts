import { buildStyleSystemPrompt, buildStyleUserPrompt } from "../prompt";
import type { StyleAgentInput } from "../types";

const VALID_MOODS = [
  "professional",
  "elegant",
  "fun",
  "serious",
  "friendly",
  "energetic",
  "calm",
  "trustworthy",
] as const;

const VALID_STYLES = [
  "modern",
  "classic",
  "editorial",
  "luxury",
  "playful",
  "minimal",
  "bold",
  "corporate",
] as const;

const FORBIDDEN_TOKENS = [
  "warm",
  "sophisticated",
  "refined",
  "vibrant",
  "approachable",
  "artisan",
] as const;

describe("buildStyleSystemPrompt", () => {
  let prompt: string;

  beforeAll(() => {
    prompt = buildStyleSystemPrompt();
  });

  it("declares all 8 canonical mood enum values verbatim", () => {
    for (const mood of VALID_MOODS) {
      expect(prompt).toContain(mood);
    }
  });

  it("declares all 8 canonical style enum values verbatim", () => {
    for (const style of VALID_STYLES) {
      expect(prompt).toContain(style);
    }
  });

  it("includes the default vertical clusters and the luxury/premium override sub-section", () => {
    expect(prompt).toMatch(/Default vertical .{0,3} tag clusters/i);
    expect(prompt).toMatch(/Luxury .{1,15} Premium qualifier/i);
  });

  it("covers the core SMB verticals", () => {
    expect(prompt).toMatch(/Padarias, cafeterias, confeitarias/);
    expect(prompt).toMatch(/Academias, crossfit/);
    expect(prompt).toMatch(/Advocacia, contabilidade/);
    expect(prompt).toMatch(/Mecânicas, oficinas/);
    expect(prompt).toMatch(/Clínicas, odontologia/);
    expect(prompt).toMatch(/Imobiliárias, corretagem/);
    expect(prompt).toMatch(/E-commerce, varejo/);
    expect(prompt).toMatch(/SaaS, tech startups/);
  });

  it("emits a luxury bakery row whose tags match the padaria-luxo-sp.jsonl ground truth", () => {
    // The fixture labels luxury bakery as: mood ∋ {elegant, friendly}, style ∋ {editorial, luxury, classic}, density medium.
    // (`warm` in the fixture is a labeling artifact and not a valid enum — do not assert on it.)
    const luxuryBakeryRow = prompt
      .split("\n")
      .find((line) =>
        /Padaria\/confeitaria.*caf[ée].*luxo.*artesanal/i.test(line),
      );
    expect(luxuryBakeryRow).toBeDefined();
    if (!luxuryBakeryRow) return;
    expect(luxuryBakeryRow).toMatch(/elegant/);
    expect(luxuryBakeryRow).toMatch(/friendly|calm/);
    expect(luxuryBakeryRow).toMatch(/editorial/);
    expect(luxuryBakeryRow).toMatch(/luxury/);
    expect(luxuryBakeryRow).toMatch(/classic/);
    expect(luxuryBakeryRow).toMatch(/medium/);
  });

  it("never emits non-enum tokens as mood or style values inside table cells", () => {
    // Table rows look like "| col | col | col |". Backtick-wrapped tokens are
    // disclaimers/quotes (e.g. "no `warm` mood") and are stripped before checking.
    // The food-palette rule's "neutral-warm" prose lives outside table rows.
    const tableRows = prompt
      .split("\n")
      .filter((line) => /^\|/.test(line) && !/^\|\s*-+/.test(line));
    for (const row of tableRows) {
      const stripped = row.replace(/`[^`]*`/g, "");
      for (const token of FORBIDDEN_TOKENS) {
        expect(stripped.toLowerCase()).not.toMatch(
          new RegExp(`\\b${token}\\b`),
        );
      }
    }
  });

  it("explicitly warns about common non-enum mistakes in the Rules section", () => {
    expect(prompt).toMatch(/Common rejected tokens.*\bwarm\b/);
    expect(prompt).toMatch(
      /\bsophisticated\b.*NOT valid|NOT valid.*\bsophisticated\b/,
    );
  });

  it("preserves the food/comfort palette rule (neutral-warm dominant; red as ACCENT only)", () => {
    expect(prompt).toMatch(/neutral-warm/);
    expect(prompt).toMatch(/ACCENT only/);
  });

  it("preserves the StyleKit, Buyer Objectives, Rules, and Output Schema sections", () => {
    expect(prompt).toMatch(/^## StyleKit Selection$/m);
    expect(prompt).toMatch(/^## Buyer Objectives$/m);
    expect(prompt).toMatch(/^## Rules$/m);
    expect(prompt).toMatch(/^## Output Schema$/m);
  });

  it("preserves the brand-color anchor rule and the monochromatic-mode constraint", () => {
    expect(prompt).toMatch(/Brand color anchoring/);
    expect(prompt).toMatch(/Monochromatic mode constraints/);
  });
});

describe("buildStyleUserPrompt", () => {
  const sampleInput = {
    projectId: "p_test_bakery",
    status: "styling",
    companyName: "Padaria Boulangerie de Paris",
    segment: "padaria",
    description:
      "Padaria de luxo em São Paulo, focada em pães artesanais e patisserie francesa.",
    brandToneKeywords: ["elegant", "boutique"],
    objectives: ["brand_awareness"],
    researchOutput: {
      companySummary: "Padaria artesanal premium com foco em técnica francesa.",
      segment: "padaria-luxo",
      targetAudience: "público AAA, casais 30-55 em bairros nobres",
      toneKeywords: ["elegante", "artesanal", "refinado", "boutique"],
      competitorInsights:
        "Concorrentes diretos posicionam-se como cafés gourmet.",
      differentiators:
        "Mestre boulanger formado em Paris; massas com 24h de fermentação.",
    },
    taskToken: "task-token-test",
  } as unknown as StyleAgentInput;

  it("renders company brief, research output, brand-tone, and objectives sections", () => {
    const userPrompt = buildStyleUserPrompt(sampleInput, []);
    expect(userPrompt).toContain("Padaria Boulangerie de Paris");
    expect(userPrompt).toContain("Padaria de luxo em São Paulo");
    expect(userPrompt).toContain("Tone Keywords:");
    expect(userPrompt).toContain("elegante, artesanal, refinado");
    expect(userPrompt).toContain("brand_awareness");
    expect(userPrompt).toContain("- elegant");
    expect(userPrompt).toContain("- boutique");
  });

  it("omits the brandColor anchor section when no brandColor is supplied", () => {
    const userPrompt = buildStyleUserPrompt(sampleInput, []);
    expect(userPrompt).not.toContain("Brand Color (Mandatory Anchor)");
  });
});
