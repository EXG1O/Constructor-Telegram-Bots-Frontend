import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    plugins: {
      react,
      'react-hooks': fixupPluginRules(reactHooks),
      '@typescript-eslint': typescriptEslint,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    extends: compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
    ),
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },

      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',

      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          destructuredArrayIgnorePattern: '^_',
        },
      ],

      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', '^@?\\w'],
            ['^routes(/.+)*'],
            ['^\\.\\./?$', '^\\./?$'],
            ['/[A-Z]([a-z]+[A-Z]?)*'],
            ['^components/(.*/)*[A-Z]([a-z]+[A-Z]?)*'],
            ['^\\./(.*/)*[A-Z]([a-z]+[A-Z]?)*'],
            ['^\\.\\./(.*/)*[A-Z]([a-z]+[A-Z]?)*'],
            ['^settings$'],
            ['^hooks/.+'],
            ['/contexts/.+'],
            ['/hooks/.+'],
            ['\\.s?css$'],
            ['^assets/.+'],
            ['^api(/.+)*'],
            ['^utils/.+'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
]);
