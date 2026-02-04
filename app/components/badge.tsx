/**
 * A small status or label component for displaying contextual information.
 *
 * Anatomy:
 * <Badge />
 */

import { clx, tv, type VariantProps } from '#/utils/variant'

export const badgeStyles = tv({
  base: 'inline-flex items-center gap-1 border border-transparent',
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
      sm: 'h-4 rounded-xs px-1.5 text-sm [&_svg:not([class*=size-])]:size-2.5',
      md: 'h-5 rounded-sm px-2 text-base [&_svg:not([class*=size-])]:size-3.5',
      lg: 'h-7 rounded px-2.5 [&_svg:not([class*=size-])]:size-4'
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

export type BadgeProps = React.ComponentProps<'span'> & VariantProps<typeof badgeStyles>

export function Badge({ variant, size, pill, className, ...props }: BadgeProps) {
  return (
    <span
      data-slot='badge'
      className={clx(badgeStyles({ variant, size, pill }), className)}
      {...props}
    />
  )
}
