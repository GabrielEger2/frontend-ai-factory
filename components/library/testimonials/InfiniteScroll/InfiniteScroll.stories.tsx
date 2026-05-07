import type { Meta, StoryObj } from "@storybook/react";
import InfiniteScroll from "./index";
import type { TestimonialItem } from "@ui/cards/TestimonialCard";

const meta: Meta<typeof InfiniteScroll> = {
  title: "Testimonial/InfiniteScroll",
  component: InfiniteScroll,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    styleKit: {
      control: "object",
    },
  },
};
export default meta;
type Story = StoryObj<typeof InfiniteScroll>;

/* ------------------------------------------------------------------ */
/*  Shared test data helpers                                           */
/* ------------------------------------------------------------------ */

function makeRow(
  items: Omit<TestimonialItem, "imageAlt">[],
): TestimonialItem[] {
  return items.map((item) => ({
    ...item,
    imageAlt: `Photo of ${item.name}`,
  }));
}

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** SaaS platform — customer success stories from diverse industries */
export const SaasTestimonials: Story = {
  args: {
    headline: "Trusted by Teams Worldwide",
    subheadline:
      "Over 2,000 companies rely on our platform to streamline their workflows and ship faster.",
    purpose: "testimonials",
    rows: [
      makeRow([
        {
          image: "https://placehold.co/112x176",
          name: "Sarah Mitchell",
          title: "VP of Engineering, Dataflow",
          quote:
            "We cut our deployment time by 73% in the first quarter. The CI/CD integration alone was worth the switch.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Marcus Chen",
          title: "CTO, Brightlane",
          quote:
            "The real-time collaboration features changed how our distributed team works. No more merge conflicts at 2am.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Elena Vasquez",
          title: "Product Lead, NovaTech",
          quote:
            "Finally a tool that understands product teams. The roadmap sync alone saves us five hours a week.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "James Okafor",
          title: "Founder, ShipStack",
          quote:
            "As a bootstrapped startup, we needed something powerful but affordable. This hit both marks perfectly.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Priya Sharma",
          title: "Engineering Manager, Vendex",
          quote:
            "Onboarding new engineers used to take two weeks. Now they push their first PR on day one.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Tom Bergstrom",
          title: "DevOps Lead, CloudNine",
          quote:
            "The monitoring dashboards give me peace of mind. I actually sleep through the night now.",
        },
      ]),
      makeRow([
        {
          image: "https://placehold.co/112x176",
          name: "Lisa Park",
          title: "Director of Engineering, Finova",
          quote:
            "Migrating from our legacy system was surprisingly smooth. The import tools handled everything.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "David Alonso",
          title: "Tech Lead, GreenGrid",
          quote:
            "Our test suite runs 4x faster. The parallel execution engine is genuinely impressive.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Rachel Kim",
          title: "Senior Developer, Luminate",
          quote:
            "The API documentation is the best I've seen. Clear, accurate, and always up to date.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Ahmed Hassan",
          title: "Founder, Nexus AI",
          quote:
            "Support response time averages under 10 minutes. That's unheard of in this space.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Karen O'Brien",
          title: "Platform Engineer, Atlas Corp",
          quote:
            "The plugin ecosystem is rich and well-maintained. We've barely needed to build custom tooling.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Michael Torres",
          title: "VP Product, Streamline",
          quote:
            "We evaluated seven alternatives. Nothing else came close on developer experience.",
        },
      ]),
      makeRow([
        {
          image: "https://placehold.co/112x176",
          name: "Sophie Laurent",
          title: "CTO, DesignFlow",
          quote:
            "Our design-to-code handoff went from days to hours. The Figma integration is seamless.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Ryan Nakamura",
          title: "Staff Engineer, PayBridge",
          quote:
            "SOC 2 compliance was a requirement for us. They made the security audit painless.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Amara Johnson",
          title: "Engineering Director, HealthSync",
          quote:
            "HIPAA compliance out of the box. That alone eliminated three months of custom work.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Kevin Walsh",
          title: "Founder, BuildRight",
          quote:
            "I've been recommending this to every founder I know. The free tier is genuinely generous.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Nina Petrov",
          title: "Lead Developer, UrbanStack",
          quote:
            "Hot module replacement that actually works. My frontend team's productivity doubled.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Chris Bellamy",
          title: "CTO, EduLearn",
          quote:
            "Scaled from 1K to 200K users without touching infrastructure. Serverless done right.",
        },
      ]),
    ],
  },
};

