import type { Meta, StoryObj } from "@storybook/react";
import ProgressNarrative from "./index";
import { CtaButton } from "@ui/button";

const meta: Meta<typeof ProgressNarrative> = {
  title: "Wrappers/ProgressNarrative",
  component: ProgressNarrative,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    railSide: {
      control: { type: "select" },
      options: ["left", "right"],
    },
    stickyTop: {
      control: { type: "range", min: 0, max: 160, step: 8 },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ProgressNarrative>;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

interface ChapterProps {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  ctaText: string;
  ctaUrl: string;
  ctaVariant: "glow" | "slide" | "drawOutline";
  ctaColorScheme: "primary" | "secondary" | "accent";
  image?: string;
  imageAlt?: string;
}

function Chapter({
  eyebrow,
  title,
  paragraphs,
  ctaText,
  ctaUrl,
  ctaVariant,
  ctaColorScheme,
  image,
  imageAlt,
}: ChapterProps) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
        {eyebrow}
      </p>
      <h3 className="text-3xl font-bold text-base-content sm:text-4xl md:text-5xl">
        {title}
      </h3>
      {image && (
        <img
          src={image}
          alt={imageAlt}
          className="w-full rounded-2xl object-cover"
          loading="lazy"
        />
      )}
      {paragraphs.map((p, i) => (
        <p key={i} className="text-base text-base-content/70 md:text-lg">
          {p}
        </p>
      ))}
      <div>
        <CtaButton
          variant={ctaVariant}
          colorScheme={ctaColorScheme}
          href={ctaUrl}
        >
          {ctaText}
        </CtaButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Climbing expedition recap — narrative report with imagery, drawOutline CTA */
export const ClimbingExpedition: Story = {
  args: {
    headline: "Six weeks on the south face of Cerro Torre",
    subheadline:
      "An expedition log from our 2025 attempt — the weather windows that closed, the route choices that paid off, and the call we made on day 38.",
    railSide: "left",
    stickyTop: 96,
    purpose: "story",
    steps: [
      {
        label: "Approach",
        content: (
          <Chapter
            eyebrow="Days 1–7"
            title="From El Chaltén to base camp"
            paragraphs={[
              "We landed in El Calafate with 380 kilograms of equipment split across six duffel bags and a 90-day climbing permit issued by Parque Nacional Los Glaciares. The drive to El Chaltén took five hours, and by the time we reached the trailhead at Hostería El Pilar, the cloud ceiling had already dropped below 1,200 meters.",
              "The walk-in to Niponino base camp took two days at our chosen pace — slower than the standard itinerary, but deliberately so. Acclimatization on this expedition was non-negotiable: two of our team had cut a previous attempt short with altitude sickness, and we had budgeted three extra days into the schedule to climb high and sleep low before committing to the wall.",
            ]}
            ctaText="Read the gear manifest"
            ctaUrl="/expeditions/cerro-torre/gear"
            ctaVariant="drawOutline"
            ctaColorScheme="accent"
            image="https://placehold.co/900x500"
            imageAlt="Climbers approaching base camp with Cerro Torre visible in the distance"
          />
        ),
      },
      {
        label: "Acclimatization",
        content: (
          <Chapter
            eyebrow="Days 8–18"
            title="Climbing high, sleeping low"
            paragraphs={[
              "We spent eleven days running carry-and-cache rotations to a depot at 2,400 meters on the lower buttress. The weather was uncooperative — three storm cycles in the first week alone, with sustained winds over 80 km/h that made route fixing impossible above the bergschrund.",
              "By the end of the second week, every member of the team had slept at least three nights at 2,400 meters and one night at 2,800 meters on a scouting push. Heart rate variability data from the chest straps showed full adaptation curves on five of six climbers — the sixth needed an additional rest day before we committed to the upper wall.",
            ]}
            ctaText="See the weather logs"
            ctaUrl="/expeditions/cerro-torre/weather"
            ctaVariant="drawOutline"
            ctaColorScheme="accent"
          />
        ),
      },
      {
        label: "Push",
        content: (
          <Chapter
            eyebrow="Days 19–37"
            title="The route, the ramp, and the headwall"
            paragraphs={[
              "The first weather window opened on day 22 and held for six days — the longest stable spell of the season according to the Servicio Meteorológico Nacional historical archive. We left base at 2am on day 23, climbing the ramp by headlamp and reaching the col on the upper buttress by mid-afternoon.",
              "The headwall went on cold rock and good ice, with the crux pitch climbed clean by the lead pair on the morning of day 25. We summited at 14:40 local time, spent twenty minutes on top, and started the descent immediately. The rappels back to the ramp took eight hours; we reached the col bivy as the wind picked up again.",
            ]}
            ctaText="Watch the summit footage"
            ctaUrl="/expeditions/cerro-torre/summit"
            ctaVariant="drawOutline"
            ctaColorScheme="accent"
            image="https://placehold.co/900x500"
            imageAlt="Climber on the headwall pitch with the ramp visible below"
          />
        ),
      },
      {
        label: "Decision",
        content: (
          <Chapter
            eyebrow="Day 38"
            title="The call to abandon the second objective"
            paragraphs={[
              "The original plan included a second objective on the east face after a four-day rest. Forecasts on day 37 showed a deep low-pressure system tracking south, with no realistic weather window inside our remaining permit period.",
              "We made the call to walk out the next morning. It is the call we are most proud of from the entire expedition — not the summit, not the route, but the willingness to leave a second objective on the table when the conditions did not warrant the risk.",
            ]}
            ctaText="Read the safety debrief"
            ctaUrl="/expeditions/cerro-torre/debrief"
            ctaVariant="drawOutline"
            ctaColorScheme="accent"
          />
        ),
      },
    ],
  },
};

/** SaaS launch playbook — five-stage product launch report, slide CTA, rail right */
export const SaaSLaunchPlaybook: Story = {
  args: {
    headline: "How we launched Atlas v3",
    subheadline:
      "A five-stage walkthrough of the launch that drove $4.2M in pipeline and 11,000 trial signups in the first 30 days.",
    railSide: "right",
    stickyTop: 80,
    purpose: "process",
    steps: [
      {
        label: "T-90 Plan",
        content: (
          <Chapter
            eyebrow="90 days out"
            title="Lock the narrative, then everything else"
            paragraphs={[
              "Ninety days out, we held a one-day offsite to settle the launch narrative — a single-sentence positioning, a three-pillar story, and the five proof points each pillar would lean on. Nothing else got written until that document was approved by founders, sales leadership, and the customer advisory board.",
              "Once the narrative was locked, every downstream artifact — the keynote, the press kit, the sales deck, the partner enablement materials — was scoped backward from it. Anything that did not reinforce one of the three pillars was cut, including two features that engineering had already started building.",
            ]}
            ctaText="See the narrative doc"
            ctaUrl="/launch/narrative"
            ctaVariant="slide"
            ctaColorScheme="primary"
          />
        ),
      },
      {
        label: "T-60 Build",
        content: (
          <Chapter
            eyebrow="60 days out"
            title="Engineering, in lockstep with marketing"
            paragraphs={[
              "From day 60, engineering and marketing ran a shared standup three times a week. The agenda was always the same: what is the demo we will give in seven days, what is broken, what is the workaround, and what is the cut line if it is still broken on launch day.",
              "By day 30, we had a deterministic demo script that could be performed from a clean account in under nine minutes, with twelve fail-safes for the three flows most likely to break under load. The script was rehearsed by every account executive at least twice before launch.",
            ]}
            ctaText="View the demo runbook"
            ctaUrl="/launch/demo"
            ctaVariant="slide"
            ctaColorScheme="primary"
          />
        ),
      },
      {
        label: "T-14 Press",
        content: (
          <Chapter
            eyebrow="14 days out"
            title="Embargoed previews and the analyst roadshow"
            paragraphs={[
              "Two weeks out, we ran a six-city analyst roadshow with embargoed previews to Forrester, Gartner, IDC, and four independent analysts. Each session was 90 minutes — 30 minutes of narrative, 30 minutes of live demo, 30 minutes of competitive Q&A.",
              "The press embargo lifted at 6am Eastern on launch day. We had committed previews to TechCrunch, The Information, and Protocol, plus exclusives in three vertical trade publications. Every reporter received the same packet, with the same proof points, the same customer quotes, and the same pricing details.",
            ]}
            ctaText="Browse the press kit"
            ctaUrl="/launch/press"
            ctaVariant="slide"
            ctaColorScheme="primary"
          />
        ),
      },
      {
        label: "Launch Day",
        content: (
          <Chapter
            eyebrow="T-0"
            title="A single keynote, then the demo flood"
            paragraphs={[
              "The keynote went live at 9am Pacific. Twelve thousand viewers watched the stream live; another forty thousand watched the on-demand replay in the first 24 hours. Within an hour of the keynote, our scheduling tool was booked solid for the next ten business days.",
              "The launch-day product team ran a war-room rotation across three time zones. We tracked four metrics in real time: trial signups, demo bookings, infrastructure load, and a sentiment score derived from social posts and support tickets.",
            ]}
            ctaText="Read the keynote transcript"
            ctaUrl="/launch/keynote"
            ctaVariant="slide"
            ctaColorScheme="primary"
          />
        ),
      },
      {
        label: "T+30 Recap",
        content: (
          <Chapter
            eyebrow="30 days later"
            title="What worked, what did not, what we change next time"
            paragraphs={[
              "The launch generated $4.2M in pipeline within 30 days, against a goal of $3.0M. Trial-to-paid conversion exceeded the prior quarter by 38 percent, attributed primarily to the deterministic demo and the new self-serve onboarding.",
              "What did not work: the partner enablement track shipped two weeks late, and the resulting partner pipeline was 60 percent below plan. Our retro identified that we had under-resourced partner marketing relative to direct marketing — a structural fix we are making before the v4 launch.",
            ]}
            ctaText="See the full retro"
            ctaUrl="/launch/retro"
            ctaVariant="slide"
            ctaColorScheme="primary"
          />
        ),
      },
    ],
  },
};

/** Investor letter — three-quarter strategic update, glow CTA */
export const InvestorUpdate: Story = {
  args: {
    headline: "FY2025 letter to shareholders",
    subheadline:
      "Three quarters in, here is how the year is unfolding and what we are revising for the back half.",
    railSide: "left",
    stickyTop: 120,
    purpose: "brand-statement",
    steps: [
      {
        label: "Q1",
        content: (
          <Chapter
            eyebrow="Quarter one"
            title="A faster start than we modeled"
            paragraphs={[
              "Q1 closed at $42.8M in revenue, 23 percent ahead of the plan we communicated in the Q4 letter. The over-performance came almost entirely from the mid-market segment, where the new product-led motion converted at rates we had projected for late Q3.",
              "Net dollar retention came in at 128 percent, our highest reading since 2022. Logo retention held at 95 percent for the third consecutive quarter, suggesting the underlying churn dynamics have stabilized after last year's pricing reset.",
            ]}
            ctaText="Q1 financials"
            ctaUrl="/investors/q1"
            ctaVariant="glow"
            ctaColorScheme="secondary"
          />
        ),
      },
      {
        label: "Q2",
        content: (
          <Chapter
            eyebrow="Quarter two"
            title="The macro caught up — and so did we"
            paragraphs={[
              "Q2 was the quarter the macro environment caught up with the pipeline. Sales cycles in our enterprise segment lengthened by 11 days on average, and three deals over $1M slipped from June into Q3. Despite that, we still closed Q2 at $48.1M, ahead of the consensus model.",
              "We used the slowdown in enterprise to accelerate hiring in product engineering — 14 of the 22 open requisitions filled in Q2, including two senior platform leads we had been recruiting for over a year. The team enters Q3 stronger than we entered Q2.",
            ]}
            ctaText="Q2 deck"
            ctaUrl="/investors/q2"
            ctaVariant="glow"
            ctaColorScheme="secondary"
          />
        ),
      },
      {
        label: "Q3",
        content: (
          <Chapter
            eyebrow="Quarter three"
            title="Three deals back, and the v3 launch"
            paragraphs={[
              "All three of the enterprise deals that slipped from Q2 closed in Q3, accounting for $4.7M of Q3's $54.2M total. The v3 launch added 11,000 net new trial signups in its first 30 days; trial-to-paid conversion is currently tracking 38 percent above plan.",
              "We are revising full-year guidance upward — from a midpoint of $195M to a midpoint of $208M, with the back-half acceleration driven primarily by v3 expansion within the existing customer base. Operating margin guidance remains unchanged at 14 to 16 percent.",
            ]}
            ctaText="Updated guidance"
            ctaUrl="/investors/guidance"
            ctaVariant="glow"
            ctaColorScheme="secondary"
          />
        ),
      },
    ],
  },
};
