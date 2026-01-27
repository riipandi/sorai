/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar'
import { clx } from '#/utils'

export function Toolbar({ className, ...props }: React.ComponentProps<typeof BaseToolbar.Root>) {
  return (
    <BaseToolbar.Root
      data-slot='toolbar'
      className={clx(
        'bg-background ring-card-border flex items-center rounded-lg p-1 ring',
        '*:data-[slot=toggle-group]:p-0',
        className
      )}
      {...props}
    />
  )
}

export function ToolbarButton({
  className,
  ...props
}: React.ComponentProps<typeof BaseToolbar.Button>) {
  return <BaseToolbar.Button data-slot='toolbar-button' className={clx(className)} {...props} />
}

export function ToolbarLink({
  className,
  ...props
}: React.ComponentProps<typeof BaseToolbar.Link>) {
  return <BaseToolbar.Link data-slot='toolbar-link' className={clx(className)} {...props} />
}

export function ToolbarInput({
  className,
  ...props
}: React.ComponentProps<typeof BaseToolbar.Input>) {
  return <BaseToolbar.Input data-slot='toolbar-input' className={clx(className)} {...props} />
}

export function ToolbarGroup({
  className,
  ...props
}: React.ComponentProps<typeof BaseToolbar.Group>) {
  return (
    <BaseToolbar.Group
      data-slot='toolbar-group'
      className={clx('flex gap-0.5', className)}
      {...props}
    />
  )
}

export function ToolbarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseToolbar.Separator>) {
  return (
    <BaseToolbar.Separator
      data-slot='toolbar-separator'
      className={clx('bg-separator mx-4 h-4 w-px', className)}
      {...props}
    />
  )
}
