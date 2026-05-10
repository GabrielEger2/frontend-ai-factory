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
    // Only inspect mood/style cluster tables — those tables have `| mood |`
    // AND `| style |` column headers and risk leaking non-enum tokens into the
    // mood/style cells the LLM imitates. Prose tables added by Color Quality
    // v2 (Forbidden Zones, Saturation Buckets) describe color characteristics
    // and legitimately use words like "warm" in descriptive prose — they are
    // not enum value sources and must not be checked here.
    // Backtick-wrapped tokens are stripped (disclaimers like "no `warm` mood").
    const lines = prompt.split("\n");
    const moodStyleTableRows: string[] = [];
    let inMoodStyleTable = false;
    for (const line of lines) {
      const isTableLine = /^\|/.test(line);
      if (!isTableLine) {
        inMoodStyleTable = false;
        continue;
      }
      const header = line.toLowerCase();
      const isHeaderRow =
        header.includes("| mood ") && header.includes("| style ");
      if (isHeaderRow) {
        inMoodStyleTable = true;
        continue;
      }
      if (/^\|\s*-+/.test(line)) continue; // separator row
      if (inMoodStyleTable) {
        moodStyleTableRows.push(line);
      }
    }
    expect(moodStyleTableRows.length).toBeGreaterThan(0);
    for (const row of moodStyleTableRows) {
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

  it("includes a vertical field in the Output Schema block", () => {
    const outputSchemaStart = prompt.indexOf("## Output Schema");
    expect(outputSchemaStart).toBeGreaterThan(-1);
    expect(prompt.slice(outputSchemaStart)).toContain('"vertical"');
  });

  it("includes the vertical extraction instruction with canonical token list", () => {
    expect(prompt).toMatch(/\*\*vertical\*\*/i);
    expect(prompt).toContain("bakery-luxe");
    expect(prompt).toContain("legal-consulting");
    expect(prompt).toContain("atelier-luxe");
    expect(prompt).toContain("hospitality-luxe");
  });

  it("instructs empty array for cross-vertical/unknown briefs", () => {
    expect(prompt).toMatch(/\[\]/);
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

/* ------------------------------------------------------------------ */
/*  Color Quality v2 — new prompt sections                             */
/* ------------------------------------------------------------------ */

function buildMinimalStyleInput(
  overrides: Partial<StyleAgentInput> = {},
): StyleAgentInput {
  return {
    projectId: "p_test_minimal",
    status: "styling",
    companyName: "Acme Co.",
    segment: "agencia",
    description: "Agência minimal para testes.",
    brandColor: null,
    colorsToAvoid: null,
    brandToneKeywords: [],
    objectives: [],
    researchOutput: {
      companySummary: "Empresa de teste.",
      segment: "agencia",
      targetAudience: "público geral",
      toneKeywords: ["modern"],
      competitorInsights: "n/a",
      differentiators: "n/a",
    },
    taskToken: "task-token-minimal",
    ...overrides,
  } as unknown as StyleAgentInput;
}

describe("Color Quality v2 — new prompt sections", () => {
  let systemPrompt: string;

  beforeAll(() => {
    systemPrompt = buildStyleSystemPrompt();
  });

  it("T1 — includes Vertical Color Forbidden Zones with wellness row", () => {
    expect(systemPrompt).toContain("## Vertical Color Forbidden Zones");
    expect(systemPrompt).toContain("wellness");
    expect(systemPrompt).toContain("NEVER neon, electric, or fluorescent");
  });

  it("T2 — includes Per-Mood Saturation Buckets with all four bucket labels", () => {
    expect(systemPrompt).toContain("## Per-Mood Saturation Buckets");
    expect(systemPrompt).toContain("muted");
    expect(systemPrompt).toContain("vivid");
    expect(systemPrompt).toContain("restrained");
    expect(systemPrompt).toContain("pastel");
  });

  it("T3 — includes Color Character Principles with chroma and lime-green failure mode", () => {
    expect(systemPrompt).toContain("## Color Character Principles");
    expect(systemPrompt).toContain("Chroma defines mood");
    expect(systemPrompt).toContain("lime-green failure mode");
  });

  it("T4 — includes brand-vs-forbidden-zone carve-out", () => {
    expect(systemPrompt).toContain("Brand color exception");
    expect(systemPrompt).toContain("Rule 8 wins");
  });

  it("T5 — includes Seller-Specified Colors to Avoid hard-rule section in system prompt", () => {
    expect(systemPrompt).toContain("### Seller-Specified Colors to Avoid");
    expect(systemPrompt).toContain("near-perceptual");
    expect(systemPrompt.toLowerCase()).toContain("self-verify");
  });

  it("T6 — renders colorsToAvoid user-prompt section when list is non-empty", () => {
    const input = buildMinimalStyleInput({
      colorsToAvoid: ["lime green", "neon green", "#C8F078"],
    });
    const userPrompt = buildStyleUserPrompt(input, []);
    expect(userPrompt).toContain("Seller-Specified Colors to Avoid");
    expect(userPrompt).toContain("lime green");
    expect(userPrompt).toContain("#C8F078");
  });

  it("T7 — omits colorsToAvoid section when value is null", () => {
    const input = buildMinimalStyleInput({ colorsToAvoid: null });
    const userPrompt = buildStyleUserPrompt(input, []);
    expect(userPrompt).not.toContain("Seller-Specified Colors to Avoid");
  });

  it("T8 — omits colorsToAvoid section when value is an empty array", () => {
    const input = buildMinimalStyleInput({ colorsToAvoid: [] });
    const userPrompt = buildStyleUserPrompt(input, []);
    expect(userPrompt).not.toContain("Seller-Specified Colors to Avoid");
  });
});
