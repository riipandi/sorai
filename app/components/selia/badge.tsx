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

export const badgeStyles = cva('inline-flex items-center gap-1.5 border border-transparent', {
  variants: {
    variant: {
      primary: 'bg-primary/15 text-primary',
      'primary-outline': 'border-primary text-primary',
      secondary: 'bg-secondary/50 text-secondary-foreground',
      'secondary-outline': 'border-secondary text-secondary-foreground',
      tertiary: 'bg-tertiary/15 text-tertiary',
      'tertiary-outline': 'border-tertiary text-tertiary',
      success: 'bg-success/15 text-success',
      'success-outline': 'border-success text-success',
      info: 'bg-info/15 text-info',
      'info-outline': 'border-info text-info',
      warning: 'bg-warning/15 text-warning',
      'warning-outline': 'border-warning text-warning',
      danger: 'bg-danger/15 text-danger',
      'danger-outline': 'border-danger text-danger'
    },
    size: {
      sm: 'h-5 rounded-sm px-1 text-xs [&_svg:not([class*=size-])]:size-3',
      md: 'h-5.5 rounded-sm px-1.5 text-sm [&_svg:not([class*=size-])]:size-3.5',
      lg: 'h-6 rounded-sm px-2 [&_svg:not([class*=size-])]:size-4'
    },
    pill: {
      true: 'rounded-full'
    }
  },
  defaultVariants: {
    variant: 'secondary',
    size: 'md'
  }
})

export function Badge({
  variant,
  size,
  pill,
  className,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeStyles>) {
  return (
    <span
      data-slot='badge'
      {...props}
      className={clx(badgeStyles({ variant, size, pill, className }))}
    />
  )
}
