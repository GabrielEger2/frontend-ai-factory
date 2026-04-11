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
            config: path.resolve(__dirname, "../postcss.config.js"),
          },
        },
      });
    }

    return config;
  },
};

export default config;
