/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { clx } from '#/utils'
import { Chip } from './chip'

export function Combobox({ ...props }: React.ComponentProps<typeof BaseCombobox.Root>) {
  return <BaseCombobox.Root data-slot='combobox' {...props} />
}

export const comboboxTriggerStyles = cva(
  [
    'bg-input placeholder:text-dimmed w-full rounded px-2.5 transition-all',
    'focus:ring-primary focus:ring-2 focus:outline-0',
    'has-focus:ring-primary has-focus:ring-2',
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
      },
      pill: {
        true: 'rounded-full'
      }
    },
    defaultVariants: {
      variant: 'default',
      pill: false
    }
  }
)

export function ComboboxTrigger({
  className,
  children,
  variant,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Trigger> & VariantProps<typeof comboboxTriggerStyles>) {
  return (
    <BaseCombobox.Trigger
      data-slot='combobox-trigger'
      {...props}
      role='combobox'
      className={clx('h-9.5', comboboxTriggerStyles({ variant, className }))}
    >
      {children}
      <BaseCombobox.Icon className='text-muted ml-auto'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='w-4'
        >
          <path d='m6 9 6 6 6-6' />
        </svg>
      </BaseCombobox.Icon>
    </BaseCombobox.Trigger>
  )
}

export type ComboboxItem = {
  value: string
  label: string
  icon?: React.ReactNode
}

export function ComboboxValue({
  placeholder = 'Select an option',
  ...props
}: React.ComponentProps<typeof BaseCombobox.Value> & {
  placeholder?: string
}) {
  return (
    <BaseCombobox.Value data-slot='combobox-value' {...props}>
      {(value: string | ComboboxItem) => (
        <ComboboxRenderValue value={value} placeholder={placeholder} />
      )}
    </BaseCombobox.Value>
  )
}

function ComboboxRenderValue({
  value,
  placeholder
}: {
  value: string | ComboboxItem
  placeholder: string
}) {
  if (!value) {
    return <span className='text-dimmed'>{placeholder}</span>
  }

  if (typeof value === 'object') {
    return (
      <div className='[&_svg:not([class*=text-])]:text-popover-foreground flex items-center gap-2.5 [&_svg:not([class*=size-])]:size-4'>
        {value.icon}
        <span className='text-popover-foreground'>{value.label}</span>
      </div>
    )
  }

  return <span className='text-popover-foreground'>{value}</span>
}

export function ComboboxInput({
  className,
  placeholder,
  variant,
  pill,
  ref
}: VariantProps<typeof comboboxTriggerStyles> & {
  placeholder: string
  className?: string
  ref?: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <BaseCombobox.Chips
      data-slot='combobox-chips'
      role='combobox'
      className={clx(
        comboboxTriggerStyles({ variant, pill, className }),
        'flex min-h-9.5 flex-wrap items-center gap-1.5 py-1'
      )}
      ref={ref}
    >
      <BaseCombobox.Value>
        {(value: ComboboxItem[]) => (
          <React.Fragment>
            {value.map((item) => (
              <BaseCombobox.Chip
                key={item.value}
                render={<Chip />}
                className={clx(
                  'focus-visible:bg-primary focus-visible:text-primary-foreground focus-visible:outline-none',
                  'focus-visible:ring-primary'
                )}
              >
                {item.label}
                <BaseCombobox.ChipRemove>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='size-3.5 opacity-60 transition-colors hover:opacity-100'
                  >
                    <path d='M18 6 6 18' />
                    <path d='m6 6 12 12' />
                  </svg>
                </BaseCombobox.ChipRemove>
              </BaseCombobox.Chip>
            ))}
            <BaseCombobox.Input
              placeholder={value.length === 0 ? placeholder : ''}
              className={clx('min-w-4 flex-1 outline-none')}
            />
          </React.Fragment>
        )}
      </BaseCombobox.Value>
    </BaseCombobox.Chips>
  )
}

export function ComboboxPopup({
  className,
  children,
  align,
  alignOffset,
  side,
  sideOffset,
  anchor,
  sticky,
  positionMethod,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Popup> & {
  align?: BaseCombobox.Positioner.Props['align']
  alignOffset?: BaseCombobox.Positioner.Props['alignOffset']
  side?: BaseCombobox.Positioner.Props['side']
  sideOffset?: BaseCombobox.Positioner.Props['sideOffset']
  anchor?: BaseCombobox.Positioner.Props['anchor']
  sticky?: BaseCombobox.Positioner.Props['sticky']
  positionMethod?: BaseCombobox.Positioner.Props['positionMethod']
}) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Backdrop />
      <BaseCombobox.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset || 6}
        anchor={anchor}
        sticky={sticky}
        positionMethod={positionMethod}
      >
        <BaseCombobox.Popup
          data-slot='combobox-popup'
          {...props}
          className={clx(
            'bg-popover ring-popover-border shadow-popover rounded ring',
            'max-h-[min(var(---available-height),23rem)] w-(--anchor-width)',
            'max-w-(--available-width) origin-(--transform-origin)',
            'transition-[transform,scale,opacity] outline-none',
            'data-[ending-style]:scale-90 data-[ending-style]:opacity-0',
            'data-[starting-style]:scale-90 data-[starting-style]:opacity-0',
            'has-[>[data-slot=input-group]]:[&_[data-slot=combobox-search]]:border-none',
            '*:data-[slot=input-group]:border-popover-separator *:data-[slot=input-group]:border-b',
            className
          )}
        >
          {children}
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  )
}

