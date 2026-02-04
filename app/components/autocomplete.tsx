/**
 * An input that suggests options as you type.
 *
 * @see: https://base-ui.com/react/components/autocomplete
 *
 * Anatomy:
 * <Autocomplete.Root>
 *   <Autocomplete.Input />
 *   <Autocomplete.Trigger />
 *   <Autocomplete.Icon />
 *   <Autocomplete.Clear />
 *   <Autocomplete.Value />
 *   <Autocomplete.Portal>
 *     <Autocomplete.Backdrop />
 *     <Autocomplete.Positioner>
 *       <Autocomplete.Popup>
 *         <Autocomplete.Arrow />
 *         <Autocomplete.Status />
 *         <Autocomplete.Empty />
 *         <Autocomplete.List>
 *           <Autocomplete.Row>
 *             <Autocomplete.Item />
 *           </Autocomplete.Row>
 *           <Autocomplete.Separator />
 *           <Autocomplete.Group>
 *             <Autocomplete.GroupLabel />
 *           </Autocomplete.Group>
 *           <Autocomplete.Collection />
 *         </Autocomplete.List>
 *       </Autocomplete.Popup>
 *     </Autocomplete.Positioner>
 *   </Autocomplete.Portal>
 * </Autocomplete.Root>
 */

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete'
import * as React from 'react'
import { clx, tv, type VariantProps } from '#/utils/variant'

