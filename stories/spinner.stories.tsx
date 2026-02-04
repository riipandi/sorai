import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from '#/components/spinner'

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
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
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='flex items-center gap-6'>
      <Spinner className='text-muted' />
      <Spinner className='text-success' size='sm' />
      <Spinner className='text-warning' size='md' />
      <Spinner className='text-danger' size='lg' />
      <Spinner className='text-dimmed' size='xl' />
      <Spinner size='xs' />
    </div>
  )
}
