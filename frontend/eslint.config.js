// client/eslint.config.js

import js from "@eslint/js";
import globals from "globals";
import reactRecommended from "eslint-plugin-react/configs/recommended";
import reactJsxRuntime from "eslint-plugin-react/configs/jsx-runtime";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    // Ignore the 'dist' directory where build output goes
    ignores: ["dist"],
  },
  {
    // Apply this configuration to all JavaScript and JSX files
    files: ["**/*.{js,jsx}"],

    // Use a standard JavaScript parser
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2020, // Or a later version like 2022 or "latest"
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
      },
    },

    // Extend recommended JavaScript and React configurations
    extends: [js.configs.recommended, reactRecommended, reactJsxRuntime],

    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      // Ensure NO @typescript-eslint plugin is listed here
    },

    rules: {
      // General JavaScript/React rules
      "no-unused-vars": ["warn", { args: "none" }],
      "react/react-in-jsx-scope": "off", // Not needed with React 17+ new JSX transform
      "react/prop-types": "off", // Recommended to turn off if not using PropTypes

      // Rules from react-hooks plugin
      ...reactHooks.configs.recommended.rules,

      // Rules from react-refresh plugin
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
  },
];
