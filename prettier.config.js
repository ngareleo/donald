/**
 * @type {import("prettier").Config}
 */
const config = {
    tabWidth: 4,
    semi: true,
    bracketSpacing: true,
};

/**
 * @type {import("prettier").Config}
 */
const altConfig = {
    arrowParens: "always",
    bracketSpacing: true,
    endOfLine: "lf",
    htmlWhitespaceSensitivity: "css",
    insertPragma: false,
    singleAttributePerLine: false,
    bracketSameLine: false,
    jsxBracketSameLine: false,
    jsxSingleQuote: false,
    printWidth: 80,
    proseWrap: "preserve",
    quoteProps: "as-needed",
    requirePragma: false,
    semi: true,
    singleQuote: false,
    tabWidth: 4,
    trailingComma: "es5",
    useTabs: false,
    embeddedLanguageFormatting: "auto",
};

export default altConfig;
