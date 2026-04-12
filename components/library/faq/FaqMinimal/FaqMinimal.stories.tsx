import type { Meta, StoryObj } from "@storybook/react";
import FaqMinimal from "./index";

const meta: Meta<typeof FaqMinimal> = {
  title: "FAQ/FaqMinimal",
  component: FaqMinimal,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    defaultOpenIndex: { control: "number" },
  },
};
export default meta;
type Story = StoryObj<typeof FaqMinimal>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Online course platform — prospective student questions */
export const OnlineCourses: Story = {
  args: {
    headline: "Common Questions",
    subheadline:
      "Find quick answers about enrollment, certifications, and course access.",
    defaultOpenIndex: 0,
    items: [
      {
        question: "Are the courses self-paced or scheduled?",
        answer:
          "All courses are fully self-paced. Once enrolled, you have lifetime access to the material and can complete modules on your own schedule. Live Q&A sessions with instructors happen weekly but are recorded for later viewing.",
      },
      {
        question: "Do I receive a certificate upon completion?",
        answer:
          "Yes. Every course awards a verified digital certificate that you can share on LinkedIn or add to your resume. Professional development credits are available for select courses in partnership with accrediting bodies.",
      },
      {
        question: "What if the course is not what I expected?",
        answer:
          "We offer a full refund within 14 days of purchase, no questions asked. If you have completed more than 30% of the material, we will issue course credit toward any other program in our catalog.",
      },
      {
        question: "Can my employer pay for the course?",
        answer:
          "Absolutely. We provide invoices formatted for corporate reimbursement, and many employers cover professional development expenses. We also offer volume discounts for teams of five or more.",
      },
    ],
  },
};

/** Real estate agency — buyer questions */
export const RealEstateBuyer: Story = {
  args: {
    headline: "Buying Your First Home",
    subheadline:
      "The process can feel overwhelming. We have compiled the most common questions from first-time buyers.",
    items: [
      {
        question: "How much should I save for a down payment?",
        answer:
          "Most conventional loans require 5-20% of the purchase price. FHA loans can go as low as 3.5%. We recommend saving at least 10% plus an additional 2-3% for closing costs and moving expenses.",
      },
      {
        question: "How long does the buying process typically take?",
        answer:
          "From your first showing to closing day, expect 45 to 90 days. Pre-approval, home inspection, and appraisal are the three milestones that most affect the timeline.",
      },
      {
        question: "What credit score do I need to qualify for a mortgage?",
        answer:
          "A score of 620 or above qualifies for most conventional programs. Scores above 740 unlock the best interest rates. If your score is below 620, FHA and certain state programs may still be available.",
      },
      {
        question: "Should I get a home inspection even for new construction?",
        answer:
          "Always. New builds can have issues the builder missed — improper grading, HVAC imbalances, cosmetic defects. An independent inspection protects your investment and gives you leverage to request corrections before closing.",
      },
    ],
  },
};

/** Veterinary clinic — pet owner questions */
export const VetClinic: Story = {
  args: {
    headline: "Questions From Pet Parents",
    items: [
      {
        question: "How often should my pet have a wellness exam?",
        answer:
          "We recommend annual exams for adult pets and semi-annual visits for senior animals over seven years old. Puppies and kittens need a series of visits in their first year to complete vaccinations and growth monitoring.",
      },
      {
        question: "Do you offer payment plans for unexpected procedures?",
        answer:
          "Yes. We partner with CareCredit and Scratchpay to offer interest-free financing for 6 to 12 months on qualifying procedures. We also accept all major pet insurance providers and can submit claims on your behalf.",
      },
      {
        question: "What should I do in a pet emergency after hours?",
        answer:
          "Call our emergency line at any time. A triage nurse will assess the situation and direct you to our 24-hour partner facility if needed. For life-threatening emergencies, proceed directly to the emergency hospital.",
      },
    ],
  },
};
