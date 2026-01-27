import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider } from '#/components/selia/divider'

const meta = {
  title: 'Components/Divider',
  component: Divider,
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
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='w-full min-w-md lg:w-6/12'>
      <Divider className='my-4'>Text on the left</Divider>
      <Divider className='my-4' variant='center'>
        Text on the center
      </Divider>
      <Divider className='my-4' variant='right'>
        Text on the right
      </Divider>
    </div>
  )
}
