import type { Meta, StoryObj } from "@storybook/react";
import StaggerFan from "./index";

const meta: Meta<typeof StaggerFan> = {
  title: "Testimonial/StaggerFan",
  component: StaggerFan,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    sectionHeight: {
      control: { type: "range", min: 400, max: 800, step: 50 },
    },
    cardSizeLg: {
      control: { type: "range", min: 280, max: 450, step: 15 },
    },
    cardSizeSm: {
      control: { type: "range", min: 220, max: 350, step: 10 },
    },
    styleKit: {
      control: "object",
    },
  },
};
export default meta;
type Story = StoryObj<typeof StaggerFan>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Startup press — media quotes and industry recognition */
export const StartupPressReviews: Story = {
  args: {
    purpose: "testimonials",
    testimonials: [
      {
        image: "https://placehold.co/100x130/2c3e50/e0e0e0?text=TC",
        imageAlt: "TechCrunch logo mark",
        name: "TechCrunch",
        title: "Product Review, March 2025",
        quote:
          "A rare find in the crowded B2B space. The product is intuitive enough for non-technical users yet powerful enough for enterprise workflows.",
      },
      {
        image: "https://placehold.co/100x130/34495e/e0e0e0?text=FT",
        imageAlt: "Forbes Technology logo mark",
        name: "Forbes Technology",
        title: "Top 50 Startups to Watch",
        quote:
          "Their approach to AI-assisted automation sets a new standard. Revenue growth of 340% year-over-year speaks for itself.",
      },
      {
        image: "https://placehold.co/100x130/1e272e/e0e0e0?text=WD",
        imageAlt: "Wired Digital logo mark",
        name: "Wired",
        title: "Innovation Spotlight, January 2025",
        quote:
          "What impressed us most was the speed of iteration. A feature requested by users on Monday was shipped by Thursday.",
      },
      {
        image: "https://placehold.co/100x130/0a3d62/e0e0e0?text=PH",
        imageAlt: "Product Hunt featured badge",
        name: "Product Hunt",
        title: "Product of the Week",
        quote:
          "Launched to over 2,000 upvotes and held the number one spot for three consecutive days. Community feedback was overwhelmingly positive.",
      },
      {
        image: "https://placehold.co/100x130/0c2461/e0e0e0?text=VB",
        imageAlt: "VentureBeat logo mark",
        name: "VentureBeat",
        title: "AI & Machine Learning Report",
        quote:
          "Their proprietary model fine-tuning pipeline reduces deployment time from weeks to hours. A genuinely novel technical contribution.",
      },
      {
        image: "https://placehold.co/100x130/4a4a4a/e0e0e0?text=BI",
        imageAlt: "Business Insider logo mark",
        name: "Business Insider",
        title: "Enterprise Software Rankings",
        quote:
          "Ranked among the top five fastest-growing enterprise tools in the LATAM region. Customer retention rate exceeds 95%.",
      },
      {
        image: "https://placehold.co/100x130/636e72/e0e0e0?text=MW",
        imageAlt: "MIT Technology Review logo mark",
        name: "MIT Technology Review",
        title: "Innovators Under 35 Feature",
        quote:
          "The founding team brings a rare combination of deep ML expertise and product design sensibility that shows in every interaction.",
      },
      {
        image: "https://placehold.co/100x130/2d3436/e0e0e0?text=TN",
        imageAlt: "The Next Web logo mark",
        name: "The Next Web",
        title: "Annual Tech Conference Demo",
        quote:
          "Their live demo drew the largest crowd at TNW Conference this year. The audience Q&A ran twenty minutes over time.",
      },
      {
        image: "https://placehold.co/100x130/5a5a5a/e0e0e0?text=FC",
        imageAlt: "Fast Company logo mark",
        name: "Fast Company",
        title: "Most Innovative Companies 2025",
        quote:
          "Disrupting an industry that has been stagnant for a decade. Their user-first philosophy is a masterclass in product thinking.",
      },
      {
        image: "https://placehold.co/100x130/3a3a3a/e0e0e0?text=SN",
        imageAlt: "SaaS News logo mark",
        name: "SaaS News",
        title: "Monthly Roundup, February 2025",
        quote:
          "Closed a Series B at a 200 million dollar valuation. Investors cited best-in-class Net Revenue Retention of 145%.",
      },
    ],
  },
};

