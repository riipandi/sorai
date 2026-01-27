import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '#/components/selia/input'

const meta = {
  title: 'Components/Input',
  component: Input,
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
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => <Input placeholder='Default input' className='w-full min-w-sm' />
}

export const InputPassword: Story = {
  args: {},
  render: () => (
    <Input type='password' placeholder='Enter your password' className='w-full min-w-sm' />
  )
}

export const StrengthIndicator: Story = {
  args: {},
  render: () => (
    <Input
      type='password'
      placeholder='Enter your password'
      className='w-full min-w-sm'
      strengthIndicator
    />
  )
}
