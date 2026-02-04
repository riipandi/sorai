import type { Meta, StoryObj } from '@storybook/react-vite'
import { InputPassword } from '#/components/input-password'

const meta = {
  title: 'Components/InputPassword',
  component: InputPassword,
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
} satisfies Meta<typeof InputPassword>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='flex flex-col gap-3'>
      <InputPassword placeholder='Enter your magical password' className='w-full min-w-sm' />
    </div>
  )
}

export const StrengthIndicator: Story = {
  args: {},
  render: () => (
    <InputPassword
      placeholder='Enter your magical password'
      className='w-full min-w-sm'
      strengthIndicator
    />
  )
}
