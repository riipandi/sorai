/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Menu as BaseMenu } from '@base-ui/react/menu'
import { cva, type VariantProps } from 'class-variance-authority'
import { clx } from '#/utils'

// TODO: Add option to change `density` like Sidebar `size` option
export function Menu({ ...props }: React.ComponentProps<typeof BaseMenu.Root>) {
  return <BaseMenu.Root data-slot='menu' {...props} />
}

export function MenuTrigger({ ...props }: React.ComponentProps<typeof BaseMenu.Trigger>) {
  return <BaseMenu.Trigger data-slot='menu-trigger' {...props} />
}

export const menuPopupStyles = cva(
  [
    'bg-popover ring-popover-border shadow-popover origin-(--transform-origin) rounded ring',
    'space-y-0.5 p-1 transition-[transform,scale,opacity] outline-none',
    'data-[ending-style]:scale-90 data-[ending-style]:opacity-0',
    'data-[starting-style]:scale-90 data-[starting-style]:opacity-0',
    'min-w-32 **:data-[slot=item]:p-0'
  ],
  {
    variants: {
      size: {
        compact: [
          '**:data-[slot$=item]:gap-2.5',
          '**:data-[slot$=item]:px-2',
          '**:data-[slot$=item]:py-1.5',
          '**:data-[slot=menu-checkbox-item]:pl-8.5',
          '**:data-[slot=menu-checkbox-item]:data-[checked]:pl-2',
          '**:data-[slot$=item]:rounded-sm',
          '**:data-[slot=menu-submenu-trigger]:gap-2.5',
          '**:data-[slot=menu-submenu-trigger]:px-2',
          '**:data-[slot=menu-submenu-trigger]:py-1.5',
          '**:data-[slot=menu-submenu-trigger]:rounded-sm'
        ],
        default: [
          '**:data-[slot$=item]:gap-3.5',
          '**:data-[slot$=item]:px-3',
          '**:data-[slot$=item]:py-2.5',
          '**:data-[slot=menu-checkbox-item]:pl-10',
          '**:data-[slot=menu-checkbox-item]:data-[checked]:pl-2.5',
          '**:data-[slot$=item]:rounded',
          '**:data-[slot=menu-submenu-trigger]:gap-3.5',
          '**:data-[slot=menu-submenu-trigger]:px-3',
          '**:data-[slot=menu-submenu-trigger]:py-2.5',
          '**:data-[slot=menu-submenu-trigger]:rounded'
        ]
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
)

export function MenuPopup({
  children,
  className,
  align,
  alignOffset,
  side,
  sideOffset,
  anchor,
  sticky,
  positionMethod,
  size,
  ...props
}: React.ComponentProps<typeof BaseMenu.Popup> & {
  align?: BaseMenu.Positioner.Props['align']
  alignOffset?: BaseMenu.Positioner.Props['alignOffset']
  side?: BaseMenu.Positioner.Props['side']
  sideOffset?: BaseMenu.Positioner.Props['sideOffset']
  anchor?: BaseMenu.Positioner.Props['anchor']
  sticky?: BaseMenu.Positioner.Props['sticky']
  positionMethod?: BaseMenu.Positioner.Props['positionMethod']
} & VariantProps<typeof menuPopupStyles>) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Backdrop />
      <BaseMenu.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset || 6}
        anchor={anchor}
        sticky={sticky}
        positionMethod={positionMethod}
      >
        <BaseMenu.Popup
          data-slot='menu-popup'
          {...props}
          className={clx(menuPopupStyles({ size, className }))}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
}

const menuItemClassName = [
  'flex items-center text-popover-foreground',
  'cursor-pointer select-none',
  'data-[highlighted]:not-[[data-disabled]]:bg-popover-accent data-[selected]:not-[[data-disabled]]:bg-popover-accent',
  'data-[popup-open]:bg-popover-accent',
  'focus-visible:outline-none',
  '[&_svg:not([class*=size-])]:size-4 [&_svg:not([class*=text-])]:text-popover-foreground',
  '*:data-[slot=switch]:ml-auto',
  'data-disabled:cursor-not-allowed data-disabled:opacity-70'
]

export function MenuItem({ ...props }: React.ComponentProps<typeof BaseMenu.Item>) {
  return (
    <BaseMenu.Item
      data-slot='menu-item'
      {...props}
      className={clx(menuItemClassName, props.className)}
    />
  )
}

export function MenuSeparator({ ...props }: React.ComponentProps<typeof BaseMenu.Separator>) {
  return (
    <BaseMenu.Separator
      data-slot='menu-separator'
      className={clx('bg-popover-separator my-1 h-px', props.className)}
      {...props}
    />
  )
}

export function MenuSubmenu({ ...props }: React.ComponentProps<typeof BaseMenu.SubmenuRoot>) {
  return <BaseMenu.SubmenuRoot data-slot='menu-submenu' {...props} />
}

export function MenuSubmenuTrigger({
  ...props
}: React.ComponentProps<typeof BaseMenu.SubmenuTrigger>) {
  return (
    <BaseMenu.SubmenuTrigger
      data-slot='menu-submenu-trigger'
      {...props}
      className={clx(
        menuItemClassName,
        'after:bg-chevron-right-dark dark:after:bg-chevron-right after:ml-auto after:size-4',
        props.className
      )}
    />
  )
}

export function MenuSubmenuPopup({
  align,
  alignOffset,
  side,
  sideOffset = 5,
  anchor,
  sticky,
  positionMethod,
  ...props
}: React.ComponentProps<typeof BaseMenu.Popup> & {
  align?: BaseMenu.Positioner.Props['align']
  alignOffset?: BaseMenu.Positioner.Props['alignOffset']
  side?: BaseMenu.Positioner.Props['side']
  sideOffset?: BaseMenu.Positioner.Props['sideOffset']
  anchor?: BaseMenu.Positioner.Props['anchor']
  sticky?: BaseMenu.Positioner.Props['sticky']
  positionMethod?: BaseMenu.Positioner.Props['positionMethod']
} & VariantProps<typeof menuPopupStyles>) {
  return (
    <MenuPopup
      data-slot='menu-sub-popup'
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      anchor={anchor}
      sticky={sticky}
      positionMethod={positionMethod}
      {...props}
    />
  )
}

export function MenuGroup({ ...props }: React.ComponentProps<typeof BaseMenu.Group>) {
  return <BaseMenu.Group data-slot='menu-group' {...props} />
}

export function MenuGroupLabel({ ...props }: React.ComponentProps<typeof BaseMenu.GroupLabel>) {
  return (
    <BaseMenu.GroupLabel
      data-slot='menu-group-label'
      className={clx('text-dimmed px-3 py-1.5 text-sm font-medium', props.className)}
      {...props}
    />
  )
}

export function MenuCheckboxItem({
  children,
  ...props
}: React.ComponentProps<typeof BaseMenu.CheckboxItem>) {
  return (
    <BaseMenu.CheckboxItem
      data-slot='menu-checkbox-item'
      {...props}
      className={clx(menuItemClassName, props.className)}
    >
      <BaseMenu.CheckboxItemIndicator className='w-4'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='3'
          className='text-primary size-4'
          viewBox='0 0 24 24'
        >
          <path d='M20 6 9 17l-5-5'></path>
        </svg>
      </BaseMenu.CheckboxItemIndicator>
      {children}
    </BaseMenu.CheckboxItem>
  )
}

export function MenuRadioGroup({ ...props }: React.ComponentProps<typeof BaseMenu.RadioGroup>) {
  return <BaseMenu.RadioGroup data-slot='menu-radio-group' {...props} />
}

export const menuRadioItemStyles = cva(menuItemClassName, {
  variants: {
    variant: {
      default: 'data-[checked]:pl-3',
      alternate: [
        '*:data-[slot=menu-radio-item-indicator]:order-last',
        '*:data-[slot=menu-radio-item-indicator]:ml-auto',
        '*:data-[slot=menu-radio-item-indicator]:ring',
        '*:data-[slot=menu-radio-item-indicator]:ring-input-border',
        '*:data-[slot=menu-radio-item-indicator]:bg-input'
      ]
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export function MenuRadioItem({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<typeof BaseMenu.RadioItem> & VariantProps<typeof menuRadioItemStyles>) {
  return (
    <BaseMenu.RadioItem
      data-slot='menu-radio-item'
      {...props}
      className={menuRadioItemStyles({ variant, className })}
    >
      <div
        data-slot='menu-radio-item-indicator'
        className='flex size-3 items-center justify-center rounded-full'
      >
        <BaseMenu.RadioItemIndicator>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='fill-primary stroke-primary mx-auto !w-2'
          >
            <circle cx='12' cy='12' r='10' />
          </svg>
        </BaseMenu.RadioItemIndicator>
      </div>
      {children}
    </BaseMenu.RadioItem>
  )
}
