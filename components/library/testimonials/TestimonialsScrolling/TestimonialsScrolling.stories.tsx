import type { Meta, StoryObj } from "@storybook/react";
import TestimonialsScrolling from "./index";
import type { TestimonialItem } from "@ui/cards/TestimonialCard";

const meta: Meta<typeof TestimonialsScrolling> = {
  title: "Testimonials/TestimonialsScrolling",
  component: TestimonialsScrolling,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof TestimonialsScrolling>;

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
export const SaasCustomerSuccess: Story = {
  args: {
    headline: "Trusted by Teams Worldwide",
    subheadline:
      "Over 2,000 companies rely on our platform to streamline their workflows and ship faster.",
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

/** Real estate agency — client testimonials about property services */
export const RealEstateClients: Story = {
  args: {
    headline: "What Our Clients Say",
    subheadline: "Helping families find their perfect home since 2008.",
    rows: [
      makeRow([
        {
          image: "https://placehold.co/112x176",
          name: "Robert & Diane Mills",
          title: "Homeowners, Westlake",
          quote:
            "They found us a house that checked every box on our list, and we closed two weeks under schedule.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Angela Moretti",
          title: "First-time Buyer",
          quote:
            "I was terrified of the mortgage process. My agent walked me through every single step with patience.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Jamal & Keisha Brown",
          title: "Investors, Downtown Portfolio",
          quote:
            "Three rental properties purchased through them. Each deal was smooth and well below market rate.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Patricia Sandoval",
          title: "Seller, Riverside Terrace",
          quote:
            "My condo sold in 11 days at asking price. The staging advice alone made a huge difference.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Henry Chen",
          title: "Relocating Executive",
          quote:
            "Moving across the country was stressful enough. They handled everything on the ground while I was 2,000 miles away.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Laura Fitzpatrick",
          title: "Downsizer, Maple Heights",
          quote:
            "After 30 years in our family home, downsizing felt emotional. Our agent treated us with real empathy.",
        },
      ]),
      makeRow([
        {
          image: "https://placehold.co/112x176",
          name: "Derek Washington",
          title: "Commercial Buyer",
          quote:
            "The market analysis they provided was better than what I got from two paid consultants.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Samantha Lee",
          title: "Condo Owner, Harbor View",
          quote:
            "From open house to closing in 23 days. I couldn't believe how fast everything moved.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Frank & Maria Russo",
          title: "Vacation Home Buyers",
          quote:
            "Our beach house was a dream we had for years. They made it real on our exact budget.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Tanya Brooks",
          title: "First-time Seller",
          quote:
            "The photography and virtual tour they arranged brought in 40 showing requests in the first weekend.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Oliver Grant",
          title: "Property Developer",
          quote:
            "They understand zoning, permits, and development potential better than any residential agency I've worked with.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Diana Kowalski",
          title: "Retiree, Lakeshore",
          quote:
            "Patient, responsive, and genuinely kind. They never rushed us despite our indecision.",
        },
      ]),
      makeRow([
        {
          image: "https://placehold.co/112x176",
          name: "Carlos Mendez",
          title: "Multi-family Investor",
          quote:
            "The ROI projections they put together were spot-on. My duplex cash-flows exactly as they predicted.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Jennifer Walsh",
          title: "Homeowner, Oak Park",
          quote:
            "We needed to sell and buy simultaneously. They coordinated both closings on the same day.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Paul & Wendy Hoffman",
          title: "Buyers, Greenfield",
          quote:
            "Our agent spotted foundation issues during the walkthrough that saved us from a very costly mistake.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Mia Zhang",
          title: "International Buyer",
          quote:
            "Buying property from overseas seemed impossible. They handled the legal and financial complexities flawlessly.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Thomas Wright",
          title: "Landlord, Central District",
          quote:
            "Five properties managed through their referral network. Vacancy rate dropped from 12% to under 3%.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Grace Adeyemi",
          title: "Townhome Buyer",
          quote:
            "They negotiated $18K off the asking price and got the seller to cover closing costs. Incredible advocates.",
        },
      ]),
    ],
  },
};

/** Fitness brand — gym member stories */
export const FitnessMembers: Story = {
  args: {
    headline: "Real Results, Real People",
    subheadline:
      "Hear from members who transformed their fitness journey with us.",
    durations: [100, 60, 200],
    rows: [
      makeRow([
        {
          image: "https://placehold.co/112x176",
          name: "Jake Morrison",
          title: "Member since 2021",
          quote:
            "Lost 35 pounds in six months. The personal training program was designed around my schedule and my injuries.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Aisha Patel",
          title: "Competitive Runner",
          quote:
            "The sports performance coaching took 40 seconds off my 5K time in three months.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Brian Larsen",
          title: "Strength Athlete",
          quote:
            "Best equipped gym I've trained at. Competition platforms, calibrated plates, and coaches who actually compete.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Maria Santos",
          title: "Yoga & Pilates Member",
          quote:
            "The mind-body classes here are nothing like the generic ones at chain gyms. Every instructor is certified and passionate.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Devon Clark",
          title: "New Member",
          quote:
            "I was intimidated walking in. By the end of my first session, I felt completely at home.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Linda Ng",
          title: "Senior Fitness Member",
          quote:
            "At 67, I'm stronger than I was at 50. The age-appropriate programming here is outstanding.",
        },
      ]),
      makeRow([
        {
          image: "https://placehold.co/112x176",
          name: "Tyler Reed",
          title: "CrossFit Member",
          quote:
            "The community pushes you without the toxic competitiveness. Everyone cheers for each other.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Hannah Berg",
          title: "Post-rehab Member",
          quote:
            "After my knee surgery, the rehab-to-fitness program got me back to hiking in four months.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Oscar Ramirez",
          title: "Boxing Member",
          quote:
            "The boxing program is legit. Real technique, real sparring, and coaches with competitive backgrounds.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Emma Lindqvist",
          title: "Swimming Member",
          quote:
            "The lap pool is always well-maintained and never overcrowded. Morning swim slots are a highlight of my day.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Ray Donahue",
          title: "Weight Loss Journey",
          quote:
            "Down 60 pounds and keeping it off. The nutrition coaching made all the difference.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Chloe Martin",
          title: "Group Fitness Regular",
          quote:
            "Spin class here is an experience. Great music, great energy, and instructors who remember your name.",
        },
      ]),
      makeRow([
        {
          image: "https://placehold.co/112x176",
          name: "Andre Williams",
          title: "Personal Training Client",
          quote:
            "My trainer adjusted my program weekly based on how I was recovering. That personalized attention is rare.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Katya Sokolov",
          title: "Martial Arts Student",
          quote:
            "Started with zero experience. Eight months later I earned my first belt. The patience of the instructors is incredible.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Paul Fitzgerald",
          title: "Corporate Wellness Member",
          quote:
            "Our company's wellness program is here. The corporate rates and flexible scheduling make it easy for the whole team.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Diana Osei",
          title: "Dance Fitness Member",
          quote:
            "Zumba three times a week and I've never been happier. Exercise shouldn't feel like punishment.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Greg Tanaka",
          title: "Early Morning Regular",
          quote:
            "5am opening means I get a full workout before my kids wake up. That flexibility is everything.",
        },
        {
          image: "https://placehold.co/112x176",
          name: "Isabelle Moreau",
          title: "Prenatal Fitness Member",
          quote:
            "The prenatal classes kept me strong through my entire pregnancy. I felt prepared and supported.",
        },
      ]),
    ],
  },
};
