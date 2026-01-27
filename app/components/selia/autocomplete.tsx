/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { clx } from '#/utils'

export function Autocomplete({ ...props }: React.ComponentProps<typeof BaseAutocomplete.Root>) {
  return <BaseAutocomplete.Root data-slot='autocomplete' {...props} />
}

export const autocompleteInputStyles = cva(
  [
    'text-foreground placeholder:text-dimmed h-9.5 w-full px-2.5 transition-all',
    'disabled:cursor-not-allowed disabled:opacity-70'
  ],
  {
    variants: {
      variant: {
        default: 'bg-input',
        subtle: 'bg-input/60',
        plain: 'bg-transparent focus:outline-none'
      }
    },
    compoundVariants: [
      {
        variant: ['default', 'subtle'],
        className:
          'ring-input-border hover:not-[[data-disabled]]:not-[:focus]:ring-input-accent-border focus:ring-primary shadow-input rounded ring focus:ring-2 focus:outline-0'
      }
    ],
    defaultVariants: {
      variant: 'default'
    }
  }
)

export function AutocompleteInput({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Input> &
  VariantProps<typeof autocompleteInputStyles>) {
  return (
    <BaseAutocomplete.Input
      data-slot='autocomplete-input'
      {...props}
      className={clx(autocompleteInputStyles({ variant, className }))}
    />
  )
}

export function AutocompletePopup({
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
}: React.ComponentProps<typeof BaseAutocomplete.Popup> & {
  align?: BaseAutocomplete.Positioner.Props['align']
  alignOffset?: BaseAutocomplete.Positioner.Props['alignOffset']
  side?: BaseAutocomplete.Positioner.Props['side']
  sideOffset?: BaseAutocomplete.Positioner.Props['sideOffset']
  anchor?: BaseAutocomplete.Positioner.Props['anchor']
  sticky?: BaseAutocomplete.Positioner.Props['sticky']
  positionMethod?: BaseAutocomplete.Positioner.Props['positionMethod']
}) {
  return (
    <BaseAutocomplete.Portal>
      <BaseAutocomplete.Backdrop />
      <BaseAutocomplete.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset || 8}
        anchor={anchor}
        sticky={sticky}
        positionMethod={positionMethod}
      >
        <BaseAutocomplete.Popup
          data-slot='autocomplete-popup'
          {...props}
          className={clx(
            'bg-popover ring-popover-border shadow-popover rounded ring',
            'transition-[transform,scale,opacity] outline-none',
            'max-h-[min(var(---available-height),23rem)] w-(--anchor-width)',
            'data-[ending-style]:scale-90 data-[ending-style]:opacity-0',
            'data-[starting-style]:scale-90 data-[starting-style]:opacity-0',
            className
          )}
        >
          {children}
        </BaseAutocomplete.Popup>
      </BaseAutocomplete.Positioner>
    </BaseAutocomplete.Portal>
  )
}

export function AutocompleteIcon({ ...props }: React.ComponentProps<typeof BaseAutocomplete.Icon>) {
  return <BaseAutocomplete.Icon data-slot='autocomplete-icon' {...props} />
}

export function AutocompleteClear({
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Clear>) {
  return <BaseAutocomplete.Clear data-slot='autocomplete-clear' {...props} />
}

export function AutocompleteValue({
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Value>) {
  return <BaseAutocomplete.Value data-slot='autocomplete-value' {...props} />
}

export function AutocompleteTrigger({
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Trigger>) {
  return <BaseAutocomplete.Trigger data-slot='autocomplete-trigger' {...props} />
}

export function AutocompleteEmpty({
  className,
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Empty>) {
  return (
    <BaseAutocomplete.Empty
      data-slot='autocomplete-empty'
      {...props}
      className={clx(
        'text-muted flex items-center justify-center px-3 py-2.5 text-center',
        'empty:hidden empty:h-0 empty:p-0',
        className
      )}
    />
  )
}

export function AutocompleteList({
  className,
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.List>) {
  return (
    <BaseAutocomplete.List
      data-slot='autocomplete-list'
      {...props}
      className={clx(
        'space-y-0.5 overflow-auto outline-none empty:hidden empty:h-0 empty:p-0 dark:scheme-dark',
        'max-h-[min(23rem,var(--available-height))] overflow-y-auto p-1 dark:scheme-dark',
        className
      )}
    />
  )
}

export function AutocompleteGroup({
  className,
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Group>) {
  return (
    <BaseAutocomplete.Group
      data-slot='autocomplete-group'
      {...props}
      className={clx('pb-2 last:pb-0', className)}
    />
  )
}

export function AutocompleteGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.GroupLabel>) {
  return (
    <BaseAutocomplete.GroupLabel
      data-slot='autocomplete-group-label'
      {...props}
      className={clx('text-dimmed px-3 py-1.5 text-sm font-medium', className)}
    />
  )
}

export function AutocompleteCollection({
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Collection>) {
  return <BaseAutocomplete.Collection data-slot='autocomplete-collection' {...props} />
}

export function AutocompleteRow({
  className,
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Row>) {
  return <div data-slot='autocomplete-row' {...props} className={clx(className)} />
}

export function AutocompleteItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Item>) {
  return (
    <BaseAutocomplete.Item
      data-slot='autocomplete-item'
      {...props}
      className={clx(
        'text-foreground flex cursor-pointer items-center gap-3.5 rounded px-3 py-2.5',
        'data-[highlighted]:not-[[data-disabled]]:bg-popover-accent data-[selected]:not-[[data-disabled]]:bg-popover-accent',
        'focus-visible:outline-none',
        '[&_svg:not([class*=text-])]:text-foreground [&_svg:not([class*=size-])]:size-4',
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className
      )}
    />
  )
}

export function AutocompleteSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Separator>) {
  return (
    <BaseAutocomplete.Separator
      data-slot='autocomplete-separator'
      {...props}
      className={clx('bg-popover-separator my-1 h-px', className)}
    />
  )
}
