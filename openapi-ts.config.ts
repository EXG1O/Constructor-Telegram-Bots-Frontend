import { defaultPlugins, defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'openapi.json',
  output: {
    path: 'src/api/client',
    postProcess: ['eslint', 'prettier'],
  },
  plugins: [
    ...defaultPlugins,
    {
      name: '@hey-api/typescript',
      comments: false,
      topType: 'any',
      enums: {
        mode: 'typescript',
        case: 'PascalCase',
      },
    },
    {
      name: '@hey-api/sdk',
      operations: {
        strategy: 'byTags',
        containerName: '{{name}}Service',
        methods: 'static',
        methodName: (name: string): string => name.replace(/^[^-]*-/, ''),
      },
    },
  ],
});
