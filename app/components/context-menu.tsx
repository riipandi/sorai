/**
 * A menu that appears at the pointer on right click or long press.
 *
 * @see: https://base-ui.com/react/components/context-menu
 *
 * Anatomy:
 * <ContextMenu.Root>
 *   <ContextMenu.Trigger />
 *   <ContextMenu.Portal>
 *     <ContextMenu.Backdrop />
 *     <ContextMenu.Positioner>
 *       <ContextMenu.Popup>
 *         <ContextMenu.Arrow />
 *         <ContextMenu.Item />
 *         <ContextMenu.Separator />
 *         <ContextMenu.Group>
 *           <ContextMenu.GroupLabel />
 *         </ContextMenu.Group>
 *         <ContextMenu.RadioGroup>
 *           <ContextMenu.RadioItem />
 *         </ContextMenu.RadioGroup>
 *         <ContextMenu.CheckboxItem />
 *         <ContextMenu.SubmenuRoot>
 *           <ContextMenu.SubmenuTrigger />
 *         </ContextMenu.SubmenuRoot>
 *       </ContextMenu.Popup>
 *     </ContextMenu.Positioner>
 *   </ContextMenu.Portal>
 * </ContextMenu.Root>
 */

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu'
import { clx, tv, type VariantProps } from '#/utils/variant'

export const contextMenuVariants = tv({
  slots: {
    popup: [
      'bg-popover ring-popover-border shadow-popover origin-(--transform-origin) rounded ring',
      'space-y-0 p-1 transition-[transform,scale,opacity] outline-none',
      'data-ending-style:scale-90 data-ending-style:opacity-0',
      'data-starting-style:scale-90 data-starting-style:opacity-0',
      'min-w-32 **:data-[slot=item]:p-0'
    ],
    item: [
      'text-popover-foreground flex items-center',
      'cursor-pointer select-none',
      'data-highlighted:not-data-disabled:bg-popover-accent data-selected:not-data-disabled:bg-popover-accent',
      'data-popup-open:bg-popover-accent',
      'focus-visible:outline-none',
      '[&_svg:not([class*=text-])]:text-popover-foreground [&_svg:not([class*=size-])]:size-3.5',
      '*:data-[slot=switch]:ml-auto',
      'data-disabled:cursor-not-allowed data-disabled:opacity-70'
    ],
    separator: 'bg-popover-separator my-1 h-px',
    submenuTrigger: [
      'text-popover-foreground flex items-center',
      'cursor-pointer select-none',
      'data-highlighted:not-data-disabled:bg-popover-accent data-selected:not-data-disabled:bg-popover-accent',
      'data-popup-open:bg-popover-accent',
      'focus-visible:outline-none',
      '[&_svg:not([class*=text-])]:text-popover-foreground [&_svg:not([class*=size-])]:size-3.5',
      '*:data-[slot=switch]:ml-auto',
      'data-disabled:cursor-not-allowed data-disabled:opacity-70',
      'after:bg-chevron-right-dark dark:after:bg-chevron-right after:ml-auto after:size-3.5'
    ],
    groupLabel: 'text-dimmed px-2.5 py-1 text-base font-medium',
    radioItem: [
      'text-popover-foreground flex items-center',
      'cursor-pointer select-none',
      'data-highlighted:not-data-disabled:bg-popover-accent data-selected:not-data-disabled:bg-popover-accent',
      'data-popup-open:bg-popover-accent',
      'focus-visible:outline-none',
      '[&_svg:not([class*=text-])]:text-popover-foreground [&_svg:not([class*=size-])]:size-3.5',
      '*:data-[slot=switch]:ml-auto',
      'data-disabled:cursor-not-allowed data-disabled:opacity-70'
    ],
    radioItemIndicator: 'flex size-3 items-center justify-center rounded-full'
  },
  variants: {
    size: {
      compact: {
        popup: [
          '**:data-[slot$=item]:gap-2',
          '**:data-[slot$=item]:px-1.5',
          '**:data-[slot$=item]:py-1',
          '**:data-[slot=context-menu-checkbox-item]:pl-7.5',
          '**:data-[slot=context-menu-checkbox-item]:data-checked:pl-1.5',
          '**:data-[slot$=item]:rounded-sm',
          '**:data-[slot=context-menu-submenu-trigger]:gap-2',
          '**:data-[slot=context-menu-submenu-trigger]:px-1.5',
          '**:data-[slot=context-menu-submenu-trigger]:py-1',
          '**:data-[slot=context-menu-submenu-trigger]:rounded-sm'
        ]
      },
      default: {
        popup: [
          '**:data-[slot$=item]:gap-2.5',
          '**:data-[slot$=item]:px-2.5',
          '**:data-[slot$=item]:py-2',
          '**:data-[slot=context-menu-checkbox-item]:pl-9',
          '**:data-[slot=context-menu-checkbox-item]:data-checked:pl-2',
          '**:data-[slot$=item]:rounded',
          '**:data-[slot=context-menu-submenu-trigger]:gap-2.5',
          '**:data-[slot=context-menu-submenu-trigger]:px-2.5',
          '**:data-[slot=context-menu-submenu-trigger]:py-2',
          '**:data-[slot=context-menu-submenu-trigger]:rounded'
        ]
      }
    },
    variant: {
      default: {},
      alternate: {
        radioItem: [
          '*:data-[slot=context-menu-radio-item-indicator]:order-last',
          '*:data-[slot=context-menu-radio-item-indicator]:ml-auto',
          '*:data-[slot=context-menu-radio-item-indicator]:ring',
          '*:data-[slot=context-menu-radio-item-indicator]:ring-input-border',
          '*:data-[slot=context-menu-radio-item-indicator]:bg-input'
        ]
      }
    }
  },
  defaultVariants: {
    size: 'default',
    variant: 'default'
  }
})

