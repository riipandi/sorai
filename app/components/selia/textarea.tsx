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

export const textareaStyles = cva(
  [
    'text-foreground placeholder:text-dimmed shadow-input w-full rounded px-3.5 py-3.5 transition-[border-color,box-shadow]',
    'ring-input-border hover:not-[[disabled],[data-disabled]]:not-[:focus]:ring-input-accent-border focus:ring-primary min-h-24 ring focus:ring-2 focus:outline-0',
    'disabled:cursor-not-allowed disabled:opacity-70'
  ],
  {
    variants: {
      variant: {
        default: 'bg-input',
        subtle: 'bg-input/60'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export function Textarea({
  className,
  variant,
  ...props
}: React.ComponentProps<'textarea'> & VariantProps<typeof textareaStyles>) {
  return (
    <textarea
      data-slot='textarea'
      className={clx(textareaStyles({ variant, className }))}
      {...props}
    />
  )
}
