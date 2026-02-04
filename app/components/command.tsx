/**
 * A command palette component for searching and executing actions.
 *
 * Anatomy:
 * <Command>
 *   <CommandTrigger />
 *   <CommandContent>
 *     <CommandBody />
 *     <CommandFooter />
 *   </CommandContent>
 * </Command>
 */

import { clx, tv } from '#/utils/variant'
import { Dialog, DialogBody, DialogPopup, DialogTrigger } from './dialog'

const commandVariants = tv({
  base: '',
  slots: {
    trigger: '',
    content: [
      'bg-dialog-footer/90 rounded-[calc(var(--radius-lg)+0.25rem)] p-1 md:min-w-xl',
      '**:data-[slot=autocomplete-list]:h-[min(27rem,50dvh)]',
      '**:data-[slot=autocomplete-empty]:h-[min(27rem,50dvh)]',
      '**:data-[slot=autocomplete-input]:h-11',
      '**:data-[slot=input-group]:px-2.5',
      '**:data-[slot=input-group]:border-b',
      '**:data-[slot=input-group]:border-dialog-border'
    ],
    body: [
      'bg-dialog border-dialog-border space-y-0 rounded-lg border p-0 shadow',
      '**:data-[slot=autocomplete-list]:px-2.5 **:data-[slot=autocomplete-list]:py-1.5'
    ],
    footer: 'flex items-center gap-5 px-4 pt-2 pb-1',
    footerItem: 'flex items-center gap-2 p-0.5',
    footerText: 'text-muted text-base font-medium'
  }
})

export type CommandProps = React.ComponentProps<typeof Dialog>
export type CommandTriggerProps = React.ComponentProps<typeof DialogTrigger>
export type CommandContentProps = React.ComponentProps<typeof DialogPopup>
export type CommandBodyProps = React.ComponentProps<typeof DialogBody>
export type CommandFooterProps = React.ComponentProps<'footer'>
export type CommandFooterItemProps = React.ComponentProps<'div'>
export type CommandFooterTextProps = React.ComponentProps<'span'>

export function Command({ ...props }: CommandProps) {
  return <Dialog {...props} />
}

export function CommandTrigger({ className, ...props }: CommandTriggerProps) {
  const styles = commandVariants()
  return (
    <DialogTrigger
      data-slot='command-trigger'
      {...props}
      className={clx(styles.trigger(), className)}
    />
  )
}

export function CommandContent({ className, ...props }: CommandContentProps) {
  const styles = commandVariants()
  return <DialogPopup {...props} className={clx(styles.content(), className)} />
}

export function CommandBody({ className, ...props }: CommandBodyProps) {
  const styles = commandVariants()
  return <DialogBody {...props} className={clx(styles.body(), className)}></DialogBody>
}

export function CommandFooter({ className, ...props }: CommandFooterProps) {
  const styles = commandVariants()
  return <footer data-slot='command-footer' {...props} className={styles.footer({ className })} />
}

export function CommandFooterItem({ className, ...props }: CommandFooterItemProps) {
  const styles = commandVariants()
  return (
    <div data-slot='command-footer-item' {...props} className={styles.footerItem({ className })} />
  )
}

export function CommandFooterText({ className, ...props }: CommandFooterTextProps) {
  const styles = commandVariants()
  return (
    <span data-slot='command-footer-text' {...props} className={styles.footerText({ className })} />
  )
}
