/**
 * A filterable select component for selecting items from a list.
 *
 * @see: https://base-ui.com/react/components/combobox
 *
 * Anatomy:
 * <Combobox.Root>
 *   <Combobox.Input />
 *   <Combobox.Trigger />
 *   <Combobox.Icon />
 *   <Combobox.Clear />
 *   <Combobox.Value />
 *   <Combobox.Chips>
 *     <Combobox.Chip>
 *       <Combobox.ChipRemove />
 *     </Combobox.Chip>
 *   </Combobox.Chips>
 *   <Combobox.Portal>
 *     <Combobox.Backdrop />
 *     <Combobox.Positioner>
 *       <Combobox.Popup>
 *         <Combobox.Arrow />
 *         <Combobox.Status />
 *         <Combobox.Empty />
 *         <Combobox.List>
 *           <Combobox.Row>
 *             <Combobox.Item>
 *               <Combobox.ItemIndicator />
 *             </Combobox.Item>
 *           </Combobox.Row>
 *           <Combobox.Separator />
 *           <Combobox.Group>
 *             <Combobox.GroupLabel />
 *           </Combobox.Group>
 *           <Combobox.Collection />
 *         </Combobox.List>
 *       </Combobox.Popup>
 *     </Combobox.Positioner>
 *   </Combobox.Portal>
 * </Combobox.Root>
 */

import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import * as React from 'react'
import { clx, tv, type VariantProps } from '#/utils/variant'
import { Chip } from './chip'

const comboboxVariants = tv({
  base: '',
  slots: {
    trigger: [
      'bg-input placeholder:text-dimmed w-full rounded px-2 transition-all',
      'focus:ring-primary focus:ring-2 focus:outline-0',
      'has-focus:ring-primary has-focus:ring-2',
      'flex cursor-pointer items-center gap-2',
      'data-disabled:cursor-not-allowed data-disabled:opacity-70'
    ],
    triggerIcon: 'text-muted ml-auto',
    chips: [
      'flex min-h-9 flex-wrap items-center gap-1.5 py-1',
      'placeholder:text-dimmed w-full rounded px-2 transition-all',
      'focus:ring-primary focus:ring-2 focus:outline-0',
      'has-focus:ring-primary has-focus:ring-2',
      'data-disabled:cursor-not-allowed data-disabled:opacity-70'
    ],
    chip: [
      'focus-visible:bg-primary focus-visible:text-primary-foreground focus-visible:outline-none',
      'focus-visible:ring-primary'
    ],
    chipRemove: 'size-3 opacity-60 transition-colors hover:opacity-100',
    chipsInput: 'min-w-4 flex-1 outline-none',
    popup: [
      'bg-popover ring-popover-border shadow-popover rounded ring',
      'max-h-[min(var(---available-height),23rem)] w-(--anchor-width)',
      'max-w-(--available-width) origin-(--transform-origin)',
      'transition-[transform,scale,opacity] outline-none',
      'data-ending-style:scale-90 data-ending-style:opacity-0',
      'data-starting-style:scale-90 data-starting-style:opacity-0',
      'has-[>[data-slot=input-group]]:**:data-[slot=combobox-search]:border-none',
      '*:data-[slot=input-group]:border-popover-separator *:data-[slot=input-group]:border-b'
    ],
    searchWrapper: 'p-1',
    searchInput: [
      'border-input-border h-9 w-full border-b px-2 outline-none',
      'disabled:cursor-not-allowed disabled:opacity-70'
    ],
    empty: 'text-dimmed px-2.5 pt-2 pb-2.5 text-center empty:p-0',
    list: [
      'max-h-[min(23rem,var(--available-height))] space-y-0.5 overflow-y-auto p-1 outline-none empty:p-0 dark:scheme-dark'
    ],
    item: [
      'text-popover-foreground flex cursor-pointer items-center gap-2.5 rounded px-2.5 py-2 select-none',
      'group-data-[side=none]:min-w-[calc(var(--anchor-width))]',
      'data-highlighted:not-data-disabled:bg-popover-accent data-selected:not-data-disabled:bg-popover-accent',
      'focus-visible:outline-none',
      'data-disabled:cursor-not-allowed data-disabled:opacity-70'
    ],
    itemIndicator: 'text-primary ml-auto size-4',
    group: 'space-y-0.5',
    groupLabel: 'text-dimmed px-2 py-1 text-base font-medium',
    separator: 'bg-popover-separator my-1 h-px',
    renderValueWrapper:
      '[&_svg:not([class*=text-])]:text-popover-foreground flex items-center gap-2 [&_svg:not([class*=size-])]:size-3.5',
    renderValueLabel: 'text-popover-foreground',
    renderValuePlaceholder: 'text-dimmed'
  },
  variants: {
    variant: {
      default: {
        trigger:
          'bg-input ring-input-border hover:not-data-disabled:not-focus:ring-input-accent-border shadow-input ring',
        chips:
          'bg-input ring-input-border hover:not-data-disabled:not-focus:ring-input-accent-border shadow-input ring'
      },
      subtle: {
        trigger:
          'bg-input/60 ring-input-border hover:not-data-disabled:not-focus:ring-input-accent-border shadow-input ring',
        chips:
          'bg-input/60 ring-input-border hover:not-data-disabled:not-focus:ring-input-accent-border shadow-input ring'
      },
      plain: {
        trigger: 'hover:not-data-disabled:bg-accent bg-transparent',
        chips: 'hover:not-data-disabled:bg-accent bg-transparent'
      }
    },
    pill: {
      true: {
        trigger: 'rounded-full',
        chips: 'rounded-full'
      },
      false: {}
    }
  },
  defaultVariants: {
    variant: 'default',
    pill: false
  }
})

