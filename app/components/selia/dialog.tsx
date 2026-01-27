/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { clx } from '#/utils'
import { buttonStyles } from './button'

export function Dialog({ ...props }: React.ComponentProps<typeof BaseDialog.Root>) {
  return <BaseDialog.Root data-slot='dialog' {...props} />
}

export function DialogTrigger({
  children,
  ...props
}: React.ComponentProps<typeof BaseDialog.Trigger>) {
  return (
    <BaseDialog.Trigger data-slot='dialog-trigger' {...props}>
      {children}
    </BaseDialog.Trigger>
  )
}

export function DialogPopup({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseDialog.Popup>) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        className={clx(
          'fixed inset-0 min-h-dvh bg-black/60 backdrop-blur-sm transition-[color,opacity]',
          'data-[ending-style]:opacity-0 data-[starting-style]:opacity-0'
        )}
      />
      <BaseDialog.Popup
        data-slot='dialog-popup'
        {...props}
        className={clx(
          'fixed left-1/2 -translate-x-1/2 -translate-y-1/2',
          'top-[calc(50%+1.25rem*var(--nested-dialogs))]',
          'bg-dialog text-dialog-foreground backdrop-blur-sm',
          'ring-dialog-border rounded-xl shadow ring',
          'scale-[calc(1-0.1*var(--nested-dialogs))]',
          'w-md max-w-[calc(100%-2rem)] transition-all outline-none',
          'data-[nested-dialog-open]:after:absolute',
          'data-[nested-dialog-open]:after:inset-0',
          'data-[nested-dialog-open]:after:rounded-xl',
          'data-[nested-dialog-open]:after:bg-black/20',
          'data-[nested-dialog-open]:after:z-10',
          'data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
          'data-[ending-style]:scale-90 data-[starting-style]:scale-90',
          className
        )}
      >
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  )
}

export function DialogHeader({ className, children, ...props }: React.ComponentProps<'header'>) {
  return (
    <header
      data-slot='dialog-header'
      {...props}
      className={clx('flex items-center gap-3.5 px-6 pt-4.5', className)}
    >
      {children}
    </header>
  )
}

export function DialogTitle({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      data-slot='dialog-title'
      {...props}
      className={clx('text-xl font-semibold', className)}
    >
      {children}
    </BaseDialog.Title>
  )
}

export function DialogBody({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot='dialog-body' {...props} className={clx('space-y-1.5 px-6 py-4.5', className)}>
      {children}
    </div>
  )
}

export function DialogDescription({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      data-slot='dialog-description'
      {...props}
      className={clx('text-muted leading-relaxed', className)}
    >
      {children}
    </BaseDialog.Description>
  )
}

export function DialogFooter({ className, children, ...props }: React.ComponentProps<'footer'>) {
  return (
    <footer
      data-slot='dialog-footer'
      {...props}
      className={clx(
        'flex items-center justify-end gap-1.5',
        'bg-dialog-footer border-dialog-border rounded-b-xl border-t px-6 py-3.5',
        className
      )}
    >
      {children}
    </footer>
  )
}

export function DialogClose({
  className,
  children,
  render,
  ...props
}: React.ComponentProps<typeof BaseDialog.Close>) {
  return (
    <BaseDialog.Close
      data-slot='dialog-close'
      render={render}
      {...props}
      className={clx(!render && buttonStyles({ variant: 'plain' }), className)}
    >
      {children}
    </BaseDialog.Close>
  )
}
