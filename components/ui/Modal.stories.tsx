import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import type { ModalProps } from "./Modal";
import { Button } from "./button";

const meta: Meta<typeof Modal> = {
  title: "UI/Modal",
  component: Modal,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full"],
    },
    hideCloseButton: {
      control: "boolean",
    },
  },
  parameters: {
    layout: "centered",
  },
};
export default meta;
type Story = StoryObj<typeof Modal>;

/* ------------------------------------------------------------------ */
/*  Interactive wrapper — Storybook args drive the modal config,       */
/*  but we need local state for open/close                             */
/* ------------------------------------------------------------------ */

function ModalDemo(props: Omit<ModalProps, "isOpen" | "onClose">) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal {...props} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Basic confirmation dialog with a short message and two actions */
export const Confirmation: Story = {
  render: (args) => (
    <ModalDemo
      size={args.size}
      className={args.className}
      hideCloseButton={args.hideCloseButton}
    >
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold text-base-content">
          Delete this project?
        </h2>
        <p className="text-base-content/70">
          This action cannot be undone. All generated pages, content, and
          deployment history for &quot;Oliveira Consultoria&quot; will be
          permanently removed.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost">Cancel</Button>
          <Button
            variant="primary"
            className="bg-error text-error-content hover:bg-error/90"
          >
            Delete Project
          </Button>
        </div>
      </div>
    </ModalDemo>
  ),
  args: {
    size: "sm",
  },
};

/** Contact form inside a modal — demonstrates form layout and medium size */
export const ContactForm: Story = {
  render: (args) => (
    <ModalDemo
      size={args.size}
      className={args.className}
      hideCloseButton={args.hideCloseButton}
    >
      <div className="p-6 space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-base-content">Get in touch</h2>
          <p className="mt-1 text-sm text-base-content/60">
            Fill in the form below and our team will reach out within 24 hours.
          </p>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-base-content">
                First name
              </span>
              <input
                type="text"
                placeholder="Maria"
                className="mt-1 block w-full rounded-field border border-base-300 bg-base-100 px-3 py-2 text-sm text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-base-content">
                Last name
              </span>
              <input
                type="text"
                placeholder="Santos"
                className="mt-1 block w-full rounded-field border border-base-300 bg-base-100 px-3 py-2 text-sm text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-medium text-base-content">Email</span>
            <input
              type="email"
              placeholder="maria@empresa.com"
              className="mt-1 block w-full rounded-field border border-base-300 bg-base-100 px-3 py-2 text-sm text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-base-content">
              Message
            </span>
            <textarea
              rows={4}
              placeholder="Tell us about your project..."
              className="mt-1 block w-full rounded-field border border-base-300 bg-base-100 px-3 py-2 text-sm text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </label>
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="ghost">Cancel</Button>
            <Button type="submit">Send Message</Button>
          </div>
        </form>
      </div>
    </ModalDemo>
  ),
  args: {
    size: "md",
  },
};

/** Feature announcement with an image — demonstrates large modal with visual content */
export const FeatureAnnouncement: Story = {
  render: (args) => (
    <ModalDemo
      size={args.size}
      className={args.className}
      hideCloseButton={args.hideCloseButton}
    >
      <div className="overflow-hidden">
        <img
          src="https://placehold.co/800x400/1a1a2e/eaeaea?text=AI+Website+Builder"
          alt="AI Website Builder feature preview"
          className="w-full object-cover"
        />
        <div className="p-6 space-y-4">
          <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            New Feature
          </div>
          <h2 className="text-2xl font-bold text-base-content">
            One-Click AI Website Generation
          </h2>
          <p className="text-base-content/70 leading-relaxed">
            Generate a complete, SEO-optimized website in minutes. Our AI
            pipeline researches your client&apos;s business, selects the perfect
            components, writes compelling copy, and deploys to a live URL — all
            from a single brief.
          </p>
          <ul className="space-y-2 text-sm text-base-content/70">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">&#10003;</span>
              Automatic competitor and segment analysis
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">&#10003;</span>
              Brand-matched color palette and typography
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">&#10003;</span>
              SEO meta tags, JSON-LD, and Open Graph included
            </li>
          </ul>
          <div className="flex gap-3 pt-2">
            <Button>Try It Now</Button>
            <Button variant="ghost">Learn More</Button>
          </div>
        </div>
      </div>
    </ModalDemo>
  ),
  args: {
    size: "lg",
  },
};