const autocompleteVariants = tv({
  base: 'text-foreground placeholder:text-dimmed h-9 w-full px-3 transition-all disabled:cursor-not-allowed disabled:opacity-70',
  slots: {
    positioner: [],
    popup: [
      'bg-popover ring-popover-border shadow-popover rounded ring',
      'transition-[transform,scale,opacity] outline-none',
      'max-h-[min(var(---available-height),23rem)] w-(--anchor-width)',
      'data-ending-style:scale-90 data-ending-style:opacity-0',
      'data-starting-style:scale-90 data-starting-style:opacity-0'
    ],
    empty: [
      'text-muted flex items-center justify-center px-2.5 py-2 text-center',
      'empty:hidden empty:h-0 empty:p-0'
    ],
    list: [
      'space-y-0 overflow-auto outline-none empty:hidden empty:h-0 empty:p-0 dark:scheme-dark',
      'max-h-[min(23rem,var(--available-height))] overflow-y-auto p-1 dark:scheme-dark'
    ],
    group: 'pb-1.5 last:pb-0',
    groupLabel: 'text-dimmed px-2.5 py-1 text-base',
    row: '',
    item: [
      'text-foreground flex cursor-pointer items-center gap-2.5 rounded px-2.5 py-2',
      'data-highlighted:not-data-disabled:bg-popover-accent data-selected:not-data-disabled:bg-popover-accent',
      'focus-visible:outline-none',
      '[&_svg:not([class*=text-])]:text-foreground [&_svg:not([class*=size-])]:size-3.5',
      'data-disabled:cursor-not-allowed data-disabled:opacity-50'
    ],
    separator: 'bg-popover-separator my-1 h-px'
  },
  variants: {
    variant: {
      default: {
        base: 'bg-input ring-input-border hover:not-data-disabled:not-focus:ring-input-accent-border focus:ring-primary shadow-input rounded ring focus:ring-2 focus:outline-0'
      },
      subtle: {
        base: 'bg-input/60 ring-input-border hover:not-data-disabled:not-focus:ring-input-accent-border focus:ring-primary shadow-input rounded ring focus:ring-2 focus:outline-0'
      },
      plain: 'bg-transparent focus:outline-none'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export type AutocompleteRootProps = React.ComponentProps<typeof BaseAutocomplete.Root>
export type AutocompleteInputProps = React.ComponentProps<typeof BaseAutocomplete.Input> &
  VariantProps<typeof autocompleteVariants>
export type AutocompletePopupProps = React.ComponentProps<typeof BaseAutocomplete.Popup>
export type AutocompleteIconProps = React.ComponentProps<typeof BaseAutocomplete.Icon>
export type AutocompleteClearProps = React.ComponentProps<typeof BaseAutocomplete.Clear>
export type AutocompleteValueProps = React.ComponentProps<typeof BaseAutocomplete.Value>
export type AutocompleteTriggerProps = React.ComponentProps<typeof BaseAutocomplete.Trigger>
export type AutocompleteEmptyProps = React.ComponentProps<typeof BaseAutocomplete.Empty>
export type AutocompleteListProps = React.ComponentProps<typeof BaseAutocomplete.List>
export type AutocompleteGroupProps = React.ComponentProps<typeof BaseAutocomplete.Group>
export type AutocompleteGroupLabelProps = React.ComponentProps<typeof BaseAutocomplete.GroupLabel>
export type AutocompleteCollectionProps = React.ComponentProps<typeof BaseAutocomplete.Collection>
export type AutocompleteRowProps = React.ComponentProps<'div'>
export type AutocompleteItemProps = React.ComponentProps<typeof BaseAutocomplete.Item>
export type AutocompleteSeparatorProps = React.ComponentProps<typeof BaseAutocomplete.Separator>

export function Autocomplete({ ...props }: AutocompleteRootProps) {
  return <BaseAutocomplete.Root data-slot='autocomplete' {...props} />
}

export function AutocompleteInput({ className, variant, ...props }: AutocompleteInputProps) {
  const styles = autocompleteVariants({ variant })
  return (
    <BaseAutocomplete.Input
      data-slot='autocomplete-input'
      className={clx(styles.base(), className)}
      {...props}
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
}: AutocompletePopupProps & {
  align?: BaseAutocomplete.Positioner.Props['align']
  alignOffset?: BaseAutocomplete.Positioner.Props['alignOffset']
  side?: BaseAutocomplete.Positioner.Props['side']
  sideOffset?: BaseAutocomplete.Positioner.Props['sideOffset']
  anchor?: BaseAutocomplete.Positioner.Props['anchor']
  sticky?: BaseAutocomplete.Positioner.Props['sticky']
  positionMethod?: BaseAutocomplete.Positioner.Props['positionMethod']
}) {
  const styles = autocompleteVariants()
  return (
    <BaseAutocomplete.Portal>
      <BaseAutocomplete.Backdrop />
      <BaseAutocomplete.Positioner
        data-slot='autocomplete-positioner'
        className={clx(styles.positioner())}
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
          className={clx(styles.popup(), className)}
          {...props}
        >
          {children}
        </BaseAutocomplete.Popup>
      </BaseAutocomplete.Positioner>
    </BaseAutocomplete.Portal>
  )
}

export function AutocompleteIcon({ ...props }: AutocompleteIconProps) {
  return <BaseAutocomplete.Icon data-slot='autocomplete-icon' {...props} />
}

export function AutocompleteClear({ ...props }: AutocompleteClearProps) {
  return <BaseAutocomplete.Clear data-slot='autocomplete-clear' {...props} />
}

export function AutocompleteValue({ ...props }: AutocompleteValueProps) {
  return <BaseAutocomplete.Value data-slot='autocomplete-value' {...props} />
}

export function AutocompleteTrigger({ ...props }: AutocompleteTriggerProps) {
  return <BaseAutocomplete.Trigger data-slot='autocomplete-trigger' {...props} />
}

export function AutocompleteEmpty({ className, ...props }: AutocompleteEmptyProps) {
  const styles = autocompleteVariants()
  return (
    <BaseAutocomplete.Empty
      data-slot='autocomplete-empty'
      className={clx(styles.empty(), className)}
      {...props}
    />
  )
}

export function AutocompleteList({ className, ...props }: AutocompleteListProps) {
  const styles = autocompleteVariants()
  return (
    <BaseAutocomplete.List
      data-slot='autocomplete-list'
      className={clx(styles.list(), className)}
      {...props}
    />
  )
}

export function AutocompleteGroup({ className, ...props }: AutocompleteGroupProps) {
  const styles = autocompleteVariants()
  return (
    <BaseAutocomplete.Group
      data-slot='autocomplete-group'
      className={clx(styles.group(), className)}
      {...props}
    />
  )
}

export function AutocompleteGroupLabel({ className, ...props }: AutocompleteGroupLabelProps) {
  const styles = autocompleteVariants()
  return (
    <BaseAutocomplete.GroupLabel
      data-slot='autocomplete-group-label'
      className={clx(styles.groupLabel(), className)}
      {...props}
    />
  )
}

export function AutocompleteCollection({ ...props }: AutocompleteCollectionProps) {
  return <BaseAutocomplete.Collection data-slot='autocomplete-collection' {...props} />
}

export function AutocompleteRow({ className, ...props }: AutocompleteRowProps) {
  const styles = autocompleteVariants()
  return <div data-slot='autocomplete-row' className={styles.row({ className })} {...props} />
}

export function AutocompleteItem({ className, ...props }: AutocompleteItemProps) {
  const styles = autocompleteVariants()
  return (
    <BaseAutocomplete.Item
      data-slot='autocomplete-item'
      className={clx(styles.item(), className)}
      {...props}
    />
  )
}

export function AutocompleteSeparator({ className, ...props }: AutocompleteSeparatorProps) {
  const styles = autocompleteVariants()
  return (
    <BaseAutocomplete.Separator
      data-slot='autocomplete-separator'
      className={clx(styles.separator(), className)}
      {...props}
    />
  )
}
