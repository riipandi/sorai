/**
 * A calendar component for date selection with range support.
 *
 * @see: https://daypicker.dev/
 *
 * Anatomy:
 * <Calendar />
 */

import * as Lucide from 'lucide-react'
import * as React from 'react'
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker'
import type { Formatters } from 'react-day-picker'
import { clx, tv } from '#/utils/variant'

const calendar = tv({
  base: 'p-3',
  slots: {
    root: 'w-fit overflow-hidden rounded-lg p-2',
    months: 'relative flex flex-col gap-4 pt-0.5 md:flex-row',
    month: 'flex w-full flex-col gap-4',
    monthCaption: 'relative z-20 mx-10 mb-1 flex h-8 items-center justify-center',
    captionLabel: '[&>svg]:text-muted text-base font-medium select-none [&>svg]:size-4',
    dropdowns:
      'text-foreground flex h-8 w-full items-center justify-center gap-2 text-sm font-medium',
    dropdownRoot: 'relative rounded-md',
    dropdown: 'absolute inset-0 opacity-0',
    nav: 'absolute inset-x-0 top-0.5 z-0 flex w-full items-center justify-between px-1',
    navButton: [
      'text-dimmed hover:text-foreground relative inline-flex size-8 items-center justify-center rounded-md text-base font-normal whitespace-nowrap',
      'transition-200 outline-none before:absolute before:inset-0 before:z-[-1] before:rounded-[inherit]',
      'before:bg-accent before:opacity-0 before:transition-[transform,background-color] before:duration-200 before:ease-in',
      'hover:before:opacity-100 focus-visible:before:opacity-100 active:scale-95 disabled:pointer-events-none disabled:opacity-50'
    ],
    table: 'w-full border-collapse',
    weekdays: 'flex p-0 px-1',
    weekday: [
      'text-muted/70 flex size-8 flex-1 items-center justify-center rounded-md p-0 text-sm font-normal'
    ],
    weeks: 'bg-background block rounded-b-md p-1 pt-0',
    week: 'mt-2 flex w-full p-0',
    weekNumberHeader: 'w-8 select-none',
    weekNumber: 'text-dimmed size-8 p-0 text-sm font-medium',
    day: 'group relative w-full flex-1 rounded-md p-0',
    dayButton: [
      'text-foreground transition-200 focus-visible:ring-ring/50 relative flex aspect-square w-full min-w-8 cursor-pointer items-center justify-center rounded-md p-0 text-base font-normal whitespace-nowrap outline-none focus-visible:z-10 focus-visible:ring-[3px]',
      'group-[[data-selected]:not(.range-middle)]:[transition-property:color,background-color,border-radius,box-shadow] group-[[data-selected]:not(.range-middle)]:duration-150',
      'group-data-disabled:text-foreground/30 group-data-outside:text-foreground/30 group-data-disabled:pointer-events-none group-data-disabled:line-through',
      'hover:not-in-data-selected:bg-accent hover:not-in-data-selected:text-foreground',
      'group-data-selected:bg-primary group-data-selected:text-primary-foreground group-data-selected:group-data-outside:text-primary-foreground',
      'data-[range-middle=true]:bg-dimmed/25 data-[range-middle=true]:text-foreground',
      'data-[range-start=true]:rounded-l-md data-[range-start=true]:rounded-r-none',
      'data-[range-end=true]:rounded-l-none data-[range-end=true]:rounded-r-md',
      'data-[range-middle=true]:rounded-none'
    ],
    today: [
      '*:after:pointer-events-none *:after:absolute *:after:start-1/2 *:after:bottom-0.75',
      '*:after:z-10 *:after:size-1 *:after:-translate-x-1/2 rtl:*:after:translate-x-1/2',
      '*:after:bg-primary *:after:rounded-full *:after:transition-colors',
      '[&.selected:not(.range-middle)>*]:after:bg-background [&.disabled>*]:after:bg-dimmed/30'
    ],
    outside: 'text-dimmed/50',
    hidden: 'invisible',
    disabled: 'text-dimmed opacity-50'
  },
  variants: {
    variant: {
      default: {
        root: 'border-border border shadow-xs'
      },
      plain: {
        root: 'border-none shadow-none'
      }
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  variant?: 'default' | 'plain'
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  variant = 'default',
  formatters,
  components,
  ...props
}: CalendarProps) {
  const clasess = getDefaultClassNames()
  const styles = calendar({ variant })

  const valueFormatters: Partial<Formatters> = {
    formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'short' }),
    ...formatters
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={clx(styles.root(), className)}
      formatters={valueFormatters}
      captionLayout={captionLayout}
      classNames={
        {
          ...classNames,
          root: styles.root({ class: clasess.root }),
          months: styles.months({ class: clasess.months }),
          month: styles.month({ class: clasess.month }),
          month_caption: styles.monthCaption({ class: clasess.month_caption }),
          caption_label: clx(
            styles.captionLabel({ class: clasess.caption_label }),
            captionLayout === 'dropdown'
              ? 'flex w-full items-center justify-center gap-2 rounded-md font-medium'
              : 'text-base'
          ),
          dropdowns: styles.dropdowns({ class: clasess.dropdowns }),
          dropdown_root: styles.dropdownRoot({ class: clasess.dropdown_root }),
          dropdown: styles.dropdown({ class: clasess.dropdown }),
          nav: styles.nav({ class: clasess.nav }),
          button_previous: styles.navButton({ class: clasess.button_previous }),
          button_next: styles.navButton({ class: clasess.button_next }),
          weekdays: styles.weekdays({ class: clasess.weekdays }),
          weekday: styles.weekday({ class: clasess.weekday }),
          weeks: styles.weeks({ class: clasess.weeks }),
          week: styles.week({ class: clasess.week }),
          week_number_header: styles.weekNumberHeader({ class: clasess.week_number_header }),
          week_number: styles.weekNumber({ class: clasess.week_number }),
          day: styles.day({ class: clasess.day }),
          day_button: styles.dayButton({ class: clasess.day_button }),
          today: styles.today({ class: clasess.today }),
          outside: styles.outside({ class: clasess.outside }),
          hidden: styles.hidden({ class: clasess.hidden }),
          disabled: styles.disabled({ class: clasess.disabled })
        } as any
      }
      components={{
        Root: CalendarRoot,
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
        WeekNumber: CalendarWeekNumber,
        ...components
      }}
      {...props}
    />
  )
}

