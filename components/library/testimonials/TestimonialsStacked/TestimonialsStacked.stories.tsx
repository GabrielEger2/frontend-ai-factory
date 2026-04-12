import type { Meta, StoryObj } from "@storybook/react";
import TestimonialsStacked from "./index";

const meta: Meta<typeof TestimonialsStacked> = {
  title: "Testimonials/TestimonialsStacked",
  component: TestimonialsStacked,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    autoAdvanceDuration: {
      control: { type: "range", min: 2, max: 15, step: 1 },
    },
  },
};
export default meta;
type Story = StoryObj<typeof TestimonialsStacked>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Marketing agency — client feedback on campaign results */
export const MarketingAgency: Story = {
  args: {
    headline: "What our clients think",
    subheadline:
      "We let the results speak for themselves. Here's what the people behind the brands have to say.",
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
          "I've worked with a dozen agencies. These are the only ones who proactively brought ideas to the table instead of waiting for a brief.",
      },
    ],
  },
};

/** Law firm — client testimonials about legal services */
export const LawFirmClients: Story = {
  args: {
    headline: "Clients who trust us",
    subheadline:
      "Decades of experience protecting what matters most to families and businesses.",
    autoAdvanceDuration: 7,
    testimonials: [
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Margaret Sullivan",
        name: "Margaret Sullivan",
        title: "Estate Planning Client",
        quote:
          "They walked us through the entire trust and estate process with clarity and compassion. We finally feel confident about our family's future.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Richard Tran",
        name: "Richard Tran",
        title: "CEO, Tran Manufacturing",
        quote:
          "When we faced a contract dispute that threatened a $2M deal, their litigation team resolved it in mediation within six weeks. Worth every penny.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Sandra Perez",
        name: "Sandra Perez",
        title: "Immigration Client",
        quote:
          "My visa case had been stuck for two years with another attorney. They took over and got approval in four months. Life-changing.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of David Whitfield",
        name: "David Whitfield",
        title: "Small Business Owner",
        quote:
          "They structured our LLC, drafted all vendor contracts, and set up our IP protection. A true one-stop shop for business legal needs.",
      },
    ],
  },
};

/** Education platform — student and parent reviews */
export const EducationPlatform: Story = {
  args: {
    headline: "Hear from our students",
    subheadline:
      "Thousands of learners have accelerated their careers with our courses and mentorship programs.",
    autoAdvanceDuration: 4,
    testimonials: [
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Alex Rivera",
        name: "Alex Rivera",
        title: "Career Switcher, now Software Engineer",
        quote:
          "I went from zero coding experience to a full-time engineering role in 8 months. The curriculum is practical, not theoretical fluff.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Mei Lin",
        name: "Mei Lin",
        title: "Data Science Graduate",
        quote:
          "The capstone project alone got me three interview callbacks. Employers recognized the quality of the program immediately.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Jordan Brooks",
        name: "Jordan Brooks",
        title: "Parent of a Student",
        quote:
          "My daughter's confidence in math went from non-existent to genuinely enthusiastic. The tutors here are patient and adapt to each child's pace.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Fatima Al-Rashid",
        name: "Fatima Al-Rashid",
        title: "UX Design Graduate",
        quote:
          "The mentorship component sets this apart. Having a senior designer review my portfolio every two weeks accelerated my growth enormously.",
      },
      {
        image: "https://placehold.co/100x100",
        imageAlt: "Photo of Chris Nakamura",
        name: "Chris Nakamura",
        title: "Part-time Student, Full-time Parent",
        quote:
          "The self-paced format meant I could study after the kids went to bed. I earned my certificate without sacrificing family time.",
      },
    ],
  },
};
