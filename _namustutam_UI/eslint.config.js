import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'scripts', 'node_modules']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Unused vars: allow uppercase and underscore-prefixed to be safely ignored
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_', args: 'after-used' }],

      // Empty catch blocks are intentional in many places (try/catch for JSON.parse etc.)
      'no-empty': ['error', { allowEmptyCatch: true }],

      // Calling setState inside useEffect is valid in many real-world scenarios
      // (initial sync, once-on-mount derived state). Disable this overly strict rule.
      'react-hooks/set-state-in-effect': 'off',

      // Context files legitimately export both hooks and components together.
      // Fast-refresh still works fine for context files in practice.
      'react-refresh/only-export-components': 'off',

      // Ref access during render warning — too many false positives with react-dnd
      'react-hooks/refs': 'off',
    },
  },
])
