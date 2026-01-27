import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading } from '#/components/selia/heading'

const meta = {
  title: 'Components/Heading',
  component: Heading,
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
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='flex flex-col gap-4'>
      <Heading size='lg'>This is a large heading</Heading>
      <Heading size='md'>This is a medium heading</Heading>
      <Heading size='sm'>This is a small heading</Heading>
    </div>
  )
}
