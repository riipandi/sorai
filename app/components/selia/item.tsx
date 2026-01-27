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
import { clx } from '#/utils'

export const itemStyles = cva(
  [
    'relative flex text-left transition-colors [a]:cursor-pointer',
    'focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-0',
    '[a,button]:hover:bg-accent'
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-item border-card-border rounded-(--item-rounded) border',
          'has-[[data-checked]]:ring-primary has-[[data-checked]]:ring-2',
          'has-[[data-checked]]:bg-primary/10'
        ],
        outline: [
          'ring-item-border rounded-(--item-rounded) ring',
          'has-[[data-checked]]:ring-primary has-[[data-checked]]:ring-2',
          'has-[[data-checked]]:bg-primary/10'
        ],
        plain: 'bg-transparent',
        primary: 'bg-primary/10 rounded-(--item-rounded)',
        'primary-outline': 'border-primary/20 rounded-(--item-rounded) border',
        danger: 'bg-danger/10 rounded-(--item-rounded)',
        'danger-outline': 'border-danger/20 rounded-(--item-rounded) border',
        info: 'bg-info/10 rounded-(--item-rounded)',
        'info-outline': 'border-info/20 rounded-(--item-rounded) border',
        success: 'bg-success/10 rounded-(--item-rounded)',
        'success-outline': 'border-success/20 rounded-(--item-rounded) border',
        warning: 'bg-warning/10 rounded-(--item-rounded)',
        'warning-outline': 'border-warning/20 rounded-(--item-rounded) border',
        tertiary: 'bg-tertiary/10 rounded-(--item-rounded)',
        'tertiary-outline': 'border-tertiary/20 rounded-(--item-rounded) border'
      },
      size: {
        sm: 'gap-2.5 p-3.5 [--item-rounded:var(--radius)]',
        md: 'gap-3 p-4 [--item-rounded:var(--radius-lg)]',
        lg: 'gap-3.5 p-4.5 [--item-rounded:var(--radius-xl)]'
      },
      direction: {
        row: 'flex-row',
        column: 'flex-col'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

export function Item({
  className,
  render,
  variant,
  size,
  direction,
  ...props
}: useRender.ComponentProps<'div'> & VariantProps<typeof itemStyles>) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      'data-slot': 'item',
      className: clx(itemStyles({ variant, size, direction, className })),
      ...props
    }
  })
}

export function ItemContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='item-content'
      className={clx('flex flex-col items-start gap-0.5', className)}
      {...props}
    />
  )
}

export function ItemTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='item-title'
      className={clx('text-foreground font-medium', className)}
      {...props}
    />
  )
}

export function ItemDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot='item-description'
      className={clx('text-muted leading-relaxed', className)}
      {...props}
    />
  )
}

export function ItemMeta({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='item-meta'
      className={clx('text-dimmed text-sm leading-relaxed', className)}
      {...props}
    />
  )
}

export function ItemMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='item-media'
      className={clx(
        'shrink-0 [&_svg:not([class*=size-])]:size-4.5 *:[[data-slot=iconbox]]:size-9',
        className
      )}
      {...props}
    />
  )
}

export function ItemAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='item-action'
      className={clx(
        'ml-auto flex items-center gap-2.5 [&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    />
  )
}
