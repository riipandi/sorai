import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { IconBox } from '#/components/selia/icon-box'

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
    <div className='flex space-x-2'>
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
