import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Chip, ChipButton } from '#/components/chip'

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
    <div className='flex items-center space-x-3'>
      <Chip>
        Gryffindor
        <ChipButton>
          <Lucide.XIcon />
        </ChipButton>
      </Chip>
      <Chip>
        Expelliarmus
        <ChipButton>
          <Lucide.XIcon />
        </ChipButton>
      </Chip>
    </div>
  )
}

export const VariantShowcase: Story = {
  args: {},
  render: () => (
    <div className='flex items-center space-x-3'>
      <Chip>Default</Chip>
      <Chip variant='primary'>Primary</Chip>
      <Chip variant='outline'>Outline</Chip>
      <Chip variant='plain'>Plain</Chip>
    </div>
  )
}

export const SizeShowcase: Story = {
  args: {},
  render: () => (
    <div className='flex items-center space-x-3'>
      <Chip size='sm'>Small</Chip>
      <Chip size='md'>Medium</Chip>
      <Chip size='lg'>Large</Chip>
    </div>
  )
}

export const WithIcon: Story = {
  args: {},
  render: () => (
    <div className='flex items-center space-x-3'>
      <Chip>
        <Lucide.BookIcon />
        The Da Vinci Code
      </Chip>
      <Chip>
        <Lucide.Wand2Icon />
        Hogwarts
      </Chip>
    </div>
  )
}