export type ComboboxRootProps = React.ComponentProps<typeof BaseCombobox.Root>
export type ComboboxTriggerProps = React.ComponentProps<typeof BaseCombobox.Trigger> &
  VariantProps<typeof comboboxVariants>
export type ComboboxInputProps = VariantProps<typeof comboboxVariants> & {
  placeholder: string
  className?: string
  ref?: React.RefObject<HTMLDivElement | null>
}
export type ComboboxPopupProps = React.ComponentProps<typeof BaseCombobox.Popup> & {
  align?: BaseCombobox.Positioner.Props['align']
  alignOffset?: BaseCombobox.Positioner.Props['alignOffset']
  side?: BaseCombobox.Positioner.Props['side']
  sideOffset?: BaseCombobox.Positioner.Props['sideOffset']
  anchor?: BaseCombobox.Positioner.Props['anchor']
  sticky?: BaseCombobox.Positioner.Props['sticky']
  positionMethod?: BaseCombobox.Positioner.Props['positionMethod']
}

export function Combobox({ ...props }: ComboboxRootProps) {
  return <BaseCombobox.Root data-slot='combobox' {...props} />
}

export function ComboboxTrigger({
  className,
  children,
  variant,
  pill,
  ...props
}: ComboboxTriggerProps) {
  const styles = comboboxVariants({ variant, pill })
  return (
    <BaseCombobox.Trigger
      data-slot='combobox-trigger'
      role='combobox'
      className={clx('h-9', styles.trigger(), className)}
      {...props}
    >
      {children}
      <BaseCombobox.Icon className={styles.triggerIcon()}>
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
  const styles = comboboxVariants()
  return (
    <BaseCombobox.Value data-slot='combobox-value' {...props}>
      {(value: string | ComboboxItem) => (
        <ComboboxRenderValue value={value} placeholder={placeholder} styles={styles} />
      )}
    </BaseCombobox.Value>
  )
}

function ComboboxRenderValue({
  value,
  placeholder,
  styles
}: {
  value: string | ComboboxItem
  placeholder: string
  styles: ReturnType<typeof comboboxVariants>
}) {
  if (!value) {
    return <span className={styles.renderValuePlaceholder()}>{placeholder}</span>
  }

  if (typeof value === 'object') {
    return (
      <div className={styles.renderValueWrapper()}>
        {value.icon}
        <span className={styles.renderValueLabel()}>{value.label}</span>
      </div>
    )
  }

  return <span className={styles.renderValueLabel()}>{value}</span>
}

export function ComboboxInput({ className, placeholder, variant, pill, ref }: ComboboxInputProps) {
  const styles = comboboxVariants({ variant, pill })
  return (
    <BaseCombobox.Chips
      data-slot='combobox-chips'
      role='combobox'
      className={clx(styles.chips(), className)}
      ref={ref}
    >
      <BaseCombobox.Value>
        {(value: ComboboxItem[]) => (
          <React.Fragment>
            {value.map((item) => (
              <BaseCombobox.Chip key={item.value} render={<Chip />} className={styles.chip()}>
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
                    className={styles.chipRemove()}
                  >
                    <path d='M18 6 6 18' />
                    <path d='m6 6 12 12' />
                  </svg>
                </BaseCombobox.ChipRemove>
              </BaseCombobox.Chip>
            ))}
            <BaseCombobox.Input
              placeholder={value.length === 0 ? placeholder : ''}
              className={styles.chipsInput()}
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
}: ComboboxPopupProps) {
  const styles = comboboxVariants()
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
          className={clx(styles.popup(), className)}
          {...props}
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
  const styles = comboboxVariants()
  return (
    <div className={styles.searchWrapper()}>
      <BaseCombobox.Input
        data-slot='combobox-search'
        placeholder='Search item'
        className={clx(styles.searchInput(), className)}
        {...props}
      />
    </div>
  )
}

export function ComboboxEmpty({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Empty>) {
  const styles = comboboxVariants()
  return (
    <BaseCombobox.Empty
      data-slot='combobox-empty'
      className={clx(styles.empty(), className)}
      {...props}
    />
  )
}

export function ComboboxList({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.List>) {
  const styles = comboboxVariants()
  return (
    <BaseCombobox.List
      data-slot='combobox-list'
      className={clx(styles.list(), className)}
      {...props}
    />
  )
}

export function ComboboxItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Item>) {
  const styles = comboboxVariants()
  return (
    <BaseCombobox.Item
      data-slot='combobox-item'
      className={clx(styles.item(), className)}
      {...props}
    >
      {children}
      <BaseCombobox.ItemIndicator className={styles.itemIndicator()}>
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
  const styles = comboboxVariants()
  return (
    <BaseCombobox.Group
      data-slot='combobox-group'
      className={clx(styles.group(), className)}
      {...props}
    />
  )
}

export function ComboboxGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.GroupLabel>) {
  const styles = comboboxVariants()
  return (
    <BaseCombobox.GroupLabel
      data-slot='combobox-group-label'
      className={clx(styles.groupLabel(), className)}
      {...props}
    />
  )
}

export function ComboboxSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Separator>) {
  const styles = comboboxVariants()
  return (
    <BaseCombobox.Separator
      data-slot='combobox-separator'
      className={clx(styles.separator(), className)}
      {...props}
    />
  )
}

export function ComboboxCollection({
  ...props
}: React.ComponentProps<typeof BaseCombobox.Collection>) {
  return <BaseCombobox.Collection {...props} />
}
