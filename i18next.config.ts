import Language from 'enums/language';
import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: Object.values(Language),
  extract: {
    input: 'src/**/*.{js,jsx,ts,tsx}',
    output: 'src/locale/{{language}}/{{namespace}}.json',
    defaultNS: 'global',
  },
  // I'll add type support in the future; I just don't have time for it right now.
  // types: {
  //   input: ['src/locale/en/*.json'],
  //   output: 'src/types/i18next.d.ts',
  //   resourcesFile: 'src/types/i18next-resources.d.ts',
  // },
});
