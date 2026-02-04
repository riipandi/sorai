/**
 * Displays a list of options for the user to choose from.
 *
 * @see: https://base-ui.com/react/components/select
 *
 * Anatomy:
 * <Select.Root>
 *   <Select.Trigger>
 *     <Select.Value />
 *     <Select.Icon />
 *   </Select.Trigger>
 *   <Select.Portal>
 *     <Select.Backdrop />
 *     <Select.Positioner>
 *       <Select.ScrollUpArrow />
 *       <Select.Popup>
 *         <Select.Arrow />
 *         <Select.List>
 *           <Select.Item>
 *             <Select.ItemText />
 *             <Select.ItemIndicator />
 *           </Select.Item>
 *           <Select.Separator />
 *           <Select.Group>
 *             <Select.GroupLabel />
 *           </Select.Group>
 *         </Select.List>
 *       </Select.Popup>
 *       <Select.ScrollDownArrow />
 *     </Select.Positioner>
 *   </Select.Portal>
 * </Select.Root>
 */

import { Select as BaseSelect } from '@base-ui/react/select'
import * as React from 'react'
import { clx, tv, type VariantProps } from '#/utils/variant'
import { Chip } from './chip'

export type SelectItem = {
  value: string
  label: React.ReactNode
  icon?: React.ReactNode
}