/** Long scrollable content — demonstrates scroll handling inside the modal */
export const ScrollableContent: Story = {
  render: (args) => (
    <ModalDemo
      size={args.size}
      className={args.className}
      hideCloseButton={args.hideCloseButton}
    >
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold text-base-content">
          Terms of Service
        </h2>
        <div className="space-y-4 text-sm text-base-content/70 leading-relaxed">
          <p>
            <strong className="text-base-content">
              1. Acceptance of Terms
            </strong>
            <br />
            By accessing and using the SiteGen platform, you agree to be bound
            by these Terms of Service and all applicable laws and regulations.
            If you do not agree with any of these terms, you are prohibited from
            using this service.
          </p>
          <p>
            <strong className="text-base-content">
              2. Service Description
            </strong>
            <br />
            SiteGen provides an AI-powered website generation service that
            creates SEO-optimized websites based on company information provided
            by authorized sellers. The generated websites are deployed via
            Vercel and managed through our seller dashboard.
          </p>
          <p>
            <strong className="text-base-content">
              3. User Responsibilities
            </strong>
            <br />
            You are responsible for the accuracy of all company information
            provided to the platform. You must ensure that you have
            authorization to create websites on behalf of the companies you
            represent. Any misuse of the platform for generating misleading or
            fraudulent content is strictly prohibited.
          </p>
          <p>
            <strong className="text-base-content">
              4. Intellectual Property
            </strong>
            <br />
            All generated website content, including AI-written copy, selected
            design components, and assembled page layouts, becomes the property
            of the client company upon deployment. SiteGen retains the right to
            use anonymized generation data for improving its AI models.
          </p>
          <p>
            <strong className="text-base-content">5. Data Privacy</strong>
            <br />
            We collect and process company data solely for the purpose of
            website generation. Personal data of sellers is handled in
            accordance with our Privacy Policy. We do not sell or share company
            data with third parties beyond what is necessary for website
            deployment.
          </p>
          <p>
            <strong className="text-base-content">
              6. Service Availability
            </strong>
            <br />
            While we strive for 99.9% uptime, we do not guarantee uninterrupted
            access to the platform. Scheduled maintenance windows will be
            communicated at least 48 hours in advance. Emergency maintenance may
            occur without prior notice.
          </p>
          <p>
            <strong className="text-base-content">
              7. Limitation of Liability
            </strong>
            <br />
            SiteGen is not liable for any indirect, incidental, or consequential
            damages arising from the use of generated websites. Our total
            liability is limited to the fees paid for the specific generation
            that gave rise to the claim.
          </p>
          <p>
            <strong className="text-base-content">8. Modifications</strong>
            <br />
            We reserve the right to modify these terms at any time. Continued
            use of the platform after changes constitutes acceptance of the
            modified terms. Major changes will be communicated via the seller
            dashboard.
          </p>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-base-300">
          <Button variant="ghost">Decline</Button>
          <Button>Accept Terms</Button>
        </div>
      </div>
    </ModalDemo>
  ),
  args: {
    size: "lg",
  },
};

/** Minimal modal without the close button — user must interact with the content */
export const NoCloseButton: Story = {
  render: (args) => (
    <ModalDemo size={args.size} className={args.className} hideCloseButton>
      <div className="p-6 space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-warning"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-base-content">Unsaved Changes</h2>
        <p className="text-base-content/70">
          You have unsaved changes to the website configuration for
          &quot;Padaria Bom Dia&quot;. Would you like to save before leaving?
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button variant="ghost">Discard</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </ModalDemo>
  ),
  args: {
    size: "sm",
    hideCloseButton: true,
  },
};
