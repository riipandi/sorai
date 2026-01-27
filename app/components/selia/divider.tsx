/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { clx } from '#/utils'

export const dividerStyles = cva('flex items-center gap-2.5', {
  variants: {
    variant: {
      default: 'before:bg-separator before:h-px before:w-full',
      center:
        'before:bg-separator after:bg-separator before:h-px before:w-full after:h-px after:w-full',
      left: 'after:bg-separator after:h-px after:w-full',
      right: 'before:bg-separator before:h-px before:w-full'
    }
  },
  defaultVariants: {
    variant: 'left'
  }
})

export function Divider({
  children,
  variant,
  className,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof dividerStyles>) {
  return (
    <div data-slot='divider' className={clx(dividerStyles({ variant, className }))} {...props}>
      <span className='text-dimmed text-sm text-nowrap'>{children}</span>
    </div>
  )
}
