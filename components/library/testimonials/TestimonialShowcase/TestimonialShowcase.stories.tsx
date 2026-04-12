import type { Meta, StoryObj } from "@storybook/react";
import TestimonialShowcase from "./index";

const meta: Meta<typeof TestimonialShowcase> = {
  title: "Testimonials/TestimonialShowcase",
  component: TestimonialShowcase,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof TestimonialShowcase>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** SaaS platform — enterprise customer testimonials */
export const SaasEnterprise: Story = {
  args: {
    label: "Testimonials",
    headline: "What Our Customers Are Saying",
    testimonials: [
      {
        image: "https://placehold.co/500x700",
        imageAlt: "Marketing manager smiling in a modern office environment",
        name: "Camila Rocha",
        title: "Marketing Manager at Solutech",
        quote:
          "We cut our campaign launch time from two weeks to three days after switching. The workflow automation alone paid for the annual subscription within the first quarter.",
      },
      {
        image: "https://placehold.co/500x700",
        imageAlt:
          "Engineering lead working at a standing desk with dual monitors",
        name: "Rafael Almeida",
        title: "Engineering Lead at Vortex Labs",
        quote:
          "The API is remarkably well-documented. Our integration took forty hours instead of the two hundred we budgeted, and their support team answered every question within the hour.",
      },
      {
        image: "https://placehold.co/500x700",
        imageAlt: "Operations director reviewing analytics on a tablet",
        name: "Beatriz Mendes",
        title: "Operations Director at Praxis Group",
        quote:
          "What convinced us was the observability dashboard. We went from guessing where bottlenecks were to seeing them in real time, and our resolution time dropped by sixty percent.",
      },
    ],
  },
};

/** Real estate agency — client experiences */
export const RealEstateClients: Story = {
  args: {
    label: "Client Stories",
    headline: "Families Who Found Their Home",
    testimonials: [
      {
        image: "https://placehold.co/500x700",
        imageAlt: "Young couple standing in front of their new home",
        name: "Daniel and Laura Costa",
        title: "First-time homebuyers in Florianopolis",
        quote:
          "We were overwhelmed by the market until our agent sat down and filtered everything by what actually mattered to us: school district, commute time, and a backyard for the dog. Three weeks later we had the keys.",
      },
      {
        image: "https://placehold.co/500x700",
        imageAlt: "Retired couple relaxing on a balcony with an ocean view",
        name: "Paulo and Helena Ribeiro",
        title: "Downsized to a beachfront apartment in Balneario",
        quote:
          "After thirty years in the same house, selling felt impossible. The team handled staging, photography, and every showing. We got three offers above asking price within the first week.",
      },
    ],
  },
};

/** Fitness coaching — transformation stories */
export const FitnessTransformations: Story = {
  args: {
    headline: "Real Results From Real People",
    testimonials: [
      {
        image: "https://placehold.co/500x700",
        imageAlt:
          "Athlete finishing a morning run on a coastal trail at sunrise",
        name: "Thiago Ferreira",
        title: "Marathon runner and software developer",
        quote:
          "I went from barely finishing a 5K to completing my first marathon in under four hours. The personalized training plan adapted every week based on my recovery data, and the coaching calls kept me accountable on days I wanted to skip.",
      },
      {
        image: "https://placehold.co/500x700",
        imageAlt:
          "Woman lifting weights in a well-equipped gym with focused expression",
        name: "Ana Lucia Campos",
        title: "Strength training client for 18 months",
        quote:
          "I had never stepped into a weight room before joining the program. The coaches made it approachable from day one. My back pain is gone, I sleep better, and I genuinely look forward to training four days a week now.",
      },
      {
        image: "https://placehold.co/500x700",
        imageAlt:
          "Group fitness class doing kettlebell swings in an outdoor park",
        name: "Marcos Vieira",
        title: "Group class member since 2023",
        quote:
          "The community aspect is what keeps me coming back. Every Saturday morning session feels like catching up with friends who also happen to push you to your limit. I have lost twelve kilograms and gained a social circle I did not expect.",
      },
    ],
  },
};

/** Education platform — student success stories */
export const EducationPlatform: Story = {
  args: {
    label: "Student Stories",
    headline: "Where Learning Leads",
    testimonials: [
      {
        image: "https://placehold.co/500x700",
        imageAlt: "Young woman working on a laptop in a university library",
        name: "Juliana Martins",
        title: "Graduated from the Full-Stack Bootcamp in 2024",
        quote:
          "Six months ago I was a junior accountant wondering if a career change was realistic. The bootcamp gave me project-based experience, resume coaching, and three interview prep sessions. I landed a developer role two weeks after graduating.",
      },
      {
        image: "https://placehold.co/500x700",
        imageAlt:
          "Man studying at a coffee shop with notes spread across the table",
        name: "Eduardo Nascimento",
        title: "Data Science track, cohort 12",
        quote:
          "The mentors are industry practitioners, not just instructors. My capstone project used real data from a partner company, and the hiring manager at my current job told me that project was the reason she called me for an interview.",
      },
    ],
  },
};
