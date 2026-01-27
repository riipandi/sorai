import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Toggle } from '#/components/selia/toggle'
import { ToggleGroup } from '#/components/selia/toggle-group'

const meta = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
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
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='flex space-x-4'>
      <ToggleGroup defaultValue={['start']} size='md-icon'>
        <Toggle value='left' aria-label='Left'>
          <Lucide.AlignLeftIcon />
        </Toggle>
        <Toggle value='center' aria-label='Center'>
          <Lucide.AlignCenterIcon />
        </Toggle>
        <Toggle value='right' aria-label='Right'>
          <Lucide.AlignRightIcon />
        </Toggle>
      </ToggleGroup>
      <ToggleGroup multiple size='md-icon'>
        <Toggle value='bold' aria-label='Bold'>
          <Lucide.BoldIcon />
        </Toggle>
        <Toggle value='italic' aria-label='Italic'>
          <Lucide.ItalicIcon />
        </Toggle>
        <Toggle value='underline' aria-label='Underline'>
          <Lucide.UnderlineIcon />
        </Toggle>
      </ToggleGroup>
    </div>
  )
}
