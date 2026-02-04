/**
 * A toggle button component.
 *
 * @see: https://base-ui.com/react/components/toggle
 *
 * Anatomy:
 * <Toggle />
 */

import { Toggle as BaseToggle } from '@base-ui/react/toggle'
import { clx, tv, type VariantProps } from '#/utils/variant'

export const toggleStyles = tv({
  base: [
    'inline-flex cursor-pointer items-center justify-center gap-2 ring [&_svg:not([class*=size-])]:size-4',
    'outline-primary focus:outline-0 focus-visible:outline-2 focus-visible:outline-offset-2',
    '[&_svg:not([class*=text-])]:text-foreground transition-colors duration-100',
    'hover:not-data-disabled:not-data-pressed:bg-accent/50 data-disabled:cursor-not-allowed data-disabled:opacity-70'
  ],
  variants: {
    variant: {
      default: 'ring-border data-pressed:bg-accent shadow',
      plain: 'data-pressed:bg-accent ring-transparent'
    },
    size: {
      sm: 'h-8 min-w-8 rounded px-2.5',
      'icon-sm': 'h-8 w-8 rounded',
      md: 'h-9 min-w-9 rounded-sm px-3.5',
      'md-icon': 'h-9 w-9 rounded'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'md'
  }
})

export type ToggleProps = React.ComponentProps<typeof BaseToggle> &
  VariantProps<typeof toggleStyles>

export function Toggle({ className, children, variant, size, ...props }: ToggleProps) {
  const styles = toggleStyles({ variant, size })
  return (
    <BaseToggle data-slot='toggle' data-size={size} className={clx(styles, className)} {...props}>
      {children}
    </BaseToggle>
  )
}
