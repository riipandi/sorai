/**
 * A group of toggle buttons.
 *
 * @see: https://base-ui.com/react/components/toggle-group
 *
 * Anatomy:
 * <ToggleGroup />
 */

import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group'
import { clx, tv, type VariantProps } from '#/utils/variant'

export const toggleGroupVariants = tv({
  base: [
    'flex items-center gap-0.5 rounded p-0.5 ring',
    '*:data-[slot=toggle]:shadow-none',
    '*:data-[slot=toggle]:ring-0'
  ],
  variants: {
    variant: {
      default: 'ring-border shadow',
      outline: 'ring-border',
      plain: 'ring-transparent'
    },
    size: {
      sm: [
        '*:data-[slot=toggle]:px-2.5',
        '*:data-[slot=toggle]:h-[calc(var(--spacing)*8-4px)]',
        '*:data-[slot=toggle]:min-w-[calc(var(--spacing)*8-4px)]'
      ],
      'icon-sm': [
        '*:data-[slot=toggle]:size-8',
        '*:data-[slot=toggle]:px-0',
        'not-data-[variant=plain]:*:data-[slot=toggle]:size-[calc(var(--spacing)*8-4px)]',
        'not-data-[variant=plain]:*:data-[slot=toggle]:min-w-[calc(var(--spacing)*8-4px)]'
      ],
      md: [
        '*:data-[slot=toggle]:h-[calc(var(--spacing)*9-4px)]',
        '*:data-[slot=toggle]:min-w-[calc(var(--spacing)*9-4px)]'
      ],
      'md-icon': [
        '*:data-[slot=toggle]:size-9',
        '*:data-[slot=toggle]:px-0',
        'not-data-[variant=plain]:*:data-[slot=toggle]:size-[calc(var(--spacing)*9-4px)]',
        'not-data-[variant=plain]:*:data-[slot=toggle]:min-w-[calc(var(--spacing)*9-4px)]'
      ]
    },
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'md'
  }
})

export type ToggleGroupProps = React.ComponentProps<typeof BaseToggleGroup> &
  VariantProps<typeof toggleGroupVariants>

export function ToggleGroup({ className, orientation, size, variant, ...props }: ToggleGroupProps) {
  const styles = toggleGroupVariants({ variant, orientation, size })
  return (
    <BaseToggleGroup
      data-slot='toggle-group'
      data-variant={variant}
      data-size={size}
      orientation={orientation}
      className={clx(styles, className)}
      {...props}
    />
  )
}
