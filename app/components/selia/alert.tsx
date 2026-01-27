/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { clx } from '#/utils'

export const alertStyles = cva(
  [
    'min-h-11 w-full rounded px-3.5 py-1.5 font-medium',
    '[&_svg:not([class*=size-])]:size-4.5 *:[svg]:shrink-0',
    'text-foreground flex items-center gap-x-2.5 gap-y-1',
    'has-[>[data-slot=alert-description]]:grid',
    'has-[>[data-slot=alert-description]]:py-3',
    'has-[>svg]:grid-cols-[calc(var(--spacing)*4.5)_1fr_auto]',
    'not-[:has(>svg)]:grid-cols-[1fr_auto]',
    'not-[:has(>svg)]:[&>[data-slot=alert-description]]:col-start-1'
  ],
  {
    variants: {
      variant: {
        default: 'bg-background ring-border ring',
        danger: 'bg-danger/7 ring-danger/30 [&_svg:not([class*=text-])]:text-danger ring',
        info: 'bg-info/7 ring-info/30 [&_svg:not([class*=text-])]:text-info ring',
        success: 'bg-success/7 ring-success/30 [&_svg:not([class*=text-])]:text-success ring',
        warning: 'bg-warning/7 ring-warning/30 [&_svg:not([class*=text-])]:text-warning ring',
        tertiary: 'bg-tertiary/7 ring-tertiary/30 [&_svg:not([class*=text-])]:text-tertiary ring'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertStyles>) {
  return <div data-slot='alert' className={clx(alertStyles({ variant, className }))} {...props} />
}

export function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot='alert-title' className={clx(className)} {...props} />
}

export function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-description'
      className={clx('text-muted col-start-2 leading-relaxed font-normal', className)}
      {...props}
    />
  )
}

export function AlertAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-action'
      className={clx(
        'col-start-3 row-span-2 row-start-1 ml-auto flex items-center gap-1.5 self-center',
        className
      )}
      {...props}
    />
  )
}
