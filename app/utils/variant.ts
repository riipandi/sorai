/**
 * Advanced Tailwind Variants wrapper that extends the default configuration.
 * For smaller bundle size (~80% smaller), use the `tailwind-variants/lite`
 * which doesn't include tailwind-merge.
 *
 * @see: https://www.tailwind-variants.org/docs/config
 */

import type { TV, TWMergeConfig } from 'tailwind-variants'
import { tv as tvbase } from 'tailwind-variants'

// const COMMON_UNITS = ['xs', 'sm', 'md', 'lg', 'xl']

const twMergeConfig: TWMergeConfig = {
  theme: {
    // spacing: ['divider'],
    // radius: COMMON_UNITS,
  },
  classGroups: {
    // TODO: Enable these as needed
    // @ref: https://www.tailwind-variants.org/docs/config
  }
}

export const tv: TV = (options, config) => {
  return tvbase(options, {
    ...config,
    twMerge: config?.twMerge ?? true,
    twMergeConfig: {
      ...config?.twMergeConfig,
      theme: {
        ...config?.twMergeConfig?.theme,
        ...twMergeConfig.theme
      },
      classGroups: {
        ...config?.twMergeConfig?.classGroups,
        ...twMergeConfig.classGroups
      }
    }
  })
}

// Re-export types and utilities for convenience
export type { VariantProps } from 'tailwind-variants'
export { cn as clx } from 'tailwind-variants'