export function ComboboxSearch({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Input>) {
  return (
    <div className='p-1'>
      <BaseCombobox.Input
        data-slot='combobox-search'
        placeholder='Search item'
        {...props}
        className={clx(
          'border-input-border h-10 w-full border-b px-2.5 outline-none',
          'disabled:cursor-not-allowed disabled:opacity-70',
          className
        )}
      />
    </div>
  )
}

export function ComboboxEmpty({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Empty>) {
  return (
    <BaseCombobox.Empty
      data-slot='combobox-empty'
      {...props}
      className={clx('text-dimmed px-3 py-2.5 text-center empty:p-0', className)}
    />
  )
}

export function ComboboxList({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.List>) {
  return (
    <BaseCombobox.List
      data-slot='combobox-list'
      {...props}
      className={clx(
        'max-h-[min(23rem,var(--available-height))] space-y-0.5 overflow-y-auto p-1 outline-none empty:p-0 dark:scheme-dark',
        className
      )}
    />
  )
}

export function ComboboxItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Item>) {
  return (
    <BaseCombobox.Item
      data-slot='combobox-item'
      {...props}
      className={clx(
        'text-popover-foreground flex cursor-pointer items-center gap-3.5 rounded px-3 py-2.5 select-none',
        'group-data-[side=none]:min-w-[calc(var(--anchor-width))]',
        'data-[highlighted]:not-[[data-disabled]]:bg-popover-accent data-[selected]:not-[[data-disabled]]:bg-popover-accent',
        'focus-visible:outline-none',
        'data-disabled:cursor-not-allowed data-disabled:opacity-70',
        className
      )}
    >
      {children}
      <BaseCombobox.ItemIndicator className='ml-auto'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='3'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='text-primary size-4'
        >
          <path d='M20 6 9 17l-5-5' />
        </svg>
      </BaseCombobox.ItemIndicator>
    </BaseCombobox.Item>
  )
}

export function ComboboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Group>) {
  return (
    <BaseCombobox.Group
      data-slot='combobox-group'
      {...props}
      className={clx('space-y-0.5', className)}
    />
  )
}

export function ComboboxGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.GroupLabel>) {
  return (
    <BaseCombobox.GroupLabel
      data-slot='combobox-group-label'
      {...props}
      className={clx('text-dimmed px-2.5 py-1.5 text-sm font-medium', className)}
    />
  )
}

export function ComboboxSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Separator>) {
  return (
    <BaseCombobox.Separator
      data-slot='combobox-separator'
      {...props}
      className={clx('bg-popover-separator my-1 h-px', className)}
    />
  )
}

export function ComboboxCollection({
  ...props
}: React.ComponentProps<typeof BaseCombobox.Collection>) {
  return <BaseCombobox.Collection {...props} />
}
