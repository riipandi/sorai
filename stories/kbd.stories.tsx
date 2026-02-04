import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kbd } from '#/components/kbd'

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
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
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='flex items-center space-x-3'>
      <Kbd>Alt + F4</Kbd>
      <Kbd variant='outline'>Ctrl + V</Kbd>
      <Kbd variant='plain'>Ctrl + C</Kbd>
    </div>
  )
}
