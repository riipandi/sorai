import type { Meta, StoryObj } from '@storybook/react-vite'
import { addDays } from 'date-fns'
import * as Lucide from 'lucide-react'
import * as React from 'react'
import type { DateRange } from 'react-day-picker'
import { Button } from '#/components/button'
import { Calendar } from '#/components/calendar'
import { Card } from '#/components/card'
import { Field, FieldLabel } from '#/components/field'
import { Input } from '#/components/input'
import { InputGroup, InputGroupAddon } from '#/components/input-group'
import { Popover, PopoverPopup, PopoverTrigger } from '#/components/popover'

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: { layout: 'centered' },
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'multiple', 'range']
    },
    variant: {
      control: 'select',
      options: ['default', 'plain']
    }
  },
  tags: [], // ['autodocs']
  args: {},
  decorators: [
    (Story) => (
      <div className='flex w-full min-w-md items-center justify-center p-4'>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  args: {
    mode: 'single',
    variant: 'plain',
    showWeekNumber: true
  }
}

export const Single: Story = {
  args: {
    mode: 'single',
    captionLayout: 'dropdown',
    timeZone: 'Asia/Jakarta'
  }
}

export const Multiple: Story = {
  args: { mode: 'multiple' }
}

export const Range: Story = {
  args: { mode: 'range' }
}

export const MonthRange: Story = {
  render: (args) => {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date(2025, 5, 12),
      to: new Date(2025, 6, 15)
    })

    return (
      <div className='space-y-4'>
        <Calendar
          {...args}
          mode='range'
          selected={dateRange}
          onSelect={setDateRange}
          defaultMonth={dateRange?.from}
          numberOfMonths={2}
        />
        {dateRange?.from && (
          <p className='text-dimmed text-center text-sm'>
            {dateRange.to
              ? `Selected: ${dateRange.from.toLocaleDateString()} – ${dateRange.to.toLocaleDateString()}`
              : `Selected from: ${dateRange.from.toLocaleDateString()}`}
          </p>
        )}
      </div>
    )
  }
}

export const SelectedTimezone: Story = {
  render: (args) => {
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined)

    React.useEffect(() => {
      setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    }, [])

    return (
      <div className='space-y-4'>
        <Calendar {...args} mode='single' selected={date} onSelect={setDate} timeZone={timeZone} />
        <div className='text-dimmed text-center text-sm'>
          <p>Time Zone: {timeZone}</p>
          {date && (
            <p>Selected: {date.toLocaleDateString('en-US', { dateStyle: 'full', timeZone })}</p>
          )}
        </div>
      </div>
    )
  }
}

