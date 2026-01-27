import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Button } from '#/components/selia/button'
import {
  Popover,
  PopoverPopup,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger
} from '#/components/selia/popover'

const meta = {
  title: 'Components/Popover',
  component: Popover,
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
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button>Upgrade</Button>} />
      <PopoverPopup className='w-72'>
        <PopoverTitle>Upgrade to Pro</PopoverTitle>
        <PopoverDescription>
          Upgrade to Pro to get more features and access to exclusive content.
        </PopoverDescription>
        <Button size='sm' variant='tertiary' pill>
          Upgrade
          <Lucide.ArrowRightIcon />
        </Button>
      </PopoverPopup>
    </Popover>
  )
}
