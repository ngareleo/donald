import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";


export default [
  {languageOptions: { globals: globals.node }},

  pluginJs.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts", "**/*.tsx"], 
    languageOptions: {
      parser: tsParser, 
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // "no-console": "warn",
      "quotes": ["warning", "double"],
      "semi": ["error", "always"],
    },
  },

];