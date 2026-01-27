/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { cva, type VariantProps } from 'class-variance-authority'
import { clx } from '#/utils'

export const kbdStyles = cva(
  [
    'inline-flex h-5.5 min-w-5.5 items-center justify-center gap-1 px-1.5',
    'ring-kbd-border rounded-sm text-sm/8 font-medium ring'
  ],
  {
    variants: {
      variant: {
        default: 'bg-kbd text-kbd-foreground shadow inset-shadow-2xs inset-shadow-white/15',
        outline: 'ring-kbd-border text-kbd-foreground ring',
        plain: 'ring-0'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export function Kbd({
  variant,
  className,
  ...props
}: React.ComponentProps<'kbd'> & VariantProps<typeof kbdStyles>) {
  return <kbd data-slot='kbd' {...props} className={clx(kbdStyles({ variant, className }))} />
}

export function KbdGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot='kbd-group' {...props} className={clx('flex items-center gap-1.5', className)} />
  )
}
