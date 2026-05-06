import type { Meta, StoryObj } from "@storybook/react";
import ProcessTimeline from "./index";

const meta: Meta<typeof ProcessTimeline> = {
  title: "Layouts/Grid/ProcessTimeline",
  component: ProcessTimeline,
  parameters: { layout: "fullscreen" },
  argTypes: {
    orientation: { control: "select", options: ["vertical", "horizontal"] },
    styleKit: { control: "object" },
  },
};
export default meta;
type Story = StoryObj<typeof ProcessTimeline>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Agency engagement — vertical staircase, default CTA */
export const AgencyEngagement: Story = {
  args: {
    label: "How we work together",
    headline: "Eight weeks from kickoff to a launched site that converts",
    description:
      "A predictable path with weekly demos, no agency-style waterfall, and a single Slack channel where every decision is visible.",
    orientation: "vertical",
    ctaText: "See a sample timeline",
    ctaUrl: "/playbook",
    styleKit: { ctaVariant: "default", ctaColorScheme: "primary" },
    steps: [
      {
        marker: "Week 1",
        title: "Discovery and audit",
        description:
          "Two half-days with your team to map the customer journey end-to-end and surface the friction points worth fixing first.",
        duration: "5 days",
      },
      {
        marker: "Week 2-3",
        title: "Design sprints",
        description:
          "Two iterative sprints — wireframes, then high-fidelity flows. Daily Loom updates so feedback never blocks momentum.",
        duration: "10 days",
      },
      {
        marker: "Week 4-7",
        title: "Build and integrate",
        description:
          "Production-ready Next.js with your CMS, analytics, and CRM wired in. Staging environment shared from day one.",
        duration: "20 days",
      },
      {
        marker: "Week 8",
        title: "Launch and handoff",
        description:
          "QA across devices, soft launch with the marketing list, then a 90-minute handoff covering content updates and analytics.",
        duration: "5 days",
      },
    ],
  },
};

/** SaaS onboarding — horizontal rail, slide CTA */
export const SaasOnboarding: Story = {
  args: {
    label: "Setup in under an hour",
    headline: "Four steps from signup to your first deploy",
    description:
      "Most teams ship a production page within 47 minutes — fastest recorded was 12 minutes from signup.",
    orientation: "horizontal",
    ctaText: "Open the console",
    ctaUrl: "/console",
    styleKit: { ctaVariant: "slide", ctaColorScheme: "accent" },
    steps: [
      {
        marker: "Step 1",
        title: "Connect your repo",
        description:
          "GitHub, GitLab, or Bitbucket — we read the framework and pick sane defaults so you skip the YAML.",
      },
      {
        marker: "Step 2",
        title: "Pick environments",
        description:
          "Production, preview, and staging come pre-wired. Customise URLs and env vars from a single screen.",
      },
      {
        marker: "Step 3",
        title: "Add your domain",
        description:
          "Bring an existing domain or grab a free subdomain. SSL provisions in under 90 seconds.",
      },
      {
        marker: "Step 4",
        title: "Ship the first build",
        description:
          "Push to main and watch the build log stream. Rollback is one click if anything breaks in production.",
      },
    ],
  },
};

/** Healthcare procedure — vertical with phase markers, dotExpand CTA */
export const HealthcareProcedure: Story = {
  args: {
    label: "What to expect",
    headline: "Your knee replacement, mapped from consult to recovery",
    description:
      "A board-certified orthopedic team walks alongside you for the full twelve weeks — surgery is one stage of four.",
    orientation: "vertical",
    ctaText: "Schedule a consult",
    ctaUrl: "/appointments",
    styleKit: { ctaVariant: "dotExpand", ctaColorScheme: "secondary" },
    steps: [
      {
        marker: "Phase 01",
        title: "Pre-op consultation",
        description:
          "A 60-minute appointment covering imaging review, medication audit, and a recovery-time estimate based on your activity level.",
        duration: "Week 0",
      },
      {
        marker: "Phase 02",
        title: "Surgical day",
        description:
          "Same-day discharge for 78% of patients. Anesthesia plan tailored to your history; spouse or partner welcome from check-in.",
        duration: "Day 1",
      },
      {
        marker: "Phase 03",
        title: "Guided rehabilitation",
        description:
          "Twice-weekly physical therapy with our in-house team. Telehealth check-ins between sessions if travel is inconvenient.",
        duration: "Weeks 2-8",
      },
      {
        marker: "Phase 04",
        title: "Return to activity",
        description:
          "Final imaging and a green-light visit. Most patients walk unaided by week 8 and return to low-impact sports by week 12.",
        duration: "Weeks 9-12",
      },
    ],
  },
};

/** Brazilian fintech — three-step verification flow, drawOutline CTA */
export const FintechVerificationBR: Story = {
  args: {
    label: "Abertura de conta",
    headline: "Três passos para sua conta PJ ficar pronta",
    description:
      "Tudo digital, sem fila e sem cartório — média de 23 minutos entre o cadastro e a primeira transferência.",
    orientation: "horizontal",
    ctaText: "Abrir minha conta",
    ctaUrl: "/abrir-conta",
    styleKit: { ctaVariant: "drawOutline", ctaColorScheme: "primary" },
    steps: [
      {
        marker: "Passo 1",
        title: "Dados da empresa",
        description:
          "Informe o CNPJ e a gente puxa o quadro societário automaticamente da Receita. Levou 2 minutos no último teste.",
      },
      {
        marker: "Passo 2",
        title: "Validação dos sócios",
        description:
          "Cada sócio recebe um link no WhatsApp para tirar uma selfie e enviar o documento — tudo aprovado por liveness em segundos.",
      },
      {
        marker: "Passo 3",
        title: "Conta ativa",
        description:
          "Cartão virtual liberado na hora, físico chega em 3 dias úteis e Pix começa a funcionar antes mesmo de receber o cartão.",
      },
    ],
  },
};

/** Bootcamp curriculum — five phases with weekly markers, vertical */
export const BootcampCurriculum: Story = {
  args: {
    label: "Curriculum",
    headline: "Sixteen weeks from first commit to your first job offer",
    description:
      "Five phases, two cohort sessions per week, and a hiring partner network that reviews your portfolio before you graduate.",
    orientation: "vertical",
    ctaText: "Apply for the next cohort",
    ctaUrl: "/apply",
    styleKit: { ctaVariant: "glow", ctaColorScheme: "accent" },
    steps: [
      {
        marker: "Weeks 1-2",
        title: "Foundations and tooling",
        description:
          "Git workflows, terminal fluency, semantic HTML, and modern CSS. We assume you can write a for-loop; nothing more.",
        duration: "10 days",
      },
      {
        marker: "Weeks 3-6",
        title: "JavaScript and TypeScript",
        description:
          "Through TypeScript-first React, async patterns, and the testing pyramid. Project: a 4-page personal site, code-reviewed twice.",
        duration: "20 days",
      },
      {
        marker: "Weeks 7-10",
        title: "React and Next.js",
        description:
          "App router, server components, and data layer patterns. Capstone-1: a full-stack notes app with auth and a Postgres backend.",
        duration: "20 days",
      },
      {
        marker: "Weeks 11-14",
        title: "Capstone project",
        description:
          "Pick a real-world brief from our partner board. Pair-program with a mentor and ship to a live URL by week 14.",
        duration: "20 days",
      },
      {
        marker: "Weeks 15-16",
        title: "Hiring sprint",
        description:
          "Mock interviews, portfolio polish, and warm intros to the 38 partner companies hiring junior engineers this quarter.",
        duration: "10 days",
      },
    ],
  },
};
