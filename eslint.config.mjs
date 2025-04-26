import { defineConfig } from "eslint/config";
import unusedImports from "eslint-plugin-unused-imports";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import prettier from "eslint-plugin-prettier";
import sortKeysFix from "eslint-plugin-sort-keys-fix";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("next/core-web-vitals", "prettier"),

    plugins: {
        "unused-imports": unusedImports,
        "simple-import-sort": simpleImportSort,
        prettier,
        "sort-keys-fix": sortKeysFix,
    },

    rules: {
        "prettier/prettier": "error",
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "no-unused-vars": "off",
        "unused-imports/no-unused-imports": "error",

        "unused-imports/no-unused-vars": ["warn", {
            vars: "all",
            varsIgnorePattern: "^_",
            args: "after-used",
            argsIgnorePattern: "^_",
        }],

        "no-restricted-imports": ["error", {
            name: "@mui/icons-material",
            message: "Please import your icon directly from @mui/icons-material/YourIconName instead",
        }],

        "sort-keys-fix/sort-keys-fix": "warn",
    },
}]);