export const DisabledDates: Story = {
  render: (args) => {
    const [date, setDate] = React.useState<Date | undefined>(
      new Date(new Date().getFullYear(), 0, 6)
    )
    const bookedDates = Array.from(
      { length: 15 },
      (_, i) => new Date(new Date().getFullYear(), 0, 12 + i)
    )

    return (
      <div className='space-y-4'>
        <Calendar
          {...args}
          mode='single'
          defaultMonth={date}
          selected={date}
          onSelect={setDate}
          disabled={bookedDates}
          modifiers={{
            booked: bookedDates
          }}
          modifiersClassNames={{
            booked: '[&>button]:line-through opacity-100'
          }}
        />
        <div className='text-dimmed text-center text-sm'>
          <p>Selected: {date?.toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
          <p className='mt-1 text-xs'>Booked dates are disabled</p>
        </div>
      </div>
    )
  }
}

export const WithPresets: Story = {
  render: (args) => {
    const [date, setDate] = React.useState<Date | undefined>(
      new Date(new Date().getFullYear(), 1, 12)
    )
    const [currentMonth, setCurrentMonth] = React.useState<Date>(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    )

    const presets = [
      { label: 'Today', value: 0 },
      { label: 'Tomorrow', value: 1 },
      { label: 'In 3 days', value: 3 },
      { label: 'In a week', value: 7 },
      { label: 'In 2 weeks', value: 14 }
    ]

    return (
      <Card className='w-fit overflow-hidden'>
        <div className='flex'>
          <div className='border-border flex min-w-56 flex-col border-r'>
            <div className='border-border border-b p-3'>
              <p className='text-foreground text-center text-sm'>
                {date ? date.toLocaleDateString('en-US', { dateStyle: 'full' }) : 'Pick a date'}
              </p>
            </div>
            <div className='flex flex-col gap-2 p-3'>
              {presets.map((preset) => (
                <Button
                  key={preset.value}
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    const newDate = addDays(new Date(), preset.value)
                    setDate(newDate)
                    setCurrentMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1))
                  }}
                  block
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
          <div className='rounded-r-xl p-0'>
            <Calendar
              {...args}
              mode='single'
              selected={date}
              onSelect={setDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              captionLayout='dropdown'
              variant='plain'
              fixedWeeks
            />
          </div>
        </div>
      </Card>
    )
  }
}

export const WithTime: Story = {
  render: (args) => {
    const [date, setDate] = React.useState<Date | undefined>(
      new Date(new Date().getFullYear(), new Date().getMonth(), 12)
    )

    return (
      <Card className='mx-auto w-fit overflow-hidden'>
        <div className='p-0'>
          <Calendar
            {...args}
            mode='single'
            selected={date}
            onSelect={setDate}
            className='w-full'
            variant='plain'
          />
        </div>
        <div className='border-border border-t p-4'>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <Field>
              <FieldLabel htmlFor='time-from'>Start Time</FieldLabel>
              <InputGroup>
                <Input
                  id='time-from'
                  type='time'
                  step='1'
                  defaultValue='10:30:00'
                  className='[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                />
                <InputGroupAddon>
                  <Lucide.Clock2 className='text-muted mr-2.5 size-4' />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor='time-to'>End Time</FieldLabel>
              <InputGroup>
                <Input
                  id='time-to'
                  type='time'
                  step='1'
                  defaultValue='12:30:00'
                  className='[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                />
                <InputGroupAddon>
                  <Lucide.Clock2 className='text-muted mr-2.5 size-4' />
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </div>
        </div>
      </Card>
    )
  }
}

export const DatePicker: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [isOpen, setIsOpen] = React.useState(false)

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <InputGroup className='w-full max-w-56 cursor-pointer'>
            <Input
              value={date ? date.toLocaleDateString('en-US') : ''}
              placeholder='Select date'
              className='flex-1 cursor-pointer'
              readOnly
            />
            <InputGroupAddon>
              <Lucide.Calendar className='text-muted mr-2.5 size-4' />
            </InputGroupAddon>
          </InputGroup>
        </PopoverTrigger>
        <PopoverPopup className='w-auto p-0'>
          <Calendar mode='single' selected={date} onSelect={setDate} variant='plain' />
        </PopoverPopup>
      </Popover>
    )
  }
}

export const DateRangePicker: Story = {
  render: () => {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined)
    const [isOpen, setIsOpen] = React.useState(false)

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <InputGroup className='w-72 cursor-pointer'>
            <Input
              value={
                dateRange?.from
                  ? dateRange.to
                    ? `${dateRange.from.toLocaleDateString('en-US')} – ${dateRange.to.toLocaleDateString('en-US')}`
                    : dateRange.from.toLocaleDateString('en-US')
                  : ''
              }
              placeholder='Select date range'
              readOnly
              className='flex-1 cursor-pointer'
            />
            <InputGroupAddon>
              <Lucide.Calendar className='text-muted mr-2.5 size-4' />
            </InputGroupAddon>
          </InputGroup>
        </PopoverTrigger>
        <PopoverPopup className='w-auto p-0'>
          <Calendar
            mode='range'
            selected={dateRange}
            onSelect={setDateRange}
            variant='plain'
            numberOfMonths={2}
          />
        </PopoverPopup>
      </Popover>
    )
  }
}

export const DateTimePickerCard: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [timeFrom, setTimeFrom] = React.useState('10:30')
    const [timeTo, setTimeTo] = React.useState('12:30')

    return (
      <Card className='mx-auto w-fit min-w-xs overflow-hidden'>
        <div className='p-0'>
          <Calendar
            mode='single'
            variant='plain'
            selected={date}
            onSelect={setDate}
            className='w-full'
          />
        </div>
        <div className='border-border border-t p-4'>
          <div className='mb-3 flex justify-between'>
            <p className='text-dimmed text-sm'>Selected Date:</p>
            <p className='text-foreground text-sm font-medium'>
              {date ? date.toLocaleDateString('en-US', { dateStyle: 'full' }) : 'None'}
            </p>
          </div>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <InputGroup className='flex-1'>
              <Input
                type='time'
                value={timeFrom}
                onChange={(e) => setTimeFrom(e.target.value)}
                className='[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
              />
              <InputGroupAddon>
                <Lucide.Clock2 className='text-muted mr-2.5 size-4' />
              </InputGroupAddon>
            </InputGroup>
            <InputGroup className='flex-1'>
              <Input
                type='time'
                value={timeTo}
                onChange={(e) => setTimeTo(e.target.value)}
                className='[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
              />
              <InputGroupAddon>
                <Lucide.Clock2 className='text-muted mr-2.5 size-4' />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      </Card>
    )
  }
}
