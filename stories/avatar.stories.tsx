import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Avatar,
  AvatarFallback,
  AvatarFallbackInitial,
  AvatarImage,
  AvatarIndicator
} from '#/components/selia/avatar'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
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
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='inline-flex space-x-2'>
      <Avatar>
        <AvatarImage
          src='https://api.dicebear.com/9.x/adventurer-neutral/svg?radius=50&seed=john@example.com'
          alt='John Doe'
        />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src='https://api.dicebear.com/9.x/adventurer-neutral/svg?radius=50&seed=john@example.com'
          alt='John Doe'
        />
        <AvatarFallbackInitial name='John Doe' />
      </Avatar>
      <Avatar>
        <AvatarFallbackInitial name='John Doe' />
        <AvatarIndicator className='outline-background bg-green-500 outline' />
      </Avatar>
      <Avatar>
        <AvatarFallbackInitial name='Jane' />
        <AvatarIndicator className='outline-background bg-green-500 outline' />
      </Avatar>
      <Avatar>
        <AvatarFallbackInitial />
        <AvatarIndicator className='outline-background bg-red-500 outline' />
      </Avatar>
      <Avatar>NA</Avatar>
    </div>
  )
}
