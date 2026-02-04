import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Button } from '#/components/button'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogPopup,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '#/components/dialog'
import { IconBox } from '#/components/icon-box'
import { Textarea } from '#/components/textarea'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
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
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button>Open Dialog</Button>} />
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Send Owl</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>Send your message via owl post to Hogwarts.</DialogDescription>
          <Textarea placeholder='Enter your message' className='h-28' />
        </DialogBody>
        <DialogFooter>
          <DialogClose>Close</DialogClose>
          <DialogClose render={<Button size='sm' />}>Send Owl</DialogClose>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}

export const WithIconHeader: Story = {
  args: {},
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button>Open Dialog</Button>} />
      <DialogPopup>
        <DialogHeader>
          <IconBox size='sm'>
            <Lucide.MessageSquareIcon />
          </IconBox>
          <DialogTitle>Decode the Message</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>Help Professor Langdon decode this ancient symbol.</DialogDescription>
          <Textarea placeholder='Enter your translation' />
        </DialogBody>
        <DialogFooter>
          <DialogClose>Close</DialogClose>
          <DialogClose render={<Button size='sm' />}>Submit Solution</DialogClose>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}
