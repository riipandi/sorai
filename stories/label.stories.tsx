import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '#/components/selia/input'
import { Label } from '#/components/selia/label'

const meta = {
  title: 'Components/Label',
  component: Label,
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
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='w-full space-y-2.5 xl:w-10/12 2xl:w-8/12'>
      <Label htmlFor='name'>Name</Label>
      <Input id='name' placeholder='Enter your name' />
    </div>
  )
}
