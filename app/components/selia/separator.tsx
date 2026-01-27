/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Separator as BaseSeparator } from '@base-ui/react/separator'
import { cva, type VariantProps } from 'class-variance-authority'
import { clx } from '#/utils'

export const separatorStyles = cva('bg-separator', {
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'min-h-5 w-px'
    }
  },
  defaultVariants: {
    orientation: 'horizontal'
  }
})

export function Separator({
  className,
  orientation,
  ...props
}: React.ComponentProps<typeof BaseSeparator> & VariantProps<typeof separatorStyles>) {
  return (
    <BaseSeparator
      data-slot='separator'
      className={clx(separatorStyles({ orientation, className }))}
      {...props}
    />
  )
}
