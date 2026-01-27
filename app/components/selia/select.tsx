/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Select as BaseSelect } from '@base-ui/react/select'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { clx } from '#/utils'
import { Chip } from './chip'

export type SelectItem = {
  value: string
  label: React.ReactNode
  icon?: React.ReactNode
}

export function Select({ ...props }: React.ComponentProps<typeof BaseSelect.Root>) {
  return <BaseSelect.Root {...props} />
}

export const selectTriggerStyles = cva(
  [
    'bg-input placeholder:text-dimmed h-9.5 w-full rounded px-3.5 transition-all',
    'focus:ring-primary focus:ring-2 focus:outline-0',
    'flex cursor-pointer items-center gap-2.5',
    'data-disabled:cursor-not-allowed data-disabled:opacity-70'
  ],
  {
    variants: {
      variant: {
        default:
          'bg-input ring-input-border hover:not-[[data-disabled]]:not-[:focus]:ring-input-accent-border shadow-input ring',
        subtle:
          'bg-input/60 ring-input-border hover:not-[[data-disabled]]:not-[:focus]:ring-input-accent-border shadow-input ring',
        plain: 'hover:not-[[data-disabled]]:bg-accent bg-transparent'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export function SelectTrigger({
  className,
  children,
  variant,
  ...props
}: React.ComponentProps<typeof BaseSelect.Trigger> & VariantProps<typeof selectTriggerStyles>) {
  return (
    <BaseSelect.Trigger
      data-slot='select-trigger'
      className={clx(selectTriggerStyles({ variant, className }))}
      {...props}
    >
      {children}

      <BaseSelect.Icon className='text-muted pointer-events-none ml-auto size-4'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
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
}: React.ComponentProps<typeof BaseSelect.Value> & {
  placeholder?: string
}) {
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
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return <span className='text-dimmed'>{placeholder}</span>
  }

  if (Array.isArray(value)) {
    const firstValue = value[0]
    const firstValueLabel = typeof firstValue === 'object' ? firstValue.label : firstValue
    const additionalValues =
      value.length > 1 ? (
        <Chip className='ml-1.5' size='sm'>
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
      <div className='[&_svg:not([class*=text-])]:text-popover-foreground flex items-center gap-2.5 select-none [&_svg:not([class*=size-])]:size-4'>
        {value.icon}
        <span className='text-popover-foreground'>{value.label}</span>
      </div>
    )
  }

  return <span className='text-popover-foreground select-none'>{value}</span>
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
}: React.ComponentProps<typeof BaseSelect.Popup> &
  VariantProps<typeof selectTriggerStyles> & {
    align?: BaseSelect.Positioner.Props['align']
    alignOffset?: BaseSelect.Positioner.Props['alignOffset']
    side?: BaseSelect.Positioner.Props['side']
    sideOffset?: BaseSelect.Positioner.Props['sideOffset']
    anchor?: BaseSelect.Positioner.Props['anchor']
    sticky?: BaseSelect.Positioner.Props['sticky']
    positionMethod?: BaseSelect.Positioner.Props['positionMethod']
  }) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Backdrop />
      <BaseSelect.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset || 6}
        anchor={anchor}
        sticky={sticky}
        positionMethod={positionMethod}
      >
        <BaseSelect.ScrollUpArrow className='text-popover-foreground bg-popover-accent absolute top-1 right-1 left-1 z-10 flex h-5 items-center justify-around rounded text-xs' />
        <BaseSelect.Popup
          data-slot='select-popup'
          {...props}
          className={clx(
            'group bg-popover ring-popover-border shadow-popover origin-(--transform-origin) rounded ring',
            'p-1 outline-none max-lg:w-(--anchor-width)',
            className
          )}
        >
          <BaseSelect.Arrow />
          {children}
        </BaseSelect.Popup>
        <BaseSelect.ScrollDownArrow className='text-popover-foreground bg-popover-accent absolute right-1 bottom-1 left-1 z-10 flex h-5 items-center justify-around rounded text-xs' />
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  )
}

export function SelectList({ className, ...props }: React.ComponentProps<typeof BaseSelect.List>) {
  return (
    <BaseSelect.List
      data-slot='select-list'
      className={clx('relative max-h-(--available-height) space-y-0.5 overflow-y-auto', className)}
      {...props}
    />
  )
}

export function SelectItem({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof BaseSelect.Item>) {
  return (
    <BaseSelect.Item
      data-slot='select-item'
      value={typeof value === 'object' ? value : { value, label: children }}
      className={clx(
        'text-popover-foreground flex cursor-pointer items-center gap-3.5 rounded px-3 py-2.5 select-none',
        'group-data-[side=none]:min-w-[calc(var(--anchor-width))]',
        'data-[highlighted]:not-[[data-disabled]]:bg-popover-accent data-[selected]:not-[[data-disabled]]:bg-popover-accent',
        'focus-visible:outline-none',
        'data-disabled:cursor-not-allowed data-disabled:opacity-70',
        className
      )}
      {...props}
    >
      <BaseSelect.ItemText className='flex items-center gap-2.5 [&_svg:not([class*=size-])]:size-4'>
        {children}
      </BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className='ml-auto'>
        <svg
          className='text-primary size-4'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='3'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <polyline points='20 6 9 17 4 12' />
        </svg>
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  )
}

export function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.Group>) {
  return (
    <BaseSelect.Group
      data-slot='select-group'
      className={clx('space-y-0.5', className)}
      {...props}
    />
  )
}

export function SelectGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.GroupLabel>) {
  return (
    <BaseSelect.GroupLabel
      data-slot='select-group-label'
      className={clx('text-dimmed px-3 py-1.5 text-sm font-medium', className)}
      {...props}
    />
  )
}

export function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.Separator>) {
  return (
    <BaseSelect.Separator
      data-slot='select-separator'
      className={clx('bg-popover-separator my-1 h-px', className)}
      {...props}
    />
  )
}
