import type { Meta, StoryObj } from "@storybook/react";
import CarouselCards from "./index";

const meta: Meta<typeof CarouselCards> = {
  title: "Carousel/CarouselCards",
  component: CarouselCards,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    cardWidth: {
      control: { type: "range", min: 200, max: 500, step: 25 },
    },
    cardGap: {
      control: { type: "range", min: 8, max: 40, step: 4 },
    },
  },
};
export default meta;
type Story = StoryObj<typeof CarouselCards>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Company blog -- articles by team members */
export const TeamBlog: Story = {
  args: {
    headline: "From Our Blog",
    cards: [
      {
        image: "https://placehold.co/700x400/2c3e50/e0e0e0?text=AI+Strategy",
        imageAlt:
          "Abstract illustration of neural network nodes connected together",
        tag: "John Anderson",
        title: "We built an AI chess bot with ChatGPT",
        description:
          "How our engineering team used GPT-4 to train a chess engine that adapts to each player's style.",
      },
      {
        image: "https://placehold.co/700x400/34495e/e0e0e0?text=Personal+Brand",
        imageAlt: "Designer workspace with laptop showing a portfolio website",
        tag: "Kyle Parsons",
        title: "How to grow your personal brand as a web designer",
        description:
          "Five actionable steps to stand out in a crowded market and attract premium clients.",
      },
      {
        image: "https://placehold.co/700x400/1e272e/e0e0e0?text=Monoliths",
        imageAlt: "Server rack in a modern data center with blue LED lighting",
        tag: "Andrea Bates",
        title: "Calm down, monoliths are totally fine",
        description:
          "Not every project needs microservices. Here's when a monolith is the smarter choice.",
      },
      {
        image: "https://placehold.co/700x400/0c2461/e0e0e0?text=Framer+Motion",
        imageAlt: "Animated UI components floating on a gradient background",
        tag: "Jess Drum",
        title: "A quick guide to Framer Motion (for dummies)",
        description:
          "Get smooth React animations running in under 15 minutes with this beginner-friendly walkthrough.",
      },
      {
        image: "https://placehold.co/700x400/2d3436/e0e0e0?text=Kubernetes",
        imageAlt:
          "Container ships at port representing containerized applications",
        tag: "Phil White",
        title: "You probably don't need Kubernetes",
        description:
          "When simpler deployment tools will save you thousands of hours and dollars.",
      },
      {
        image: "https://placehold.co/700x400/636e72/e0e0e0?text=JavaScript",
        imageAlt: "Code editor showing JavaScript with syntax highlighting",
        tag: "Karen Peabody",
        title: "State of JavaScript in 2025",
        description:
          "The annual survey results are in — here are the frameworks and tools winning this year.",
      },
      {
        image: "https://placehold.co/700x400/4a4a4a/e0e0e0?text=Python",
        imageAlt: "Python logo over a data visualization dashboard",
        tag: "Dante Gordon",
        title: "What's new in Python 3.13?",
        description:
          "Pattern matching improvements, a faster runtime, and the features your team should adopt now.",
      },
    ],
  },
};

/** E-commerce product carousel with fewer items */
export const ProductShowcase: Story = {
  args: {
    headline: "New Arrivals",
    cards: [
      {
        image: "https://placehold.co/700x400/1a1a2e/e0e0e0?text=Sneakers",
        imageAlt: "White minimal sneakers on a marble surface",
        tag: "Footwear",
        title: "Urban Runner Pro",
        description:
          "Lightweight mesh upper with responsive cushioning for all-day comfort.",
      },
      {
        image: "https://placehold.co/700x400/2d3436/e0e0e0?text=Jacket",
        imageAlt: "Olive green utility jacket on a mannequin",
        tag: "Outerwear",
        title: "Heritage Field Jacket",
        description:
          "Water-resistant waxed cotton with brass hardware, inspired by vintage military design.",
      },
      {
        image: "https://placehold.co/700x400/0a3d62/e0e0e0?text=Watch",
        imageAlt: "Automatic watch with a deep blue dial and leather strap",
        tag: "Accessories",
        title: "Meridian Automatic 38mm",
        description:
          "Swiss movement, sapphire crystal, and a 100-hour power reserve in a slim profile.",
      },
      {
        image: "https://placehold.co/700x400/4a4a4a/e0e0e0?text=Bag",
        imageAlt: "Leather weekender bag open on a hotel bed",
        tag: "Bags",
        title: "The Weekender in Cognac",
        description:
          "Full-grain leather travel bag with a shoe compartment and padded laptop sleeve.",
      },
    ],
    cardWidth: 300,
  },
};

/** Agency portfolio -- case study cards */
export const CaseStudies: Story = {
  args: {
    headline: "Recent Work",
    cards: [
      {
        image: "https://placehold.co/700x400/6c5ce7/e0e0e0?text=Rebrand",
        imageAlt: "Before and after screenshots of a fintech app redesign",
        tag: "FinTech",
        title: "NovaPay brand refresh and mobile app redesign",
        description:
          "A complete visual identity overhaul that boosted user activation by 42%.",
      },
      {
        image: "https://placehold.co/700x400/00b894/e0e0e0?text=E-Commerce",
        imageAlt: "Product listing page of a sustainable fashion marketplace",
        tag: "E-Commerce",
        title: "GreenThread marketplace launch",
        description:
          "From zero to 12,000 active listings in 90 days with a headless Shopify build.",
      },
      {
        image: "https://placehold.co/700x400/fdcb6e/1a1a2e?text=Dashboard",
        imageAlt: "Analytics dashboard with real-time metrics and charts",
        tag: "SaaS",
        title: "DataPulse analytics dashboard",
        description:
          "Real-time metrics visualization that reduced customer churn by 28%.",
      },
      {
        image: "https://placehold.co/700x400/e17055/e0e0e0?text=Healthcare",
        imageAlt:
          "Telemedicine app interface showing a video call with a doctor",
        tag: "HealthTech",
        title: "MediConnect telehealth platform",
        description:
          "HIPAA-compliant video consultations serving 50,000 patients monthly.",
      },
      {
        image: "https://placehold.co/700x400/0984e3/e0e0e0?text=Education",
        imageAlt: "Interactive learning module with progress indicators",
        tag: "EdTech",
        title: "LearnPath adaptive curriculum engine",
        description:
          "Personalized learning paths that improved test scores by an average of 31%.",
      },
    ],
  },
};
