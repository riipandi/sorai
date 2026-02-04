import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Badge } from '#/components/badge'

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

export const VariantShowcase: Story = {
  args: {},
  render: () => (
    <div className='inline-flex space-x-2'>
      <Badge variant='primary'>Primary</Badge>
      <Badge variant='secondary'>Secondary</Badge>
      <Badge variant='tertiary'>Tertiary</Badge>
      <Badge variant='success'>Success</Badge>
      <Badge variant='info'>Info</Badge>
      <Badge variant='warning'>Warning</Badge>
      <Badge variant='danger'>Danger</Badge>
    </div>
  )
}

export const SizeShowcase: Story = {
  args: {},
  render: () => (
    <div className='inline-flex items-center space-x-2'>
      <Badge variant='primary' size='sm'>
        Small
      </Badge>
      <Badge variant='primary' size='md'>
        Medium
      </Badge>
      <Badge variant='primary' size='lg'>
        Large
      </Badge>
    </div>
  )
}

export const VariousShowcase: Story = {
  args: {},
  render: () => (
    <div className='inline-flex items-center space-x-2'>
      <Badge pill variant='tertiary'>
        Tertiary Pill
      </Badge>
      <Badge pill variant='primary'>
        Primary Pill
      </Badge>
      <Badge variant='primary'>
        <Lucide.InfoIcon />
        With Icon
      </Badge>
    </div>
  )
}
