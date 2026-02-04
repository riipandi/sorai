import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Toggle } from '#/components/toggle'

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
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
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='flex items-center space-x-3'>
      <Toggle
        aria-label='Favorite'
        className='data-pressed:*:[svg]:fill-red-500 data-pressed:*:[svg]:stroke-red-500'
      >
        <Lucide.HeartIcon />
        Favorite
      </Toggle>

      <Toggle
        aria-label='Star'
        className='data-pressed:*:[svg]:fill-yellow-500 data-pressed:*:[svg]:stroke-yellow-500'
        size='md-icon'
      >
        <Lucide.StarIcon />
      </Toggle>

      <Toggle
        aria-label='Bookmark'
        className='data-pressed:*:[svg]:fill-blue-500 data-pressed:*:[svg]:stroke-blue-500'
        size='md-icon'
        variant='plain'
      >
        <Lucide.BookmarkIcon />
      </Toggle>

      <Toggle
        aria-label='Favorite'
        className='data-pressed:*:[svg]:fill-red-500 data-pressed:*:[svg]:stroke-red-500'
        variant='plain'
      >
        <Lucide.HeartIcon />
        Favorite
      </Toggle>
    </div>
  )
}

export const SizeShowcase: Story = {
  args: {},
  render: () => (
    <div className='flex items-center space-x-3'>
      <Toggle
        aria-label='Bookmark'
        className='data-pressed:*:[svg]:fill-blue-500 data-pressed:*:[svg]:stroke-blue-500'
        size='icon-sm'
      >
        <Lucide.BookmarkIcon />
      </Toggle>

      <Toggle
        aria-label='Favorite'
        className='data-pressed:*:[svg]:fill-red-500 data-pressed:*:[svg]:stroke-red-500'
        size='sm'
      >
        <Lucide.HeartIcon />
        Favorite
      </Toggle>

      <Toggle
        aria-label='Bookmark'
        className='data-pressed:*:[svg]:fill-blue-500 data-pressed:*:[svg]:stroke-blue-500'
        size='md-icon'
      >
        <Lucide.BookmarkIcon />
      </Toggle>

      <Toggle
        aria-label='Favorite'
        className='data-pressed:*:[svg]:fill-red-500 data-pressed:*:[svg]:stroke-red-500'
        size='md'
      >
        <Lucide.HeartIcon />
        Favorite
      </Toggle>
    </div>
  )
}