export function ContextMenu({ ...props }: React.ComponentProps<typeof BaseContextMenu.Root>) {
  return <BaseContextMenu.Root data-slot='context-menu' {...props} />
}

export function ContextMenuTrigger({
  ...props
}: React.ComponentProps<typeof BaseContextMenu.Trigger>) {
  return <BaseContextMenu.Trigger data-slot='context-menu-trigger' {...props} />
}

export type ContextMenuPopupProps = React.ComponentProps<typeof BaseContextMenu.Popup> &
  VariantProps<typeof contextMenuVariants>

export function ContextMenuPopup({ children, className, size, ...props }: ContextMenuPopupProps) {
  const styles = contextMenuVariants({ size })
  return (
    <BaseContextMenu.Portal className='z-10'>
      <BaseContextMenu.Positioner className='outline-none'>
        <BaseContextMenu.Popup
          data-slot='context-menu-popup'
          {...props}
          className={clx(styles.popup(), className)}
        >
          {children}
        </BaseContextMenu.Popup>
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  )
}

export function ContextMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseContextMenu.Item>) {
  const styles = contextMenuVariants()
  return (
    <BaseContextMenu.Item
      data-slot='context-menu-item'
      {...props}
      className={clx(styles.item(), className)}
    />
  )
}

export function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseContextMenu.Separator>) {
  const styles = contextMenuVariants()
  return (
    <BaseContextMenu.Separator
      data-slot='context-menu-separator'
      className={clx(styles.separator(), className)}
      {...props}
    />
  )
}

export function ContextMenuSubmenu({
  ...props
}: React.ComponentProps<typeof BaseContextMenu.SubmenuRoot>) {
  return <BaseContextMenu.SubmenuRoot data-slot='context-menu-submenu' {...props} />
}

export function ContextMenuSubmenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BaseContextMenu.SubmenuTrigger>) {
  const styles = contextMenuVariants()
  return (
    <BaseContextMenu.SubmenuTrigger
      data-slot='context-menu-submenu-trigger'
      {...props}
      className={clx(styles.submenuTrigger(), className)}
    />
  )
}

export type ContextMenuSubmenuPopupProps = React.ComponentProps<typeof BaseContextMenu.Popup> &
  VariantProps<typeof contextMenuVariants>

export function ContextMenuSubmenuPopup({ size, ...props }: ContextMenuSubmenuPopupProps) {
  return <ContextMenuPopup data-slot='context-menu-sub-popup' size={size} {...props} />
}

export function ContextMenuGroup({ ...props }: React.ComponentProps<typeof BaseContextMenu.Group>) {
  return <BaseContextMenu.Group data-slot='context-menu-group' {...props} />
}

export function ContextMenuGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseContextMenu.GroupLabel>) {
  const styles = contextMenuVariants()
  return (
    <BaseContextMenu.GroupLabel
      data-slot='context-menu-group-label'
      className={clx(styles.groupLabel(), className)}
      {...props}
    />
  )
}

export function ContextMenuCheckboxItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof BaseContextMenu.CheckboxItem>) {
  const styles = contextMenuVariants()
  return (
    <BaseContextMenu.CheckboxItem
      data-slot='context-menu-checkbox-item'
      {...props}
      className={clx(styles.item(), className)}
    >
      <BaseContextMenu.CheckboxItemIndicator className='w-4'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='3'
          className='text-primary size-3.5'
          viewBox='0 0 24 24'
        >
          <title>Check</title>
          <path d='M20 6 9 17l-5-5'></path>
        </svg>
      </BaseContextMenu.CheckboxItemIndicator>
      {children}
    </BaseContextMenu.CheckboxItem>
  )
}

export function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof BaseContextMenu.RadioGroup>) {
  return <BaseContextMenu.RadioGroup data-slot='context-menu-radio-group' {...props} />
}

export type ContextMenuRadioItemProps = React.ComponentProps<typeof BaseContextMenu.RadioItem> &
  VariantProps<typeof contextMenuVariants>

export function ContextMenuRadioItem({
  className,
  variant,
  children,
  ...props
}: ContextMenuRadioItemProps) {
  const styles = contextMenuVariants({ variant })
  return (
    <BaseContextMenu.RadioItem
      data-slot='context-menu-radio-item'
      {...props}
      className={clx(styles.radioItem(), className)}
    >
      <div className={styles.radioItemIndicator()}>
        <BaseContextMenu.RadioItemIndicator>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='fill-primary stroke-primary mx-auto w-2!'
          >
            <title>Radio</title>
            <circle cx='12' cy='12' r='10' />
          </svg>
        </BaseContextMenu.RadioItemIndicator>
      </div>
      {children}
    </BaseContextMenu.RadioItem>
  )
}
