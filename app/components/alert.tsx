/**
 * A prominent alert component for displaying important messages.
 *
 * Anatomy:
 * <Alert>
 *   <AlertTitle />
 *   <AlertDescription />
 *   <AlertAction />
 * </Alert>
 */

import * as React from 'react'
import { tv, type VariantProps } from '#/utils/variant'

export const alertStyles = tv({
  base: [
    'min-h-10 w-full rounded px-2.5 py-1 font-normal',
    '[&_svg:not([class*=size-])]:size-4 *:[svg]:shrink-0',
    'text-foreground flex items-center gap-x-2 gap-y-0.5',
    'has-[>[data-slot=alert-description]]:grid',
    'has-[>[data-slot=alert-description]]:py-2',
    'has-[>svg]:grid-cols-[calc(var(--spacing)*4.5)_1fr_auto]',
    'not-[:has(>svg)]:grid-cols-[1fr_auto]',
    'not-[:has(>svg)]:*:data-[slot=alert-description]:col-start-1'
  ],
  slots: {
    title: 'font-medium',
    description: 'text-muted col-start-2 leading-relaxed',
    action: 'col-start-3 row-span-2 row-start-1 ml-auto flex items-center gap-1 self-center'
  },
  variants: {
    variant: {
      default: 'bg-background ring-border ring',
      danger: 'bg-danger/7 ring-danger/30 [&_svg:not([class*=text-])]:text-danger ring',
      info: 'bg-info/7 ring-info/30 [&_svg:not([class*=text-])]:text-info ring',
      success: 'bg-success/7 ring-success/30 [&_svg:not([class*=text-])]:text-success ring',
      warning: 'bg-warning/7 ring-warning/30 [&_svg:not([class*=text-])]:text-warning ring',
      tertiary: 'bg-tertiary/5 ring-tertiary/20 [&_svg:not([class*=text-])]:text-tertiary ring'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export type AlertProps = React.ComponentProps<'div'> & VariantProps<typeof alertStyles>
export type AlertTitleProps = React.ComponentProps<'div'>
export type AlertDescriptionProps = React.ComponentProps<'div'>
export type AlertActionProps = React.ComponentProps<'div'>

export function Alert({ className, variant, ...props }: AlertProps) {
  const styles = alertStyles({ variant })
  return <div data-slot='alert' className={styles.base({ className })} {...props} />
}

export function AlertTitle({ className, ...props }: AlertTitleProps) {
  const styles = alertStyles()
  return <div data-slot='alert-title' className={styles.title({ className })} {...props} />
}

export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  const styles = alertStyles()
  return (
    <div data-slot='alert-description' className={styles.description({ className })} {...props} />
  )
}

export function AlertAction({ className, ...props }: AlertActionProps) {
  const styles = alertStyles()
  return <div data-slot='alert-action' className={styles.action({ className })} {...props} />
}
