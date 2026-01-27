import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '#/components/selia/button'
import { Tooltip, TooltipPopup, TooltipTrigger } from '#/components/selia/tooltip'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
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
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant='secondary'>Hover me</Button>} />
      <TooltipPopup>You can place your tooltip content here.</TooltipPopup>
    </Tooltip>
  )
}
