import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Button } from '#/components/selia/button'
import { Menu, MenuPopup, MenuItem, MenuTrigger, MenuSeparator } from '#/components/selia/menu'

const meta = {
  title: 'Components/Menu',
  component: Menu,
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
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <Menu>
      <MenuTrigger
        render={
          <Button variant='secondary'>
            Menu <Lucide.ChevronDownIcon />
          </Button>
        }
      />
      <MenuPopup>
        <MenuItem>Add to library</MenuItem>
        <MenuItem>Add to queue</MenuItem>
        <MenuSeparator />
        <MenuItem>Play next</MenuItem>
        <MenuItem>Play last</MenuItem>
      </MenuPopup>
    </Menu>
  )
}
