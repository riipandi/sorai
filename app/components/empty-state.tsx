/**
 * Empty state components for displaying no-data states.
 *
 * Anatomy:
 * <Empty>
 *   <EmptyHeader>
 *     <EmptyMedia />
 *     <EmptyTitle />
 *   </EmptyHeader>
 *   <EmptyContent>
 *     <EmptyDescription />
 *   </EmptyContent>
 * </Empty>
 */

import * as React from 'react'
import { tv, type VariantProps } from '#/utils/variant'

export const emptyStateStyles = tv({
  base: [
    'flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-5',
    'rounded p-10 text-center text-balance'
  ],
  slots: {
    header: 'flex max-w-sm flex-col items-center gap-2',
    media: [
      'mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0'
    ],
    title: 'text-lg font-medium tracking-tight',
    description: [
      'text-muted [&>a:hover]:text-primary text-base tracking-wide',
      'mt-1 [&>a]:underline [&>a]:underline-offset-4'
    ],
    content: 'flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-base text-balance'
  },
  variants: {
    variant: {
      default: {},
      icon: {
        media: [
          'bg-dimmed/20 text-foreground flex size-10 shrink-0 items-center',
          'justify-center rounded [&_svg:not([class*="size-"])]:size-6'
        ]
      }
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export type EmptyProps = React.ComponentProps<'div'> & VariantProps<typeof emptyStateStyles>
export type EmptyMediaProps = React.ComponentProps<'div'> & VariantProps<typeof emptyStateStyles>

export function Empty({ className, ...props }: EmptyProps) {
  const styles = emptyStateStyles()
  return <div data-slot='empty' className={styles.base({ className })} {...props} />
}

export function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
  const styles = emptyStateStyles()
  return <div data-slot='empty-header' className={styles.header({ className })} {...props} />
}

export function EmptyMedia({ className, variant, ...props }: EmptyMediaProps) {
  const styles = emptyStateStyles({ variant })
  return (
    <div
      data-slot='empty-icon'
      data-variant={variant}
      className={styles.media({ className })}
      {...props}
    />
  )
}

export function EmptyTitle({ className, ...props }: React.ComponentProps<'div'>) {
  const styles = emptyStateStyles()
  return <div data-slot='empty-title' className={styles.title({ className })} {...props} />
}

export function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const styles = emptyStateStyles()
  return (
    <div data-slot='empty-description' className={styles.description({ className })} {...props} />
  )
}

export function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
  const styles = emptyStateStyles()
  return <div data-slot='empty-content' className={styles.content({ className })} {...props} />
}
