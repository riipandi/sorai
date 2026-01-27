/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import * as React from 'react'
import { clx } from '#/utils'

export function Tabs({ className, ...props }: React.ComponentProps<typeof BaseTabs.Root>) {
  return (
    <BaseTabs.Root
      data-slot='tabs'
      className={clx('flex flex-col gap-2.5', className)}
      {...props}
    />
  )
}

export function TabsList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseTabs.List>) {
  return (
    <BaseTabs.List
      data-slot='tabs-list'
      className={clx(
        'bg-tabs relative z-0 flex items-center rounded p-1',
        'inset-shadow-xs inset-shadow-black/10 dark:inset-shadow-none',
        className
      )}
      {...props}
    >
      {children}
      <BaseTabs.Indicator
        data-slot='tabs-indicator'
        className={clx(
          'absolute top-1/2 left-0 h-8 w-(--active-tab-width)',
          'translate-x-(--active-tab-left) -translate-y-1/2',
          'duration-100',
          'z-[-1] rounded transition-all',
          'bg-tabs-accent shadow inset-shadow-2xs inset-shadow-white/15 dark:inset-shadow-black/15',
          'ring-tabs-border ring'
        )}
      />
    </BaseTabs.List>
  )
}

export function TabsItem({ className, ...props }: React.ComponentProps<typeof BaseTabs.Tab>) {
  return (
    <BaseTabs.Tab
      data-slot='tabs-item'
      className={clx(
        'flex cursor-pointer items-center justify-center gap-2.5 rounded',
        'text-muted hover:not-[[data-disabled]]:text-foreground h-8 flex-1 px-3 py-1 font-medium',
        'data-active:text-foreground transition-colors',
        'focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2',
        '[&_svg:not([class*=size-])]:size-4',
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export function TabsPanel({ className, ...props }: React.ComponentProps<typeof BaseTabs.Panel>) {
  return (
    <BaseTabs.Panel data-slot='tabs-panel' className={clx('outline-none', className)} {...props} />
  )
}
