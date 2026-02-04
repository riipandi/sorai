import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from '#/components/separator'
import { Text } from '#/components/typography'

const meta = {
  title: 'Components/Separator',
  component: Separator,
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
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='w-full max-w-sm'>
      <span>Chapter 1 begins here.</span>
      <Separator orientation='horizontal' className='my-4' />
      <span>Chapter 2 continues here.</span>
    </div>
  )
}

export const Vertical: Story = {
  args: {},
  render: () => (
    <div className='mx-auto flex w-full max-w-sm items-center justify-center gap-3'>
      <Text>Gryffindor</Text>
      <Text>Slytherin</Text>
      <Text>Ravenclaw</Text>
      <Separator orientation='vertical' />
      <Text>Hufflepuff</Text>
    </div>
  )
}
