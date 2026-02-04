/**
 * A visual separator for dividing content with an optional label.
 *
 * Anatomy:
 * <Divider />
 */

import * as React from 'react'
import { tv, type VariantProps } from '#/utils/variant'

export const dividerStyles = tv({
  base: 'flex items-center gap-2',
  slots: {
    label: 'text-dimmed text-base text-nowrap'
  },
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

export type DividerProps = React.ComponentProps<'div'> & VariantProps<typeof dividerStyles>

export function Divider({ children, variant, className, ...props }: DividerProps) {
  const styles = dividerStyles({ variant })
  return (
    <div data-slot='divider' {...props} className={styles.base({ className })}>
      <span className={styles.label()}>{children}</span>
    </div>
  )
}
