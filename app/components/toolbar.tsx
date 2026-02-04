/**
 * A container for toolbar items.
 *
 * @see: https://base-ui.com/react/components/toolbar
 *
 * Anatomy:
 * <Toolbar.Root>
 *   <Toolbar.Button />
 *   <Toolbar.Link />
 *   <Toolbar.Separator />
 *   <Toolbar.Group>
 *     <Toolbar.Button />
 *     <Toolbar.Button />
 *   <Toolbar.Group />
 *   <Toolbar.Input />
 * </Toolbar.Root>
 */

import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar'
import { clx, tv } from '#/utils/variant'

const toolbarVariants = tv({
  slots: {
    root: [
      'bg-background ring-card-border flex items-center rounded-lg ring',
      'px-1.5 py-1 *:data-[slot=toggle-group]:p-0'
    ],
    button: '',
    link: '',
    input: '',
    group: 'flex gap-1',
    separator: 'bg-separator mx-1.5 h-5 w-px'
  }
})

export type ToolbarRootProps = React.ComponentProps<typeof BaseToolbar.Root>
export type ToolbarButtonProps = React.ComponentProps<typeof BaseToolbar.Button>
export type ToolbarLinkProps = React.ComponentProps<typeof BaseToolbar.Link>
export type ToolbarInputProps = React.ComponentProps<typeof BaseToolbar.Input>
export type ToolbarGroupProps = React.ComponentProps<typeof BaseToolbar.Group>
export type ToolbarSeparatorProps = React.ComponentProps<typeof BaseToolbar.Separator>

export function Toolbar({ className, ...props }: ToolbarRootProps) {
  const styles = toolbarVariants()
  return (
    <BaseToolbar.Root data-slot='toolbar' className={clx(styles.root(), className)} {...props} />
  )
}

export function ToolbarButton({ className, ...props }: ToolbarButtonProps) {
  const styles = toolbarVariants()
  return (
    <BaseToolbar.Button
      data-slot='toolbar-button'
      className={clx(styles.button(), className)}
      {...props}
    />
  )
}

export function ToolbarLink({ className, ...props }: ToolbarLinkProps) {
  const styles = toolbarVariants()
  return (
    <BaseToolbar.Link
      data-slot='toolbar-link'
      className={clx(styles.link(), className)}
      {...props}
    />
  )
}

export function ToolbarInput({ className, ...props }: ToolbarInputProps) {
  const styles = toolbarVariants()
  return (
    <BaseToolbar.Input
      data-slot='toolbar-input'
      className={clx(styles.input(), className)}
      {...props}
    />
  )
}

export function ToolbarGroup({ className, ...props }: ToolbarGroupProps) {
  const styles = toolbarVariants()
  return (
    <BaseToolbar.Group
      data-slot='toolbar-group'
      className={clx(styles.group(), className)}
      {...props}
    />
  )
}

export function ToolbarSeparator({ className, ...props }: ToolbarSeparatorProps) {
  const styles = toolbarVariants()
  return (
    <BaseToolbar.Separator
      data-slot='toolbar-separator'
      className={clx(styles.separator(), className)}
      {...props}
    />
  )
}
