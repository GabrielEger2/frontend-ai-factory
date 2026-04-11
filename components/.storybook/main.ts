import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";

const config: StorybookConfig = {
  stories: ["../library/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-webpack5-compiler-swc",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  webpackFinal: async (config) => {
    // Path aliases matching tsconfig.json paths
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@ui": path.resolve(__dirname, "../ui"),
      "@lib": path.resolve(__dirname, "../lib"),
      "@components": path.resolve(__dirname, "../library"),
      "@hooks": path.resolve(__dirname, "../hooks"),
    };

    const cssRule = config.module?.rules?.find(
      (rule) =>
        rule &&
        typeof rule === "object" &&
        rule.test instanceof RegExp &&
        rule.test.test(".css"),
    );

    if (cssRule && typeof cssRule === "object" && Array.isArray(cssRule.use)) {
      cssRule.use.push({
        loader: require.resolve("postcss-loader"),
        options: {
          postcssOptions: {
            plugins: [
              require("tailwindcss")({
                config: path.resolve(__dirname, "../tailwind.config.ts"),
              }),
              require("autoprefixer"),
            ],
          },
        },
      });
    }

    return config;
  },
};

export default config;
