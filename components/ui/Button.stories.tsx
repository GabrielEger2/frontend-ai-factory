import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  SlideButton,
  DotExpandLink,
  DrawOutlineButton,
  CtaButton,
} from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "accent",
        "outline",
        "ghost",
        "link",
        "glow",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "icon"],
    },
  },
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Button>;

/** All standard button variants side by side */
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4 min-h-screen items-center justify-center w-screen">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button
        variant="glow"
        className="bg-primary text-primary-content hover:shadow-primary/40"
      >
        Glow
      </Button>
    </div>
  ),
};

/** Small, medium, and large sizes */
export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-4 min-h-screen items-center justify-center w-screen">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

/** Animated button variants — Slide, DotExpand, DrawOutline */
export const AnimatedVariants: Story = {
  render: () => (
    <div className="flex flex-col min-h-screen items-center justify-center w-screen gap-12">
      <div>
        <p className="mb-3 text-sm font-medium text-base-content/60">Slide</p>
        <div className="flex flex-wrap items-center gap-4">
          <SlideButton colorScheme="primary">Primary</SlideButton>
          <SlideButton colorScheme="secondary">Secondary</SlideButton>
          <SlideButton colorScheme="accent">Accent</SlideButton>
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm font-medium text-base-content/60">
          Dot Expand
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <DotExpandLink href="#" colorScheme="primary">
            Primary
          </DotExpandLink>
          <DotExpandLink href="#" colorScheme="secondary">
            Secondary
          </DotExpandLink>
          <DotExpandLink href="#" colorScheme="accent">
            Accent
          </DotExpandLink>
          <DotExpandLink href="#" colorScheme="neutral">
            Neutral
          </DotExpandLink>
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm font-medium text-base-content/60">
          Draw Outline
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <DrawOutlineButton colorScheme="primary">Primary</DrawOutlineButton>
          <DrawOutlineButton colorScheme="secondary">
            Secondary
          </DrawOutlineButton>
          <DrawOutlineButton colorScheme="accent">Accent</DrawOutlineButton>
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm font-medium text-base-content/60">Glow</p>
        <div className="flex flex-wrap items-center gap-4">
          <CtaButton variant="glow" colorScheme="primary">
            Primary
          </CtaButton>
          <CtaButton variant="glow" colorScheme="secondary">
            Secondary
          </CtaButton>
          <CtaButton variant="glow" colorScheme="accent">
            Accent
          </CtaButton>
        </div>
      </div>
    </div>
  ),
};

/** CtaButton — unified component with variant + colorScheme matrix */
export const CtaButtonVariants: Story = {
  render: () => (
    <div className="flex flex-col min-h-screen items-center justify-center w-screen gap-12">
      {(["default", "slide", "dotExpand", "drawOutline", "glow"] as const).map(
        (variant) => (
          <div key={variant}>
            <p className="mb-3 text-sm font-medium text-base-content/60">
              {variant}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <CtaButton variant={variant} href="#" colorScheme="primary">
                Primary
              </CtaButton>
              <CtaButton variant={variant} href="#" colorScheme="secondary">
                Secondary
              </CtaButton>
              <CtaButton variant={variant} href="#" colorScheme="accent">
                Accent
              </CtaButton>
            </div>
          </div>
        ),
      )}
    </div>
  ),
};
