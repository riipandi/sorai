/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { clx } from '#/utils'
import { Dialog, DialogBody, DialogPopup, DialogTrigger } from './dialog'

export function Command({ ...props }: React.ComponentProps<typeof Dialog>) {
  return <Dialog {...props} />
}

export function CommandTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DialogTrigger>) {
  return <DialogTrigger data-slot='command-trigger' {...props} className={clx(className)} />
}

export function CommandContent({ className, ...props }: React.ComponentProps<typeof DialogPopup>) {
  return (
    <DialogPopup
      {...props}
      className={clx(
        'bg-dialog-footer/90 rounded-[calc(var(--radius-xl)+0.25rem)] p-1 md:min-w-xl',
        '**:data-[slot=autocomplete-list]:h-[min(27rem,50dvh)]',
        '**:data-[slot=autocomplete-empty]:h-[min(27rem,50dvh)]',
        '**:data-[slot=autocomplete-input]:h-11',
        '**:data-[slot=input-group]:px-2.5',
        '**:data-[slot=input-group]:border-b',
        '**:data-[slot=input-group]:border-dialog-border',
        className
      )}
    />
  )
}

export function CommandBody({ className, ...props }: React.ComponentProps<typeof DialogBody>) {
  return (
    <DialogBody
      {...props}
      className={clx(
        'bg-dialog border-dialog-border space-y-0 rounded-xl border',
        'bg-dialog p-0 shadow',
        '**:data-[slot=autocomplete-list]:px-2.5 **:data-[slot=autocomplete-list]:py-1.5',
        className
      )}
    ></DialogBody>
  )
}

export function CommandFooter({ className, ...props }: React.ComponentProps<'footer'>) {
  return (
    <footer
      data-slot='command-footer'
      {...props}
      className={clx('flex items-center gap-6 px-5 pt-3 pb-2.5', className)}
    />
  )
}

export function CommandFooterItem({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='command-footer-item'
      {...props}
      className={clx('flex items-center gap-2.5', className)}
    />
  )
}

export function CommandFooterText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot='command-footer-text'
      {...props}
      className={clx('text-muted text-sm font-medium', className)}
    />
  )
}
