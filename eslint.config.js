import pluginTypescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import configStandardWithTypescript from "eslint-config-love";
import configStandard from "eslint-config-standard";
import pluginImport from "eslint-plugin-import";
import pluginN from "eslint-plugin-n";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import pluginPromise from "eslint-plugin-promise";
import reactRefresh from "eslint-plugin-react-refresh";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import pluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";

const ext = {
  js: "js,mjs,cjs",
  ts: "ts,mts,cts",
  jsx: "jsx,mjsx",
  tsx: "tsx,mtsx",
};

const globs = {
  js: `**/*.{${ext.js}}`,
  ts: `**/*.{${ext.ts}}`,
  jsx: `**/*.{${ext.jsx}}`,
  tsx: `**/*.{${ext.tsx}}`,
  any: `**/*.{${ext.js},${ext.ts},${ext.jsx},${ext.tsx}}`,
  build: "**/{dist,build}/**",
  config: `**/{eslint,prettier,vite,playwright}.config.{${ext.js},${ext.ts}}`,
};

const jsRules = {
  "no-shadow": ["error"],
  "no-unused-vars": [
    "error",
    {
      args: "after-used",
      argsIgnorePattern: "^_",
      destructuredArrayIgnorePattern: "^_",
      ignoreRestSiblings: true,
      vars: "all",
    },
  ],
};

const tsRules = Object.entries(jsRules).reduce(
  (result, [ruleName, ruleValue]) => {
    result[ruleName] = ["off"];
    result[`@typescript-eslint/${ruleName}`] = ruleValue;
    return result;
  },
  {},
);

/**
 * Конфиг задающий основные правила ESLint
 * @type {import('eslint').Linter.FlatConfig}
 */
const baseConfig = {
  files: [globs.any],
  plugins: {
    import: pluginImport,
    n: pluginN,
    promise: pluginPromise,
    unicorn: pluginUnicorn,
    "simple-import-sort": pluginSimpleImportSort,
  },
  languageOptions: {
    globals: {
      ...globals.es2021,
      ...globals.browser,
      ...globals.node,
      ExtractArrayItemType: "readonly",
      ReportSelectors: "readonly",
      MetricType: "readonly",
      DimensionType: "readonly",
    },
  },
  rules: {
    ...configStandard.rules,
    ...jsRules,
    "import/no-absolute-path": ["off"],
    "import/newline-after-import": ["error"],
    "import/no-useless-path-segments": [
      "error",
      {
        noUselessIndex: true,
      },
    ],
    "n/no-callback-literal": ["off"],
    "no-console": [
      "error",
      {
        allow: ["info", "warn", "error"],
      },
    ],
    "no-use-before-define": [
      "error",
      {
        functions: true,
        classes: true,
        variables: true,
        allowNamedExports: false,
      },
    ],
    "simple-import-sort/exports": ["error"],
    "simple-import-sort/imports": ["error"],
    "unicorn/expiring-todo-comments": ["error"],
    "unicorn/prefer-node-protocol": ["error"],
  },
};

const { "@typescript-eslint/ban-types": _, ...standardLoveRules } =
  configStandardWithTypescript.rules;

function createTsConfig(opts) {
  return {
    files: [globs.ts, globs.tsx],
    plugins: {
      "@typescript-eslint": pluginTypescript,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
        tsconfigRootDir: opts.tsconfigRootDir,
        project: opts.project,
      },
    },
    rules: {
      ...standardLoveRules,
      ...tsRules,
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/init-declarations": "off",
      "@typescript-eslint/class-methods-use-this": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          caughtErrors: "none",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/array-type": ["error", { default: "generic" }],
      "@typescript-eslint/consistent-indexed-object-style": ["off"],
      "@typescript-eslint/consistent-type-assertions": ["off"],
      "@typescript-eslint/consistent-type-definitions": ["off"],
      "@typescript-eslint/no-throw-literal": ["off"],
      "@typescript-eslint/only-throw-error": ["off"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
          allowHigherOrderFunctions: true,
          allowTypedFunctionExpressions: true,
          allowDirectConstAssertionInArrowFunctions: true,
        },
      ],
      "@typescript-eslint/member-delimiter-style": [
        "error",
        {
          multiline: {
            delimiter: "semi",
            requireLast: true,
          },
          singleline: {
            delimiter: "semi",
            requireLast: false,
          },
          multilineDetection: "brackets",
        },
      ],
      "@typescript-eslint/method-signature-style": ["off"],
      "@typescript-eslint/no-confusing-void-expression": ["off"],
      "@typescript-eslint/no-dynamic-delete": ["off"],
      "@typescript-eslint/no-floating-promises": ["off"],
      "@typescript-eslint/no-invalid-void-type": ["off"],
      "@typescript-eslint/no-misused-promises": ["off"],
      "no-use-before-define": ["off"],
      "@typescript-eslint/no-use-before-define": [
        "error",
        {
          functions: true,
          classes: true,
          variables: true,
          allowNamedExports: false,
          enums: true,
          typedefs: true,
          ignoreTypeReferences: true,
        },
      ],
      "@typescript-eslint/prefer-reduce-type-parameter": ["off"],
      "@typescript-eslint/promise-function-async": ["off"],
      "@typescript-eslint/restrict-template-expressions": ["off"],
      "@typescript-eslint/return-await": ["error", "in-try-catch"],
      "@typescript-eslint/strict-boolean-expressions": ["off"],
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        node: {
          extensions: [".ts", ".tsx"],
        },
        typescript: {
          project: opts.project,
        },
      },
    },
  };
}

export default [
  baseConfig,
  createTsConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ["./tsconfig.json", "./packages/*/tsconfig.json"],
  }),
  {
    // in main config for TSX/JSX source files
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        {
          allowExportNames: [
            "meta",
            "links",
            "headers",
            "loader",
            "action",
            "clientLoader",
          ],
        },
      ],
    },
  },
  eslintPluginPrettierRecommended,
  {
    ignores: [globs.build, "app/icons/**", ".storybook/**", "storybook-static"],
  },
];
