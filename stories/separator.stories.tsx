import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from '#/components/selia/separator'

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
    <div className='w-full'>
      <span>This is some text above the separator.</span>
      <Separator orientation='horizontal' className='my-4' />
      <span>This is some text below the separator.</span>
    </div>
  )
}
