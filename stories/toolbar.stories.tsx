import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Button } from '#/components/button'
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput
} from '#/components/number-field'
import {
  Select,
  SelectItem,
  SelectList,
  SelectPopup,
  SelectTrigger,
  SelectValue
} from '#/components/select'
import { Toggle } from '#/components/toggle'
import { ToggleGroup } from '#/components/toggle-group'
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator
} from '#/components/toolbar'

const meta = {
  title: 'Components/Toolbar',
  component: Toolbar,
  parameters: { layout: 'centered' },
  argTypes: {},
  tags: [], // ['autodocs']
  args: {},
  decorators: [
    (Story) => (
      <div className='flex w-full min-w-md items-center justify-center'>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Toolbar>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='pr-20'>
      <Toolbar>
        <ToolbarGroup aria-label='Indentation'>
          <ToolbarButton render={<Button variant='plain' size='icon' />} disabled>
            <Lucide.IndentIncreaseIcon />
          </ToolbarButton>
          <ToolbarButton render={<Button variant='plain' size='icon' />}>
            <Lucide.IndentDecreaseIcon />
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup aria-label='Formatting'>
          <ToolbarButton
            data-slot='toggle'
            render={<Toggle variant='plain' size='md-icon' />}
            aria-label='Bold'
            value='bold'
          >
            <Lucide.BoldIcon />
          </ToolbarButton>
          <ToolbarButton
            data-slot='toggle'
            render={<Toggle variant='plain' size='md-icon' />}
            aria-label='Italic'
            value='italic'
          >
            <Lucide.ItalicIcon />
          </ToolbarButton>
          <ToolbarButton
            data-slot='toggle'
            render={<Toggle variant='plain' size='md-icon' />}
            aria-label='Underline'
            value='underline'
          >
            <Lucide.UnderlineIcon />
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToggleGroup variant='plain' size='md-icon'>
          <ToolbarButton
            data-slot='toggle'
            render={<Toggle />}
            aria-label='Align left'
            value='align-left'
          >
            <Lucide.AlignLeftIcon />
          </ToolbarButton>
          <ToolbarButton
            data-slot='toggle'
            render={<Toggle />}
            aria-label='Align center'
            value='align-center'
          >
            <Lucide.AlignCenterIcon />
          </ToolbarButton>
          <ToolbarButton
            data-slot='toggle'
            render={<Toggle />}
            aria-label='Align right'
            value='align-right'
          >
            <Lucide.AlignRightIcon />
          </ToolbarButton>
        </ToggleGroup>
        <ToolbarSeparator />
        <Select defaultValue='Arial'>
          <SelectTrigger variant='plain' className='w-24'>
            <SelectValue placeholder='Font' className='max-w-24 truncate' />
          </SelectTrigger>
          <SelectPopup className='min-w-44'>
            <SelectList>
              <SelectItem value='Arial'>Arial</SelectItem>
              <SelectItem value='Times New Roman'>Times New Roman</SelectItem>
              <SelectItem value='Courier New'>Courier New</SelectItem>
              <SelectItem value='Georgia'>Georgia</SelectItem>
              <SelectItem value='Verdana'>Verdana</SelectItem>
              <SelectItem value='Gill Sans'>Gill Sans</SelectItem>
            </SelectList>
          </SelectPopup>
        </Select>
        <ToolbarSeparator />
        <NumberField defaultValue={14} min={1}>
          <NumberFieldGroup variant='plain'>
            <NumberFieldDecrement>
              <Lucide.MinusIcon />
            </NumberFieldDecrement>
            <ToolbarInput render={<NumberFieldInput className='w-12' />} />
            <NumberFieldIncrement>
              <Lucide.PlusIcon />
            </NumberFieldIncrement>
          </NumberFieldGroup>
        </NumberField>
        <ToolbarSeparator />
        <ToolbarLink className='text-muted px-1 text-nowrap'>Saved 5 min ago</ToolbarLink>
        <ToolbarSeparator className='mr-3' />
        <Button variant='tertiary' size='xs'>
          Save
        </Button>
      </Toolbar>
    </div>
  )
}
