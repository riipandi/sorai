/// <reference types="vitest/config" />

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import type { Config as RouterConfig } from '@tanstack/router-plugin/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { resolve } from 'node:path'
import { isProduction } from 'std-env'
import { defineConfig } from 'vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import tsconfigPaths from 'vite-tsconfig-paths'

const routerConfig: Partial<RouterConfig> = {
  routesDirectory: resolve('app/routes'),
  generatedRouteTree: resolve('app/routes.gen.ts'),
  autoCodeSplitting: true,
  target: 'react'
}

export default defineConfig({
  plugins: [
    tanstackRouter(routerConfig),
    devtools({ removeDevtoolsOnBuild: true }),
    react(),
    tailwindcss(),
    tsconfigPaths({ ignoreConfigErrors: true }),
    devtoolsJson()
  ],
  resolve: { tsconfigPaths: true },
  build: {
    outDir: resolve('.output'),
    chunkSizeWarningLimit: 1024 * 2,
    minify: isProduction ? 'oxc' : false
  },
  preview: { port: 3000, strictPort: true },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        rewrite: (path) => path.replace(/^\/api/, ''),
        changeOrigin: true
      }
    },
    watch: {
      ignored: [
        '**/docker/**',
        '**/docs/**',
        '**/scripts/**',
        '**/specs/**',
        '**/src/**',
        '**/target/**'
      ]
    }
  },

  test: {
    projects: [
      {
        extends: true,
        // The plugin will run tests for the stories defined in your Storybook config
        // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
        plugins: [storybookTest({ configDir: '.storybook' })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }]
          },
          setupFiles: ['.storybook/vitest.setup.ts']
        }
      }
    ]
  }
})
