import type { Meta, StoryObj } from "@storybook/react";
import HeroTerminalConsole from "./index";

const meta: Meta<typeof HeroTerminalConsole> = {
  title: "Heroes/HeroTerminalConsole",
  component: HeroTerminalConsole,
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
    ctaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
    secondaryCtaStyle: {
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
    secondaryCtaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof HeroTerminalConsole>;

/** Open-source CLI release — primary CTA, six platform badges */
export const OpenSourceCli: Story = {
  args: {
    eyebrow: "v3.4.1 — released today",
    headline:
      "A small CLI that ships your monorepo to seventeen hosting providers, finally without the YAML.",
    subheadline:
      "Single-binary install, project-local config, and one of those rare command-line tools that actually shows you the diff before it changes anything.",
    ctaText: "Install on macOS",
    ctaUrl: "/install",
    ctaStyle: "default",
    ctaColorScheme: "primary",
    secondaryCtaText: "Read the docs",
    secondaryCtaUrl: "/docs",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    terminalTitle: "~/projects/inbound",
    terminalLines: [
      { kind: "comment", text: "install via your package manager" },
      { kind: "command", text: "brew install inbound" },
      {
        kind: "output",
        text: "==> Pouring inbound-3.4.1.arm64_sonoma.bottle.tar.gz",
      },
      { kind: "success", text: "Installed inbound 3.4.1 (1.4MB)" },
      { kind: "command", text: "inbound deploy --to vercel,fly,railway" },
      { kind: "output", text: "» building 3 targets in parallel" },
      { kind: "output", text: "» vercel:   ready in 14.7s" },
      { kind: "output", text: "» fly:      ready in 18.2s" },
      { kind: "output", text: "» railway:  ready in 11.4s" },
      { kind: "success", text: "Deployed 3 targets, 0 failures" },
    ],
    platformBadges: [
      { label: "macOS arm64" },
      { label: "macOS x64" },
      { label: "Linux" },
      { label: "Windows" },
      { label: "homebrew" },
      { label: "cargo install" },
    ],
  },
};

/** Observability platform — accent CTA, error line, three platform badges */
export const ObservabilityPlatform: Story = {
  args: {
    eyebrow: "Now generally available",
    headline:
      "Trace a slow database query back to the deploy that introduced it in eight clicks.",
    subheadline:
      "Cordial Trace stitches your traces, deploys, and customer reports into one continuous timeline. Built for platform teams already running their own SIEM and tired of switching tabs to find a root cause.",
    ctaText: "Start a free workspace",
    ctaUrl: "/start",
    ctaStyle: "slide",
    ctaColorScheme: "accent",
    secondaryCtaText: "Pricing",
    secondaryCtaUrl: "/pricing",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "accent",
    terminalTitle: "incident-184 / cordial",
    terminalLines: [
      { kind: "comment", text: "investigating: checkout p99 spiked to 4.7s" },
      { kind: "command", text: "cordial trace --service checkout --p99" },
      { kind: "output", text: "service checkout — p99 over last 60m" },
      { kind: "output", text: "  03:44 → 412ms (baseline)" },
      { kind: "output", text: "  04:02 → 4,728ms (spike begins)" },
      { kind: "error", text: "regression detected after deploy a1f47c2" },
      { kind: "comment", text: "cause: missing index on orders.account_id" },
      {
        kind: "success",
        text: "rollback proposed: cordial deploy revert a1f47c2",
      },
    ],
    platformBadges: [
      { label: "Kubernetes" },
      { label: "ECS / Fargate" },
      { label: "Bare metal" },
    ],
  },
};

/** Database SDK — secondary scheme, glow CTA, four lines, two badges */
export const DatabaseSdk: Story = {
  args: {
    eyebrow: "Typescript / python / ruby",
    headline:
      "Type-safe queries that survive a schema migration on a friday afternoon.",
    subheadline:
      "Three small SDKs that share one query language and one migration model. We update generated types on every commit, so refactors stop sneaking in at deploy.",
    ctaText: "Try in your repo",
    ctaUrl: "/quickstart",
    ctaStyle: "glow",
    ctaColorScheme: "secondary",
    secondaryCtaText: "View source",
    secondaryCtaUrl: "https://github.com/example/sdk",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "secondary",
    terminalTitle: "users.repository.ts",
    terminalLines: [
      { kind: "comment", text: "queries are inferred end-to-end" },
      {
        kind: "command",
        text: "const u = await db.users.where({ active: true }).take(20)",
      },
      { kind: "output", text: "// type: User[] — 20 rows" },
      {
        kind: "command",
        text: "await db.migrate({ users: { add: 'last_login_at' } })",
      },
      { kind: "success", text: "schema synced — 1 column added in 0.7s" },
    ],
    platformBadges: [{ label: "Postgres" }, { label: "MySQL 8" }],
  },
};

/** Serverless platform — neutral, dotExpand CTA, six lines, four badges */
export const ServerlessPlatform: Story = {
  args: {
    eyebrow: "Cold start: 38ms p95",
    headline:
      "Run a python function in seventeen regions without writing a single line of YAML.",
    subheadline:
      "We cache your function image at the edge, route traffic by latency, and hand you a single dashboard to argue about cost with finance. Free tier covers 1M requests a month.",
    ctaText: "Deploy your first function",
    ctaUrl: "/quickstart",
    ctaStyle: "dotExpand",
    ctaColorScheme: "neutral",
    secondaryCtaText: "Compare to AWS",
    secondaryCtaUrl: "/vs/aws",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    terminalTitle: "~/work/checkout-fn",
    terminalLines: [
      { kind: "comment", text: "no yaml, no terraform, no console" },
      { kind: "command", text: "lift deploy ./checkout.py --regions auto" },
      { kind: "output", text: "» bundling python 3.12 (44.7KB)" },
      { kind: "output", text: "» pushing to 17 regions in parallel" },
      { kind: "output", text: "» SAO  ready · 38ms cold · 2ms warm" },
      { kind: "output", text: "» FRA  ready · 41ms cold · 2ms warm" },
      { kind: "success", text: "Live at https://checkout-fn.lift.dev" },
    ],
    platformBadges: [
      { label: "Python 3.12" },
      { label: "Node 20" },
      { label: "Go 1.22" },
      { label: "Bun" },
    ],
  },
};

/** Security scanning tool — primary, with error line and three platform badges */
export const SecurityScanner: Story = {
  args: {
    eyebrow: "SOC 2 + ISO 27001 — renewed apr 2026",
    headline:
      "Catch the secret your contractor pasted into a draft PR before it ships.",
    subheadline:
      "Cordial Scan runs as a pre-commit hook and as a GitHub App, blocks merges with leaked credentials, and rotates them automatically with the providers we already support. Free for individuals.",
    ctaText: "Install the github app",
    ctaUrl: "/install/github",
    ctaStyle: "arrow",
    ctaColorScheme: "primary",
    secondaryCtaText: "Self-host",
    secondaryCtaUrl: "/self-host",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    terminalTitle: "ci · pr-1847",
    terminalLines: [
      { kind: "command", text: "cordial scan --staged" },
      { kind: "output", text: "scanning 47 staged files…" },
      { kind: "comment", text: "checking against 184 known patterns" },
      {
        kind: "error",
        text: "stripe live key found in src/billing/config.ts:14",
      },
      { kind: "comment", text: "rotating credential with stripe…" },
      {
        kind: "success",
        text: "credential revoked + replaced (sk_live_…J3tA)",
      },
      { kind: "success", text: "PR cleared to merge" },
    ],
    platformBadges: [
      { label: "GitHub" },
      { label: "GitLab" },
      { label: "Bitbucket" },
    ],
  },
};
