import next from "@next/eslint-plugin-next"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(tseslint.configs.base, next, {
  files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  plugins: {
    "react-hooks": reactHooks,
  },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: globals.browser,
  },
  rules: {
    "react-hooks/exhaustive-deps": "warn",
  },
})