/** Digital agency — client reviews on creative and technical services */
export const AgencyClientReviews: Story = {
  args: {
    headline: "Clients Who Keep Coming Back",
    subheadline:
      "Long-term partnerships built on strategy, execution, and measurable results.",
    purpose: "testimonials",
    rows: [
      makeRow([
        {
          image: "https://placehold.co/112x176",
          name: "Lucia Fernandez",
          title: "CMO, Moda Viva",
          quote:
            "Our brand refresh drove a 28% increase in organic traffic within six weeks of launch.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Peter Holmgren",
          title: "CEO, Nordic Build",
          quote:
            "They delivered a complete digital strategy and executed it flawlessly. Every milestone met on time.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Ananya Desai",
          title: "Head of Digital, Zenith Health",
          quote:
            "Our patient portal redesign reduced support tickets by 45%. The UX research was exceptionally thorough.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Ricardo Bastos",
          title: "Founder, Caju Studio",
          quote:
            "They turned our vague brief into a stunning visual identity that resonates with our target audience perfectly.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Emily Chang",
          title: "VP Marketing, Orbit Analytics",
          quote:
            "Paid campaign ROAS went from 1.8x to 4.2x in the first quarter under their management.",
        },
      ]),
      makeRow([
        {
          image: "https://placehold.co/112x176",
          name: "Hassan Al-Farsi",
          title: "COO, Gulf Logistics",
          quote:
            "The supply chain dashboard they designed gives us real-time visibility across twelve warehouses.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Margot Dupont",
          title: "Creative Director, Atelier Blanc",
          quote:
            "Their photography direction and art production elevated our seasonal campaign beyond anything we imagined.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Tomasz Krawczyk",
          title: "CTO, FinEdge",
          quote:
            "The API layer they architected handles three million requests daily with sub-100ms response times.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Sophia Reyes",
          title: "Brand Manager, Casa Bonita",
          quote:
            "From packaging design to e-commerce, they delivered a cohesive brand experience across every touchpoint.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Daniel Ogunyemi",
          title: "Founder, LearnAfrica",
          quote:
            "Our ed-tech platform went from concept to 50K users in eight months. Their product thinking is world-class.",
        },
      ]),
      makeRow([
        {
          image: "https://placehold.co/112x176",
          name: "Clara Johansson",
          title: "Marketing Director, Solstice Travel",
          quote:
            "Booking conversions jumped 62% after the site redesign. The performance optimization was remarkable.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Wei Chen",
          title: "Product VP, CloudMesh",
          quote:
            "Their component library accelerated our frontend development by months. Consistent, accessible, well-documented.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Isabela Monteiro",
          title: "CEO, Verde Organicos",
          quote:
            "They built our subscription platform from scratch. Retention rate sits at 89% after twelve months.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Patrick O'Sullivan",
          title: "Director, Sullivan & Partners",
          quote:
            "Our law firm's website finally reflects the prestige of our practice. Client inquiries doubled after launch.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Yuki Tanaka",
          title: "Head of Product, Kibo Games",
          quote:
            "The game landing page they crafted had a 12% conversion rate on day one. Unheard of in our industry.",
        },
      ]),
    ],
  },
};

/** E-commerce brand — buyer reviews on product quality and service */
export const EcommerceReviews: Story = {
  args: {
    headline: "Loved by Thousands of Customers",
    subheadline:
      "Real reviews from real people who made the switch to better quality.",
    purpose: "testimonials",
    durations: [100, 60, 200],
    rows: [
      makeRow([
        {
          image: "https://placehold.co/112x176",
          name: "Beatrice Coleman",
          title: "Verified Buyer",
          quote:
            "The leather bag I ordered arrived beautifully packaged and the quality is even better than it looked online.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Andre Martins",
          title: "Repeat Customer",
          quote:
            "Fourth order this year. The sizing is always consistent and the fabrics hold up wash after wash.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Naomi Watkins",
          title: "Verified Buyer",
          quote:
            "Shipping to rural Australia took just five days. Faster than some domestic retailers manage.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Gabriel Souza",
          title: "First-time Buyer",
          quote:
            "Was skeptical about ordering shoes online but the fit guide was spot on. Perfect fit on the first try.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Ingrid Larsen",
          title: "Loyal Customer since 2022",
          quote:
            "Their customer service replaced a damaged item within 48 hours, no questions asked. That builds trust.",
        },
      ]),
      makeRow([
        {
          image: "https://placehold.co/112x176",
          name: "Kwame Asante",
          title: "Verified Buyer",
          quote:
            "The organic cotton collection is genuinely soft and ethically made. Finally a brand that means what it says.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Marta Novak",
          title: "Gift Buyer",
          quote:
            "Bought the watch set as a wedding gift. The presentation box alone made it look like a luxury purchase.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Luis Herrera",
          title: "Repeat Customer",
          quote:
            "The winter jacket has survived two Canadian winters without a single broken zipper or fading color.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Fiona McCarthy",
          title: "Verified Buyer",
          quote:
            "The return process was seamless. Free label, quick refund, and polite follow-up asking what went wrong.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Hiroshi Yamamoto",
          title: "Wholesale Buyer",
          quote:
            "We stock their products in our boutique. Consistent quality, reliable supply, and great wholesale terms.",
        },
      ]),
      makeRow([
        {
          image: "https://placehold.co/112x176",
          name: "Carmen Delgado",
          title: "Verified Buyer",
          quote:
            "The sustainable packaging was a pleasant surprise. Zero plastic, and everything is recyclable or compostable.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Ravi Patel",
          title: "Repeat Customer",
          quote:
            "Price-to-quality ratio is the best I have found. Comparable items from designer brands cost three times as much.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Julia Andersson",
          title: "Verified Buyer",
          quote:
            "The color in person matched the product photos exactly. Refreshing honesty in an industry full of filters.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Obi Nwosu",
          title: "First-time Buyer",
          quote:
            "Signed up for the loyalty program on a whim. The birthday discount and early access drops keep me coming back.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Elisa Bianchi",
          title: "Verified Buyer",
          quote:
            "The linen dress collection is perfection for Mediterranean summers. Light, breathable, and elegantly cut.",
        },
      ]),
    ],
  },
};
