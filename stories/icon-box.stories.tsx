import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { IconBox } from '#/components/icon-box'

const meta = {
  title: 'Components/IconBox',
  component: IconBox,
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
} satisfies Meta<typeof IconBox>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='flex items-center gap-3'>
      <IconBox>
        <Lucide.SettingsIcon />
      </IconBox>
      <IconBox variant='info'>
        <Lucide.InfoIcon />
      </IconBox>
      <IconBox variant='danger'>
        <Lucide.Trash2Icon />
      </IconBox>
    </div>
  )
}

export const VariantShowcase: Story = {
  args: {},
  render: () => (
    <div className='flex items-center gap-3'>
      <IconBox>
        <Lucide.PlayIcon />
      </IconBox>
      <IconBox variant='primary'>
        <Lucide.SettingsIcon />
      </IconBox>
      <IconBox variant='tertiary'>
        <Lucide.SettingsIcon />
      </IconBox>
      <IconBox variant='info'>
        <Lucide.InfoIcon />
      </IconBox>
      <IconBox variant='success'>
        <Lucide.CheckCircle2Icon />
      </IconBox>
      <IconBox variant='warning'>
        <Lucide.TriangleAlertIcon />
      </IconBox>
      <IconBox variant='danger'>
        <Lucide.Trash2Icon />
      </IconBox>
    </div>
  )
}

export const CircleVariants: Story = {
  args: {},
  render: () => (
    <div className='flex items-center gap-3'>
      <IconBox circle>
        <Lucide.PlayIcon />
      </IconBox>
      <IconBox variant='primary' circle>
        <Lucide.SettingsIcon />
      </IconBox>
      <IconBox variant='tertiary' circle>
        <Lucide.SettingsIcon />
      </IconBox>
      <IconBox variant='info' circle>
        <Lucide.InfoIcon />
      </IconBox>
      <IconBox variant='success' circle>
        <Lucide.CheckCircle2Icon />
      </IconBox>
      <IconBox variant='warning' circle>
        <Lucide.TriangleAlertIcon />
      </IconBox>
      <IconBox variant='danger' circle>
        <Lucide.Trash2Icon />
      </IconBox>
    </div>
  )
}

export const SizeShowcase: Story = {
  args: {},
  render: () => (
    <div className='flex items-center gap-3'>
      <IconBox size='sm'>
        <Lucide.PlayIcon />
      </IconBox>
      <IconBox size='md'>
        <Lucide.PlayIcon />
      </IconBox>
      <IconBox size='lg'>
        <Lucide.PlayIcon />
      </IconBox>
    </div>
  )
}
