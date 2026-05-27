// @ts-check

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import { globalIgnores } from "eslint/config";

const eslintConfig = [
  // Global ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "node_modules/**",
    "next-env.d.ts",
  ]),

  // Base JS/TS rules
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Allow explicit any with some safety
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow require in scripts
      "@typescript-eslint/no-require-imports": "off",
      // Allow underscore-prefixed unused params (callback convention)
      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
      }],
    },
  },

  // React plugin
  {
    ...reactPlugin.configs.flat.recommended,
    ...reactPlugin.configs.flat["jsx-runtime"],
    settings: {
      react: {
        version: "19.0",
      },
    },
  },

  // React Hooks
  {
    plugins: {
      "react-hooks": reactHooksPlugin,
    },
    rules: reactHooksPlugin.configs.recommended.rules,
  },
];

export default eslintConfig;
