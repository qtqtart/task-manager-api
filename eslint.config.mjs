import js from "@eslint/js";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import prettierPlugin from "eslint-plugin-prettier";
import globals from "globals";
import ts from "typescript-eslint";

const config = ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    ignores: ["dist", "node_modules"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.es2025,
        ...globals.node,
      },
    },
    plugins: {
      prettier: prettierPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      //
      "no-unused-vars": "off",
      "no-undef": "off",
      //
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
);

export default config;