/** Freelancer portfolio — direct client quotes about project delivery */
export const FreelancerClientQuotes: Story = {
  args: {
    purpose: "testimonials",
    sectionHeight: 550,
    cardSizeLg: 340,
    cardSizeSm: 270,
    testimonials: [
      {
        image: "https://placehold.co/100x130/e17055/e0e0e0?text=AM",
        imageAlt: "Headshot of Ana Moreira, founder of Estudio Criativo",
        name: "Ana Moreira",
        title: "Founder, Estudio Criativo",
        quote:
          "The brand identity delivered exceeded every mood board we shared. Our clients immediately noticed the new direction.",
      },
      {
        image: "https://placehold.co/100x130/fdcb6e/1a1a2e?text=RK",
        imageAlt: "Headshot of Roberto Kenji, CTO of Nexo Digital",
        name: "Roberto Kenji",
        title: "CTO, Nexo Digital",
        quote:
          "We needed a React specialist for a two-week sprint. The code quality was production-ready from day one with zero rework.",
      },
      {
        image: "https://placehold.co/100x130/0984e3/e0e0e0?text=LP",
        imageAlt: "Headshot of Lucia Peralta, Marketing Director",
        name: "Lucia Peralta",
        title: "Marketing Director, Viva Travel",
        quote:
          "Our landing page conversion rate jumped from 1.2% to 4.8% after the redesign. The copywriting was equally strong.",
      },
      {
        image: "https://placehold.co/100x130/a29bfe/1a1a2e?text=DF",
        imageAlt: "Headshot of Diego Fonseca, product manager",
        name: "Diego Fonseca",
        title: "Product Manager, FinControl",
        quote:
          "Delivered the MVP three days ahead of schedule. Communication was clear and proactive throughout the entire engagement.",
      },
      {
        image: "https://placehold.co/100x130/55efc4/1a1a2e?text=MT",
        imageAlt: "Headshot of Marina Torres, CEO of Alma Organics",
        name: "Marina Torres",
        title: "CEO, Alma Organics",
        quote:
          "Our e-commerce store was built with care for every detail. Sales in the first month covered the entire project cost.",
      },
    ],
  },
};

/** E-learning platform — student stories about course outcomes */
export const ElearningStudentStories: Story = {
  args: {
    purpose: "testimonials",
    sectionHeight: 650,
    testimonials: [
      {
        image: "https://placehold.co/100x130/74b9ff/1a1a2e?text=CS",
        imageAlt: "Headshot of Camila Santos, junior developer",
        name: "Camila Santos",
        title: "Junior Developer, hired after bootcamp",
        quote:
          "I went from zero programming knowledge to a full-time developer role in seven months. The project-based curriculum made all the difference.",
      },
      {
        image: "https://placehold.co/100x130/fab1a0/1a1a2e?text=TN",
        imageAlt: "Headshot of Thiago Nascimento, data analyst",
        name: "Thiago Nascimento",
        title: "Data Analyst at CloudMetrics",
        quote:
          "The data science track gave me hands-on experience with real datasets. My capstone project became a talking point in every interview.",
      },
      {
        image: "https://placehold.co/100x130/dfe6e9/2d3436?text=JR",
        imageAlt: "Headshot of Juliana Rocha, UX designer",
        name: "Juliana Rocha",
        title: "UX Designer, transitioned from teaching",
        quote:
          "As a former teacher, I thought design was out of reach. The mentorship program paired me with a senior designer who guided my portfolio from scratch.",
      },
      {
        image: "https://placehold.co/100x130/b2bec3/2d3436?text=FA",
        imageAlt: "Headshot of Felipe Araujo, DevOps engineer",
        name: "Felipe Araujo",
        title: "DevOps Engineer at ScaleUp",
        quote:
          "The cloud infrastructure module was the most practical I have found online. I passed the AWS certification on my first attempt thanks to the lab exercises.",
      },
      {
        image: "https://placehold.co/100x130/636e72/e0e0e0?text=LM",
        imageAlt: "Headshot of Larissa Mendes, product owner",
        name: "Larissa Mendes",
        title: "Product Owner at AgileForce",
        quote:
          "The product management course taught me frameworks I use daily. Prioritization and stakeholder communication were game changers.",
      },
      {
        image: "https://placehold.co/100x130/2d3436/e0e0e0?text=RP",
        imageAlt: "Headshot of Rafael Pinheiro, mobile developer",
        name: "Rafael Pinheiro",
        title: "Mobile Developer at AppNova",
        quote:
          "Built and published my first React Native app during the course. The instructor feedback on each pull request accelerated my learning enormously.",
      },
      {
        image: "https://placehold.co/100x130/6c5ce7/e0e0e0?text=BV",
        imageAlt: "Headshot of Beatriz Vieira, cybersecurity analyst",
        name: "Beatriz Vieira",
        title: "Cybersecurity Analyst at SecureNet",
        quote:
          "The security specialization track covered real-world scenarios including penetration testing, incident response, and compliance auditing.",
      },
    ],
  },
};