function CalendarRoot(
  props: React.ComponentProps<'div'> & { rootRef?: React.Ref<HTMLDivElement> }
) {
  const { className, rootRef, ...restProps } = props
  return (
    <div
      data-slot='calendar'
      ref={rootRef}
      className={clx('[transition:height_0.3s_ease-in-out]', className)}
      {...restProps}
    />
  )
}

function CalendarChevron(props: { orientation?: 'left' | 'right' | 'up' | 'down' }) {
  const { orientation } = props
  if (orientation === 'left') {
    return <Lucide.ChevronLeft className='size-4 rtl:rotate-180' />
  }
  if (orientation === 'right') {
    return <Lucide.ChevronRight className='size-4 rtl:rotate-180' />
  }
  if (orientation === 'up') {
    return <Lucide.ChevronUp className='size-4 rtl:rotate-180' />
  }
  return <Lucide.ChevronDown className='size-4 rtl:rotate-180' />
}

function CalendarDayButton({
  className,
  modifiers,
  ...buttonProps
}: React.ComponentProps<typeof DayButton>) {
  const clasess = getDefaultClassNames()
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <button
      ref={ref}
      type='button'
      data-selected={modifiers.selected}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-disabled={modifiers.disabled}
      data-outside={modifiers.outside}
      data-today={modifiers.today}
      className={clx(clasess.day_button, className)}
      {...buttonProps}
    />
  )
}

function CalendarWeekNumber({ children, ...props }: React.ComponentProps<'td'>) {
  return (
    <td {...props}>
      <div className='flex size-8 items-center justify-center text-center'>{children}</div>
    </td>
  )
}

export { Calendar }
