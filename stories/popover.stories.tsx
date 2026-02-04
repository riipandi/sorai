import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Button } from '#/components/button'
import {
  Popover,
  PopoverPopup,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger
} from '#/components/popover'

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
      <PopoverTrigger render={<Button variant='tertiary' />}>Learn Spell</PopoverTrigger>
      <PopoverPopup className='w-72'>
        <PopoverTitle>Learn Expelliarmus</PopoverTitle>
        <PopoverDescription>
          Master this disarming charm to protect yourself in magical duels. Taught by Professor
          Filius Flitwick at Hogwarts.
        </PopoverDescription>
        <Button variant='tertiary' size='xs'>
          Learn Now
          <Lucide.ArrowRightIcon />
        </Button>
      </PopoverPopup>
    </Popover>
  )
}