const selectVariants = tv({
  base: [
    'bg-input placeholder:text-dimmed h-9 w-full rounded px-3 transition-all',
    'focus:ring-primary focus:ring-2 focus:outline-0',
    'flex cursor-pointer items-center gap-2',
    'data-disabled:cursor-not-allowed data-disabled:opacity-70'
  ],
  slots: {
    portal: 'z-20',
    positioner: [],
    backdrop: [],
    popup: [
      'group bg-popover ring-popover-border shadow-popover origin-(--transform-origin) rounded ring',
      'p-1 outline-none max-lg:w-(--anchor-width)'
    ],
    arrow: [],
    scrollUpArrow: [
      'text-popover-foreground bg-popover-accent absolute top-1 right-1 left-1 z-10',
      'flex h-5 items-center justify-around rounded text-xs'
    ],
    scrollDownArrow: [
      'text-popover-foreground bg-popover-accent absolute right-1 bottom-1 left-1 z-10',
      'flex h-5 items-center justify-around rounded text-xs'
    ],
    list: 'relative max-h-(--available-height) space-y-0.5 overflow-y-auto',
    item: [
      // FIXME: right border radius not rounded if enabled
      // 'group-data-[side=none]:min-w-[calc(var(--anchor-width))]',
      'text-popover-foreground flex cursor-pointer items-center gap-2.5 rounded px-2.5 py-2 select-none',
      'data-highlighted:not-data-disabled:bg-popover-accent data-selected:not-data-disabled:bg-popover-accent',
      'data-disabled:text-dimmed/80 focus-visible:outline-none data-disabled:cursor-not-allowed'
    ],
    itemText: 'flex items-center gap-2 [&_svg:not([class*=size-])]:size-3.5',
    itemIndicator: 'ml-auto',
    group: 'space-y-0',
    groupLabel: 'text-dimmed px-2.5 py-1 text-sm font-medium',
    separator: 'bg-popover-separator my-1 h-px',
    icon: 'text-muted pointer-events-none ml-auto size-3.5',
    placeholder: 'text-dimmed',
    chip: 'ml-1.5',
    valueWrapper: [
      '[&_svg:not([class*=text-])]:text-popover-foreground flex items-center gap-2 select-none [&_svg:not([class*=size-])]:size-3.5'
    ],
    valueLabel: 'text-popover-foreground',
    valueText: 'text-popover-foreground select-none'
  },
  variants: {
    variant: {
      default: {
        base: 'bg-input ring-input-border hover:not-data-disabled:not-focus:ring-input-accent-border shadow-input ring'
      },
      subtle: {
        base: 'bg-input/60 ring-input-border hover:not-data-disabled:not-focus:ring-input-accent-border shadow-input ring'
      },
      plain: {
        base: 'hover:not-data-disabled:bg-accent bg-transparent'
      }
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export type SelectRootProps = React.ComponentProps<typeof BaseSelect.Root>
export type SelectTriggerProps = React.ComponentProps<typeof BaseSelect.Trigger> &
  VariantProps<typeof selectVariants>
export type SelectValueProps = React.ComponentProps<typeof BaseSelect.Value> & {
  placeholder?: string
}
export type SelectPopupProps = React.ComponentProps<typeof BaseSelect.Popup> &
  VariantProps<typeof selectVariants> & {
    align?: BaseSelect.Positioner.Props['align']
    alignOffset?: BaseSelect.Positioner.Props['alignOffset']
    side?: BaseSelect.Positioner.Props['side']
    sideOffset?: BaseSelect.Positioner.Props['sideOffset']
    anchor?: BaseSelect.Positioner.Props['anchor']
    sticky?: BaseSelect.Positioner.Props['sticky']
    positionMethod?: BaseSelect.Positioner.Props['positionMethod']
  }
export type SelectListProps = React.ComponentProps<typeof BaseSelect.List>
export type SelectItemProps = React.ComponentProps<typeof BaseSelect.Item>
export type SelectGroupProps = React.ComponentProps<typeof BaseSelect.Group>
export type SelectGroupLabelProps = React.ComponentProps<typeof BaseSelect.GroupLabel>
export type SelectSeparatorProps = React.ComponentProps<typeof BaseSelect.Separator>

export function Select({ ...props }: SelectRootProps) {
  return <BaseSelect.Root {...props} />
}

export function SelectTrigger({ className, children, variant, ...props }: SelectTriggerProps) {
  const styles = selectVariants({ variant })
  return (
    <BaseSelect.Trigger
      data-slot='select-trigger'
      className={clx(styles.base(), className)}
      {...props}
    >
      {children}
      <BaseSelect.Icon className={clx(styles.icon())}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <title>Select dropdown icon</title>
          <polyline points='6 9 12 15 18 9' />
        </svg>
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  )
}

export function SelectValue({
  className,
  placeholder = 'Select an option',
  ...props
}: SelectValueProps) {
  return (
    <BaseSelect.Value data-slot='select-value' className={clx(className)} {...props}>
      {(value: string | SelectItem | null) => (
        <SelectRenderValue value={value} placeholder={placeholder} />
      )}
    </BaseSelect.Value>
  )
}

function SelectRenderValue({
  value,
  placeholder
}: {
  value: string | SelectItem | SelectItem[] | null
  placeholder: string
}) {
  const styles = selectVariants()

  if (!value || (Array.isArray(value) && value.length === 0)) {
    return <span className={clx(styles.placeholder())}>{placeholder}</span>
  }

  if (Array.isArray(value)) {
    const firstValue = value[0]
    const firstValueLabel = typeof firstValue === 'object' ? firstValue.label : firstValue
    const additionalValues =
      value.length > 1 ? (
        <Chip className={clx(styles.chip())} size='sm'>
          +{value.length - 1} more
        </Chip>
      ) : (
        ''
      )

    return (
      <>
        {firstValueLabel}
        {additionalValues}
      </>
    )
  }

  if (typeof value === 'object') {
    return (
      <div className={clx(styles.valueWrapper())}>
        {value.icon}
        <span className={clx(styles.valueLabel())}>{value.label}</span>
      </div>
    )
  }

  return <span className={clx(styles.valueText())}>{value}</span>
}

export function SelectPopup({
  children,
  className,
  align,
  alignOffset,
  side,
  sideOffset,
  anchor,
  sticky,
  positionMethod,
  ...props
}: SelectPopupProps) {
  const styles = selectVariants()
  return (
    <BaseSelect.Portal className={clx(styles.portal())}>
      <BaseSelect.Backdrop className={clx(styles.backdrop())} />
      <BaseSelect.Positioner
        data-slot='select-positioner'
        className={clx(styles.positioner())}
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset || 6}
        anchor={anchor}
        sticky={sticky}
        positionMethod={positionMethod}
      >
        <BaseSelect.ScrollUpArrow className={clx(styles.scrollUpArrow())} />
        <BaseSelect.Popup
          data-slot='select-popup'
          className={clx(styles.popup(), className)}
          {...props}
        >
          <BaseSelect.Arrow className={clx(styles.arrow())} />
          {children}
        </BaseSelect.Popup>
        <BaseSelect.ScrollDownArrow className={clx(styles.scrollDownArrow())} />
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  )
}

export function SelectList({ className, ...props }: SelectListProps) {
  const styles = selectVariants()
  return (
    <BaseSelect.List data-slot='select-list' className={clx(styles.list(), className)} {...props} />
  )
}

export function SelectItem({ className, children, value, ...props }: SelectItemProps) {
  const styles = selectVariants()
  return (
    <BaseSelect.Item
      data-slot='select-item'
      value={typeof value === 'object' ? value : { value, label: children }}
      className={clx(styles.item(), className)}
      {...props}
    >
      <BaseSelect.ItemText className={clx(styles.itemText())}>{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className={clx(styles.itemIndicator())}>
        <svg
          className='text-primary size-3.5'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='3'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <title>Selected checkmark</title>
          <polyline points='20 6 9 17 4 12' />
        </svg>
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  )
}

export function SelectGroup({ className, ...props }: SelectGroupProps) {
  const styles = selectVariants()
  return (
    <BaseSelect.Group
      data-slot='select-group'
      className={clx(styles.group(), className)}
      {...props}
    />
  )
}

export function SelectGroupLabel({ className, ...props }: SelectGroupLabelProps) {
  const styles = selectVariants()
  return (
    <BaseSelect.GroupLabel
      data-slot='select-group-label'
      className={clx(styles.groupLabel(), className)}
      {...props}
    />
  )
}

export function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  const styles = selectVariants()
  return (
    <BaseSelect.Separator
      data-slot='select-separator'
      className={clx(styles.separator(), className)}
      {...props}
    />
  )
}
