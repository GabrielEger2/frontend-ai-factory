import type { Meta, StoryObj } from "@storybook/react";
import StackedSplit from "./index";

const meta: Meta<typeof StackedSplit> = {
  title: "Testimonial/StackedSplit",
  component: StackedSplit,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    autoAdvanceDuration: {
      control: { type: "range", min: 2, max: 15, step: 1 },
    },
    styleKit: {
      control: "object",
    },
  },
};
export default meta;
type Story = StoryObj<typeof StackedSplit>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Software company — enterprise client feedback on product reliability */
export const SoftwareCompanyReviews: Story = {
  args: {
    headline: "What our clients think",
    subheadline:
      "We let the results speak for themselves. Here is what the people behind the brands have to say.",
    purpose: "testimonials",
    testimonials: [
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Jane Dodson",
        name: "Jane Dodson",
        title: "Marketing Director, SportsBrand",
        quote:
          "Our social media engagement tripled in two months. The content strategy was sharp, targeted, and delivered exactly what we needed to break through the noise.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Johnathan Rodriguez",
        name: "Johnathan Rodriguez",
        title: "UX Research Lead, CollabSoft",
        quote:
          "They redesigned our onboarding flow and reduced drop-off by 42%. The user research they conducted was more thorough than what our internal team had produced in a year.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Phil Heath",
        name: "Phil Heath",
        title: "Staff Engineer, CreativeHub",
        quote:
          "The landing pages they built convert at 3x our previous rate. Fast turnaround, clean code, and they actually listened to our technical constraints.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Andrea Beck",
        name: "Andrea Beck",
        title: "Marketing Manager, FreshEats",
        quote:
          "From brand identity to paid ads, they handled everything. Our customer acquisition cost dropped 38% in the first quarter of working together.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Daniel Henderson",
        name: "Daniel Henderson",
        title: "Engineering Manager, DataScale",
        quote:
          "The analytics dashboard they built gives us real-time visibility into every campaign. We make decisions in hours now, not weeks.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Anderson Lima",
        name: "Anderson Lima",
        title: "Product Manager, TeamFlow",
        quote:
          "I have worked with a dozen agencies. These are the only ones who proactively brought ideas to the table instead of waiting for a brief.",
      },
    ],
  },
};

/** Coaching service — client testimonials about personal transformation */
export const CoachingServiceTestimonials: Story = {
  args: {
    headline: "Stories of transformation",
    subheadline:
      "Every journey starts with a single step. Here is how our coaching changed lives.",
    purpose: "testimonials",
    autoAdvanceDuration: 7,
    testimonials: [
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Renata Oliveira",
        name: "Renata Oliveira",
        title: "Executive Coach Client",
        quote:
          "After six months of sessions, I transitioned from middle management to a C-suite role. The clarity I gained about my leadership style was transformative.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Marcus Young",
        name: "Marcus Young",
        title: "Career Transition Client",
        quote:
          "I was stuck in finance for twelve years and dreaming of product management. My coach helped me build a transition plan that landed me a PM role in four months.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Aiko Tanaka",
        name: "Aiko Tanaka",
        title: "Entrepreneur Coaching Client",
        quote:
          "Starting a business felt overwhelming until we broke it down into weekly milestones. My revenue hit six figures within the first year of coaching.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of David Okonkwo",
        name: "David Okonkwo",
        title: "Performance Coaching Client",
        quote:
          "The accountability framework we built together eliminated my procrastination habit. I shipped three side projects in the time I used to spend planning one.",
      },
    ],
  },
};

/** Restaurant — guest reviews on dining experience and food quality */
export const RestaurantGuests: Story = {
  args: {
    headline: "Our guests speak",
    subheadline:
      "From first-time visitors to regulars, here is what keeps people coming back to our table.",
    purpose: "testimonials",
    autoAdvanceDuration: 4,
    testimonials: [
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Sofia Bergman",
        name: "Sofia Bergman",
        title: "Food Critic, Nordic Palate",
        quote:
          "The tasting menu was a revelation. Each course told a story rooted in local ingredients, and the wine pairings showed a sommelier who genuinely understands balance.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Marco Pellegrini",
        name: "Marco Pellegrini",
        title: "Regular Guest since 2021",
        quote:
          "I bring every out-of-town client here. The ambiance is elegant without being stuffy, and the kitchen accommodates dietary restrictions without making you feel like an afterthought.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Amara Diallo",
        name: "Amara Diallo",
        title: "Anniversary Dinner Guest",
        quote:
          "We celebrated our tenth anniversary here and the staff made it unforgettable. A personalized dessert, a handwritten note from the chef, and service that felt genuinely warm.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Chen Wei Lin",
        name: "Chen Wei Lin",
        title: "Weekend Brunch Regular",
        quote:
          "The brunch menu rotates seasonally and never disappoints. The sourdough pancakes with yuzu curd are worth driving across the city for every single Saturday.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Olivia Hartmann",
        name: "Olivia Hartmann",
        title: "Private Event Host",
        quote:
          "We booked the private dining room for a team dinner of twenty. The fixed menu, dedicated server, and seamless coordination made me look like I planned for months.",
      },
    ],
  },
};
