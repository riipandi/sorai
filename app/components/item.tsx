/**
 * A flexible list item component with title, description, media, and action sections.
 *
 * Anatomy:
 * <Item>
 *   <ItemMedia />
 *   <ItemContent>
 *     <ItemTitle />
 *     <ItemDescription />
 *   </ItemContent>
 *   <ItemAction />
 * </Item>
 */

import { useRender } from '@base-ui/react/use-render'
import { clx, tv, type VariantProps } from '#/utils/variant'

export const itemStyles = tv({
  slots: {
    base: [
      'relative flex text-left transition-colors [a]:cursor-pointer',
      'focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-0',
      '[a,button]:hover:bg-accent'
    ],
    content: 'flex flex-col items-start gap-0.5',
    title: 'text-foreground font-medium',
    description: 'text-muted leading-relaxed',
    meta: 'text-dimmed text-base leading-relaxed',
    media: 'shrink-0 *:data-[slot=iconbox]:size-8 [&_svg:not([class*=size-])]:size-4',
    action: 'ml-auto flex items-center gap-2 [&_svg:not([class*=size-])]:size-3.5'
  },
  variants: {
    variant: {
      default: {
        base: [
          'bg-item border-card-border rounded-(--item-rounded) border',
          'has-data-checked:ring-primary has-data-checked:ring-2',
          'has-data-checked:bg-primary/10'
        ]
      },
      outline: {
        base: [
          'ring-item-border rounded-(--item-rounded) ring',
          'has-data-checked:ring-primary has-data-checked:ring-2',
          'has-data-checked:bg-primary/10'
        ]
      },
      plain: { base: 'bg-transparent' },
      primary: { base: 'bg-primary/10 rounded-(--item-rounded)' },
      'primary-outline': { base: 'border-primary/20 rounded-(--item-rounded) border' },
      danger: { base: 'bg-danger/10 rounded-(--item-rounded)' },
      'danger-outline': { base: 'border-danger/20 rounded-(--item-rounded) border' },
      info: { base: 'bg-info/10 rounded-(--item-rounded)' },
      'info-outline': { base: 'border-info/20 rounded-(--item-rounded) border' },
      success: { base: 'bg-success/10 rounded-(--item-rounded)' },
      'success-outline': { base: 'border-success/20 rounded-(--item-rounded) border' },
      warning: { base: 'bg-warning/10 rounded-(--item-rounded)' },
      'warning-outline': { base: 'border-warning/20 rounded-(--item-rounded) border' },
      tertiary: { base: 'bg-tertiary/10 rounded-(--item-rounded)' },
      'tertiary-outline': { base: 'border-tertiary/20 rounded-(--item-rounded) border' }
    },
    size: {
      sm: { base: 'gap-2 p-3 [--item-rounded:var(--radius)]' },
      md: { base: 'gap-2.5 p-3.5 [--item-rounded:var(--radius-lg)]' },
      lg: { base: 'gap-3 p-4 [--item-rounded:var(--radius-xl)]' }
    },
    direction: {
      row: { base: 'flex-row' },
      column: { base: 'flex-col' }
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'md'
  }
})

export type ItemProps = useRender.ComponentProps<'div'> & VariantProps<typeof itemStyles>
export type ItemContentProps = React.ComponentProps<'div'>
export type ItemTitleProps = React.ComponentProps<'div'>
export type ItemDescriptionProps = React.ComponentProps<'p'>
export type ItemMetaProps = React.ComponentProps<'div'>
export type ItemMediaProps = React.ComponentProps<'div'>
export type ItemActionProps = React.ComponentProps<'div'>

export function Item({ className, render, variant, size, direction, ...props }: ItemProps) {
  const { base } = itemStyles({ variant, size, direction })
  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      'data-slot': 'item',
      className: clx(base(), className),
      ...props
    }
  })
}

export function ItemContent({ className, ...props }: ItemContentProps) {
  const { content } = itemStyles()
  return <div data-slot='item-content' className={content({ className })} {...props} />
}

export function ItemTitle({ className, ...props }: ItemTitleProps) {
  const { title } = itemStyles()
  return <div data-slot='item-title' className={title({ className })} {...props} />
}

export function ItemDescription({ className, ...props }: ItemDescriptionProps) {
  const { description } = itemStyles()
  return <p data-slot='item-description' className={description({ className })} {...props} />
}

export function ItemMeta({ className, ...props }: ItemMetaProps) {
  const { meta } = itemStyles()
  return <div data-slot='item-meta' className={meta({ className })} {...props} />
}

export function ItemMedia({ className, ...props }: ItemMediaProps) {
  const { media } = itemStyles()
  return <div data-slot='item-media' className={media({ className })} {...props} />
}

export function ItemAction({ className, ...props }: ItemActionProps) {
  const { action } = itemStyles()
  return <div data-slot='item-action' className={action({ className })} {...props} />
}
