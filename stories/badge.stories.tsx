import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Badge } from '#/components/selia/badge'

const meta = {
  title: 'Components/Badge',
  component: Badge,
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
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='inline-flex space-x-2'>
      <Badge>Default</Badge>
      <Badge variant='danger'>20</Badge>
      <Badge variant='success'>
        <Lucide.CheckCircle2Icon /> Verified
      </Badge>
    </div>
  )
}
