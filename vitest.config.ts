import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/unit/**/*.test.ts', 'tests/api/**/*.test.ts'],
    reporters: [
      'verbose',
      ['allure-vitest/reporter', { resultsDir: 'allure-results' }],
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: ['server/routes/**/*.ts', 'server/data/**/*.ts'],
      exclude: ['**/node_modules/**'],
      reportsDirectory: 'coverage',
    },
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'shared'),
      '@server': path.resolve(__dirname, 'server'),
    },
  },
});
