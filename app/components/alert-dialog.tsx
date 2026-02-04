/**
 * A dialog that requires a user response to proceed.
 *
 * @see: https://base-ui.com/react/components/alert-dialog
 *
 * Anatomy:
 * <AlertDialog.Root>
 *   <AlertDialog.Trigger />
 *   <AlertDialog.Portal>
 *     <AlertDialog.Backdrop />
 *     <AlertDialog.Viewport>
 *       <AlertDialog.Popup>
 *         <AlertDialog.Title />
 *         <AlertDialog.Description />
 *         <AlertDialog.Close />
 *       </AlertDialog.Popup>
 *     </AlertDialog.Viewport>
 *   </AlertDialog.Portal>
 * </AlertDialog.Root>
 */

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog'
import { clx, tv } from '#/utils/variant'
import { buttonStyles } from './button'

const alertDialogVariants = tv({
  slots: {
    backdrop: [
      'fixed inset-0 min-h-dvh bg-black/60 backdrop-blur-sm transition-[color,opacity]',
      'data-ending-style:opacity-0 data-starting-style:opacity-0'
    ],
    popup: [
      'fixed left-1/2 -translate-x-1/2 -translate-y-1/2',
      'top-[calc(50%+1.25rem*var(--nested-dialogs))]',
      'bg-dialog text-dialog-foreground backdrop-blur-sm',
      'ring-dialog-border rounded-xl shadow ring',
      'scale-[calc(1-0.1*var(--nested-dialogs))]',
      'w-md max-w-[calc(100%-2rem)] transition-all outline-none',
      'data-nested-dialog-open:after:absolute',
      'data-nested-dialog-open:after:inset-0',
      'data-nested-dialog-open:after:rounded-xl',
      'data-nested-dialog-open:after:bg-black/20',
      'data-nested-dialog-open:after:z-10',
      'data-ending-style:opacity-0 data-starting-style:opacity-0',
      'data-ending-style:scale-90 data-starting-style:scale-90'
    ],
    header: 'flex items-center gap-2.5 px-5 pt-4',
    title: 'text-xl font-semibold',
    body: 'px-5 py-4',
    description: 'text-muted leading-relaxed',
    footer: [
      'flex items-center justify-end gap-2',
      'bg-dialog-footer border-dialog-border rounded-b-xl border-t px-5 py-3'
    ]
  }
})

export type AlertDialogRootProps = React.ComponentProps<typeof BaseAlertDialog.Root>
export type AlertDialogTriggerProps = React.ComponentProps<typeof BaseAlertDialog.Trigger>
export type AlertDialogPopupProps = React.ComponentProps<typeof BaseAlertDialog.Popup>
export type AlertDialogHeaderProps = React.ComponentProps<'header'>
export type AlertDialogTitleProps = React.ComponentProps<typeof BaseAlertDialog.Title>
export type AlertDialogBodyProps = React.ComponentProps<'div'>
export type AlertDialogDescriptionProps = React.ComponentProps<typeof BaseAlertDialog.Description>
export type AlertDialogFooterProps = React.ComponentProps<'footer'>
export type AlertDialogCloseProps = React.ComponentProps<typeof BaseAlertDialog.Close>

export function AlertDialog({ ...props }: AlertDialogRootProps) {
  return <BaseAlertDialog.Root data-slot='alert-dialog' {...props} />
}

export function AlertDialogTrigger({ children, ...props }: AlertDialogTriggerProps) {
  return (
    <BaseAlertDialog.Trigger data-slot='alert-dialog-trigger' {...props}>
      {children}
    </BaseAlertDialog.Trigger>
  )
}

export function AlertDialogPopup({ className, children, ...props }: AlertDialogPopupProps) {
  const styles = alertDialogVariants()
  return (
    <BaseAlertDialog.Portal>
      <BaseAlertDialog.Backdrop className={styles.backdrop()} />
      <BaseAlertDialog.Popup
        data-slot='alert-dialog-popup'
        className={clx(styles.popup(), className)}
        {...props}
      >
        {children}
      </BaseAlertDialog.Popup>
    </BaseAlertDialog.Portal>
  )
}

export function AlertDialogHeader({ className, children, ...props }: AlertDialogHeaderProps) {
  const styles = alertDialogVariants()
  return (
    <header data-slot='alert-dialog-header' className={styles.header({ className })} {...props}>
      {children}
    </header>
  )
}

export function AlertDialogTitle({ className, children, ...props }: AlertDialogTitleProps) {
  const styles = alertDialogVariants()
  return (
    <BaseAlertDialog.Title
      data-slot='alert-dialog-title'
      className={clx(styles.title(), className)}
      {...props}
    >
      {children}
    </BaseAlertDialog.Title>
  )
}

export function AlertDialogBody({ className, children, ...props }: AlertDialogBodyProps) {
  const styles = alertDialogVariants()
  return (
    <div data-slot='alert-dialog-body' className={styles.body({ className })} {...props}>
      {children}
    </div>
  )
}

export function AlertDialogDescription({
  className,
  children,
  ...props
}: AlertDialogDescriptionProps) {
  const styles = alertDialogVariants()
  return (
    <BaseAlertDialog.Description
      data-slot='alert-dialog-description'
      className={clx(styles.description(), className)}
      {...props}
    >
      {children}
    </BaseAlertDialog.Description>
  )
}

export function AlertDialogFooter({ className, children, ...props }: AlertDialogFooterProps) {
  const styles = alertDialogVariants()
  return (
    <footer data-slot='alert-dialog-footer' className={styles.footer({ className })} {...props}>
      {children}
    </footer>
  )
}

export function AlertDialogClose({ className, render, children, ...props }: AlertDialogCloseProps) {
  const styles = buttonStyles({ variant: 'plain' })
  return (
    <BaseAlertDialog.Close
      data-slot='alert-dialog-close'
      render={render}
      className={clx(!render && styles, className)}
      {...props}
    >
      {children}
    </BaseAlertDialog.Close>
  )
}
