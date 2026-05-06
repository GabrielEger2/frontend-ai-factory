import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import NavbarMegaPanel from "./index";

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

const NorthlineLogo = () => (
  <span className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-base-content">
    <span
      aria-hidden="true"
      className="block h-[18px] w-[18px] rounded-[5px] bg-base-content"
    />
    Northline
  </span>
);

const TerralumLogo = () => (
  <span className="inline-flex items-baseline gap-1 font-serif text-lg font-semibold tracking-tight text-base-content">
    Terralum
    <span className="text-primary">/</span>
  </span>
);

const KaminoLogo = () => (
  <span className="inline-flex items-center gap-1.5 font-mono text-sm font-bold uppercase tracking-[0.18em] text-base-content">
    <span
      aria-hidden="true"
      className="block h-2 w-2 rounded-full bg-primary"
    />
    Kamino
  </span>
);

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof NavbarMegaPanel> = {
  title: "Navigation/NavbarMegaPanel",
  component: NavbarMegaPanel,
  parameters: { layout: "fullscreen" },
  argTypes: {
    ctaStyle: {
      control: "select",
      options: [
        "default",
        "slide",
        "dotExpand",
        "drawOutline",
        "glow",
        "arrow",
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-[200vh] bg-base-100">
        <Story />
        <div className="flex min-h-[180vh] items-center justify-center pt-32 text-base-content/40">
          <p className="text-sm">
            Hover the navigation entries to open the mega panel.
          </p>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NavbarMegaPanel>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/**
 * Northline — observability platform. Two panel-driven entries plus pricing
 * and resources. Sign-in link before a slide-style CTA.
 */
export const ObservabilitySaas: Story = {
  args: {
    logo: <NorthlineLogo />,
    signInText: "Sign in",
    signInUrl: "/login",
    ctaText: "Start free trial",
    ctaUrl: "/signup",
    ctaStyle: "slide",
    links: [
      {
        text: "Platform",
        href: "/platform",
        panel: {
          groups: [
            {
              title: "Observability",
              items: [
                {
                  label: "Logs",
                  description: "Structured ingestion at 4.2M events/sec",
                  href: "/platform/logs",
                },
                {
                  label: "Distributed tracing",
                  description: "OpenTelemetry-native span graphs",
                  href: "/platform/traces",
                },
                {
                  label: "Real-user monitoring",
                  description: "Web vitals + session replay",
                  href: "/platform/rum",
                  badge: "New",
                },
              ],
            },
            {
              title: "Reliability",
              items: [
                {
                  label: "Incident response",
                  description: "Paging, runbooks, postmortems",
                  href: "/platform/incidents",
                },
                {
                  label: "SLO tracking",
                  description: "Error budgets across services",
                  href: "/platform/slo",
                },
                {
                  label: "Synthetic checks",
                  description: "47-region uptime probes",
                  href: "/platform/synthetic",
                },
              ],
            },
          ],
          feature: {
            eyebrow: "Just shipped",
            title: "Trace sampling, now adaptive",
            description:
              "Cut ingest spend by 38% while keeping the high-value tail of your tracing data.",
            href: "/blog/adaptive-sampling",
            ctaLabel: "Read the announcement",
            image: "https://picsum.photos/seed/northline-trace/640/400",
            imageAlt: "Trace waterfall visualization",
          },
        },
      },
      {
        text: "Solutions",
        href: "/solutions",
        panel: {
          groups: [
            {
              title: "By stack",
              items: [
                { label: "Kubernetes", href: "/solutions/kubernetes" },
                { label: "Serverless", href: "/solutions/serverless" },
                { label: "Edge runtimes", href: "/solutions/edge" },
                { label: "Databases", href: "/solutions/databases" },
              ],
            },
            {
              title: "By role",
              items: [
                { label: "SREs", href: "/solutions/sre" },
                { label: "Backend engineers", href: "/solutions/backend" },
                {
                  label: "Platform leaders",
                  href: "/solutions/platform-leaders",
                },
              ],
            },
          ],
        },
      },
      { text: "Pricing", href: "/pricing" },
      { text: "Customers", href: "/customers" },
      { text: "Docs", href: "/docs" },
    ],
  },
};

/**
 * Terralum — sustainability consultancy. Editorial serif logo, drawOutline CTA,
 * a feature-led panel under "Practice".
 */
export const SustainabilityConsultancy: Story = {
  args: {
    logo: <TerralumLogo />,
    ctaText: "Request a brief",
    ctaUrl: "/brief",
    ctaStyle: "drawOutline",
    links: [
      {
        text: "Practice",
        href: "/practice",
        panel: {
          groups: [
            {
              title: "What we do",
              items: [
                {
                  label: "Climate strategy",
                  description: "Roadmaps for Scope 1–3 reduction",
                  href: "/practice/climate",
                },
                {
                  label: "Built environment",
                  description: "Embodied carbon for design teams",
                  href: "/practice/built-env",
                },
                {
                  label: "Disclosure & audit",
                  description: "CSRD, IFRS S2, and CDP reporting",
                  href: "/practice/disclosure",
                },
              ],
            },
          ],
          feature: {
            eyebrow: "Field report",
            title: "Decarbonising 1,184 hectares of cocoa",
            description:
              "Twelve-month case study with Cooperativa Mariana Cardoso in Pará.",
            href: "/case-studies/cocoa-para",
            ctaLabel: "Read the case study",
            image: "https://picsum.photos/seed/terralum-cocoa/640/400",
            imageAlt: "Cocoa plantation aerial view",
          },
        },
      },
      { text: "Studies", href: "/studies" },
      { text: "Insights", href: "/insights" },
      { text: "About", href: "/about" },
    ],
  },
};

/**
 * Kamino — developer tooling. Mono logo, glow CTA, badges on changelog
 * entries, no feature card on solutions.
 */
export const DeveloperTooling: Story = {
  args: {
    logo: <KaminoLogo />,
    signInText: "Log in",
    signInUrl: "/login",
    ctaText: "Open dashboard",
    ctaUrl: "/dashboard",
    ctaStyle: "glow",
    links: [
      {
        text: "Product",
        href: "/product",
        panel: {
          groups: [
            {
              title: "Build",
              items: [
                { label: "Editor", href: "/product/editor" },
                { label: "AI suggestions", href: "/product/ai", badge: "Beta" },
                { label: "Preview env", href: "/product/preview" },
              ],
            },
            {
              title: "Ship",
              items: [
                { label: "Deploys", href: "/product/deploys" },
                { label: "Rollouts", href: "/product/rollouts" },
                { label: "Rollbacks", href: "/product/rollbacks" },
              ],
            },
            {
              title: "Operate",
              items: [
                { label: "Runtime metrics", href: "/product/metrics" },
                { label: "Logs", href: "/product/logs" },
                { label: "Audit trail", href: "/product/audit" },
              ],
            },
          ],
          feature: {
            eyebrow: "Kamino 4.7",
            title: "Branch deploys, 2.4× faster",
            description:
              "New build cache cuts cold deploys from 87s to 36s on the median project.",
            href: "/changelog/4-7",
            ctaLabel: "See the changelog",
            image: "https://picsum.photos/seed/kamino-deploy/640/400",
            imageAlt: "Deployment timeline graph",
          },
        },
      },
      {
        text: "Solutions",
        href: "/solutions",
        panel: {
          groups: [
            {
              title: "By stack",
              items: [
                { label: "Next.js", href: "/solutions/next" },
                { label: "Astro", href: "/solutions/astro" },
                { label: "Remix", href: "/solutions/remix" },
                { label: "SvelteKit", href: "/solutions/sveltekit" },
              ],
            },
            {
              title: "By team",
              items: [
                { label: "Solo founders", href: "/solutions/solo" },
                { label: "Growing teams", href: "/solutions/teams" },
                { label: "Enterprise", href: "/solutions/enterprise" },
              ],
            },
          ],
        },
      },
      { text: "Pricing", href: "/pricing" },
      { text: "Changelog", href: "/changelog" },
      { text: "Docs", href: "/docs" },
    ],
  },
};

/**
 * Lumen Public Library — civic non-profit. Minimal flat links, no panel,
 * arrow CTA. Demonstrates the bar without panel-driven entries.
 */
export const CivicNonprofit: Story = {
  args: {
    logo: (
      <span className="font-serif text-lg font-semibold text-base-content">
        Lumen Library
      </span>
    ),
    ctaText: "Become a member",
    ctaUrl: "/membership",
    ctaStyle: "arrow",
    links: [
      { text: "Visit", href: "/visit" },
      { text: "Catalog", href: "/catalog" },
      { text: "Programs", href: "/programs" },
      { text: "Support us", href: "/donate" },
    ],
  },
};

/**
 * Veridian Bank — financial services. Two panels with risk-aware copy,
 * dotExpand CTA, lower scroll threshold to tighten the bar quickly.
 */
export const FinancialServices: Story = {
  args: {
    logo: (
      <span className="text-base font-semibold tracking-tight text-base-content">
        Veridian
        <span className="ml-1 font-normal text-base-content/50">Bank</span>
      </span>
    ),
    signInText: "Online banking",
    signInUrl: "/login",
    ctaText: "Open an account",
    ctaUrl: "/apply",
    ctaStyle: "dotExpand",
    scrollThreshold: 16,
    links: [
      {
        text: "Personal",
        href: "/personal",
        panel: {
          groups: [
            {
              title: "Everyday banking",
              items: [
                { label: "Checking", href: "/personal/checking" },
                { label: "High-yield savings", href: "/personal/savings" },
                {
                  label: "Veridian Card",
                  href: "/personal/card",
                  badge: "1.8% back",
                },
              ],
            },
            {
              title: "Plan ahead",
              items: [
                { label: "Mortgages", href: "/personal/mortgage" },
                { label: "Auto loans", href: "/personal/auto" },
                { label: "Education savings", href: "/personal/529" },
              ],
            },
          ],
          feature: {
            eyebrow: "Member rate",
            title: "Variable APY at 4.37%",
            description:
              "Effective on balances above 2,400 USD. No monthly maintenance fees through 2027.",
            href: "/personal/savings",
            ctaLabel: "View savings terms",
            image: "https://picsum.photos/seed/veridian-savings/640/400",
            imageAlt: "Coastline at dawn",
          },
        },
      },
      {
        text: "Business",
        href: "/business",
        panel: {
          groups: [
            {
              title: "Small business",
              items: [
                { label: "Operating accounts", href: "/business/operating" },
                { label: "Merchant services", href: "/business/merchant" },
                { label: "Payroll integrations", href: "/business/payroll" },
              ],
            },
            {
              title: "Commercial",
              items: [
                { label: "Lines of credit", href: "/business/credit" },
                { label: "Treasury management", href: "/business/treasury" },
                { label: "FX & hedging", href: "/business/fx" },
              ],
            },
          ],
        },
      },
      { text: "Wealth", href: "/wealth" },
      { text: "Branches", href: "/branches" },
    ],
  },
};
