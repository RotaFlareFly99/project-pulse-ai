import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    // The existing Node test scripts in PR #3 intentionally use CommonJS.
    files: ["tests/**/*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" }
  },
  {
    // Preserve PR #3's existing one-time sessionStorage hydration unchanged.
    // Revisit this narrowly scoped React Hooks exception with a dedicated UI refactor.
    files: ["app/results/page.tsx"],
    rules: { "react-hooks/set-state-in-effect": "off" }
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".test-build/**",
    "*.tsbuildinfo"
  ])
]);
