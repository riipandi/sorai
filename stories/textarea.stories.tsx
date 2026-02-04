import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from '#/components/textarea'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
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
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='flex w-full flex-col gap-6'>
      <Textarea variant='default' placeholder='Textarea variant default' />
      <Textarea variant='subtle' placeholder='Textarea variant subtle' />
    </div>
  )
}
