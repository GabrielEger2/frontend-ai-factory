"use client";

import React from "react";
import type { Decorator } from "@storybook/react";
import "../src/themes/default.css";
import "../src/globals.css";

const ThemeDecorator: Decorator = (Story, context) => {
  const theme = context.globals.theme || "default";

  return (
    <div data-theme={theme} className="font-sans">
      <Story />
    </div>
  );
};

export default ThemeDecorator;
