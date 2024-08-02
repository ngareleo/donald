const globals = require("globals");
const pluginJs = require("@eslint/js");
const tseslint = require("typescript-eslint");
const tsParser = require("@typescript-eslint/parser");

const rawConfig = {
    extends: ["eslint:recommended", "plugin:react/recommended"],
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    languageOptions: {
        parser: tsParser,
        parserOptions: {
            project: "./tsconfig.json",
        },
        globals: {
            ...globals.browser,
            Bun: true,
        },
    },
    rules: {
        semi: ["error", "always"],
        "no-unused-vars": [
            "warn",
            { vars: "all", args: "after-used", ignoreRestSiblings: true },
        ],
    },
    ignores: [".node_modules/*"],
    env: {
        browser: true,
    },
};

export default [
    ...rawConfig,
    ...tseslint.configs.recommended,
    pluginJs.configs.recommended,
    { languageOptions: { globals: globals.node } },
];
