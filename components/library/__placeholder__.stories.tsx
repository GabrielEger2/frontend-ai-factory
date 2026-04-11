import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * Placeholder story to validate Storybook configuration.
 * Remove this file once real component stories are added.
 */
function Placeholder() {
  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>SiteGen Component Library</h1>
      <p>Storybook is configured and ready. Add components to get started.</p>
    </div>
  );
}

const meta: Meta<typeof Placeholder> = {
  title: "Setup/Placeholder",
  component: Placeholder,
};

export default meta;
type Story = StoryObj<typeof Placeholder>;

export const Default: Story = {};
