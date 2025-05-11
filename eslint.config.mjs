import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // ignore unused imports/vars
      "@typescript-eslint/no-explicit-any": "off", // allow use of 'any'
      "react-hooks/exhaustive-deps": "off", // disable useEffect dependency checks
    },
  },
];

export default eslintConfig;
