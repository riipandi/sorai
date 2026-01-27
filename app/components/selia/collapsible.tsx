/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible'
import { clx } from '#/utils'

export function Collapsible({
  className,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Root>) {
  return (
    <BaseCollapsible.Root
      data-slot='collapsible'
      className={clx('flex flex-col', className)}
      {...props}
    />
  )
}

export function CollapsibleTrigger({
  className,
  expandableIndicator = true,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Trigger> & {
  expandableIndicator?: boolean
}) {
  return (
    <BaseCollapsible.Trigger
      data-slot='collapsible-trigger'
      data-expandable={expandableIndicator ? true : undefined}
      className={clx(
        'flex cursor-pointer items-center gap-2.5 select-none',
        'text-foreground py-2 transition-colors duration-100',
        'focus-visible:outline-primary focus:outline-0 focus-visible:outline-2 focus-visible:outline-offset-2',
        'w-full text-left leading-relaxed font-medium [&_svg:not([class*=size-])]:size-4',
        '**:data-[slot=expandable-indicator]:transition-all',
        '**:data-[slot=expandable-indicator]:duration-100',
        'disabled:cursor-not-allowed disabled:opacity-70',
        expandableIndicator && [
          'data-expandable:after:bg-chevron-down-dark dark:data-expandable:after:bg-chevron-down data-expandable:after:ml-auto data-expandable:after:size-4',
          'data-expandable:after:shrink-0 data-expandable:after:transition-transform data-expandable:after:duration-100',
          'data-expandable:data-[panel-open]:after:rotate-180'
        ],
        className
      )}
      {...props}
    />
  )
}

export function CollapsiblePanel({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Panel>) {
  return (
    <BaseCollapsible.Panel
      data-slot='collapsible-panel'
      className={clx(
        'flex flex-col gap-2.5',
        'overflow-hidden transition-all ease-out',
        'h-[var(--collapsible-panel-height)] [&[hidden]:not([hidden=until-found])]:hidden',
        'data-[ending-style]:h-0 data-[starting-style]:h-0',
        className
      )}
      {...props}
    >
      <div data-slot='collapsible-panel-content'>{children}</div>
    </BaseCollapsible.Panel>
  )
}
