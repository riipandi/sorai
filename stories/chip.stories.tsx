import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Chip, ChipButton } from '#/components/selia/chip'

const meta = {
  title: 'Components/Chip',
  component: Chip,
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
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='flex space-x-4'>
      <Chip>
        Software Engineering
        <ChipButton>
          <Lucide.XIcon />
        </ChipButton>
      </Chip>
      <Chip>
        Machine Learning
        <ChipButton>
          <Lucide.XIcon />
        </ChipButton>
      </Chip>
    </div>
  )
}
