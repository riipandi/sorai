/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { clx } from '#/utils'

export const headingStyles = cva('text-foreground font-semibold', {
  variants: {
    size: {
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-3xl'
    }
  },
  defaultVariants: {
    size: 'lg'
  }
})

export function Heading({
  level = 1,
  size,
  className,
  render,
  ...props
}: useRender.ComponentProps<'h1'> &
  VariantProps<typeof headingStyles> & {
    level?: 1 | 2 | 3 | 4 | 5 | 6
  }) {
  const levelMap = {
    lg: 1,
    md: 2,
    sm: 3
  }

  const selectedLevel = levelMap[size || 'lg'] || level

  return useRender({
    defaultTagName: `h${selectedLevel}` as keyof React.JSX.IntrinsicElements,
    render,
    props: {
      'data-slot': 'heading',
      className: clx(headingStyles({ size, className })),
      ...props
    }
  })
}
