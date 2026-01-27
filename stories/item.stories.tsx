import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '#/components/selia/button'
import {
  Item,
  ItemAction,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '#/components/selia/item'

const meta = {
  title: 'Components/Item',
  component: Item,
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
} satisfies Meta<typeof Item>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='flex w-full min-w-md flex-col gap-4 xl:w-10/12 2xl:w-8/12'>
      <Item className='items-center'>
        <ItemMedia>
          <img
            src='https://cdn.svglogos.dev/logos/claude-icon.svg'
            alt='Avatar'
            className='size-11 rounded'
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Claude</ItemTitle>
          <ItemDescription>AI chatbot</ItemDescription>
        </ItemContent>
        <ItemAction>
          <Button size='sm' pill>
            Install
          </Button>
        </ItemAction>
      </Item>
    </div>
  )
}
