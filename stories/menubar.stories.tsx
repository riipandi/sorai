import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '#/components/button'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuSubmenu,
  MenuSubmenuTrigger,
  MenuSubmenuPopup,
  MenuTrigger
} from '#/components/menu'
import { Menubar } from '#/components/menubar'

const meta = {
  title: 'Components/Menubar',
  component: Menubar,
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
} satisfies Meta<typeof Menubar>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <Menubar>
      <Menu>
        <MenuTrigger render={<Button variant='plain' />}>Book</MenuTrigger>
        <MenuPopup size='default'>
          <MenuItem>New Book</MenuItem>
          <MenuItem>Open</MenuItem>
          <MenuItem>Save</MenuItem>
          <MenuSubmenu>
            <MenuSubmenuTrigger>Export</MenuSubmenuTrigger>
            <MenuSubmenuPopup size='default'>
              <MenuItem>PDF</MenuItem>
              <MenuItem>EPUB</MenuItem>
              <MenuItem>MOBI</MenuItem>
            </MenuSubmenuPopup>
          </MenuSubmenu>
          <MenuSeparator />
          <MenuItem>Close App</MenuItem>
        </MenuPopup>
      </Menu>
      <Menu>
        <MenuTrigger render={<Button variant='plain' />}>Edit</MenuTrigger>
        <MenuPopup size='default'>
          <MenuItem>Copy Spell</MenuItem>
          <MenuItem>Paste Clue</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuPopup>
      </Menu>
      <Menu>
        <MenuTrigger render={<Button variant='plain' />}>View</MenuTrigger>
        <MenuPopup size='default'>
          <MenuItem>Zoom In</MenuItem>
          <MenuItem>Zoom Out</MenuItem>
          <MenuSubmenu>
            <MenuSubmenuTrigger>Layout</MenuSubmenuTrigger>
            <MenuSubmenuPopup size='default'>
              <MenuItem>Single Page</MenuItem>
              <MenuItem>Two Pages</MenuItem>
              <MenuItem>Continuous</MenuItem>
            </MenuSubmenuPopup>
          </MenuSubmenu>
          <MenuSeparator />
          <MenuItem>Full Screen</MenuItem>
        </MenuPopup>
      </Menu>
    </Menubar>
  )
}

export const Compact: Story = {
  args: {},
  render: () => (
    <Menubar>
      <Menu>
        <MenuTrigger render={<Button variant='plain' size='sm' />}>Book</MenuTrigger>
        <MenuPopup size='compact'>
          <MenuItem>New Book</MenuItem>
          <MenuItem>Open</MenuItem>
          <MenuItem>Save</MenuItem>
          <MenuSubmenu>
            <MenuSubmenuTrigger>Export</MenuSubmenuTrigger>
            <MenuSubmenuPopup size='compact'>
              <MenuItem>PDF</MenuItem>
              <MenuItem>EPUB</MenuItem>
              <MenuItem>MOBI</MenuItem>
            </MenuSubmenuPopup>
          </MenuSubmenu>
          <MenuSeparator />
          <MenuItem>Close App</MenuItem>
        </MenuPopup>
      </Menu>
      <Menu>
        <MenuTrigger render={<Button variant='plain' size='sm' />}>Edit</MenuTrigger>
        <MenuPopup size='compact'>
          <MenuItem>Copy Spell</MenuItem>
          <MenuItem>Paste Clue</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuPopup>
      </Menu>
      <Menu>
        <MenuTrigger render={<Button variant='plain' size='sm' />}>View</MenuTrigger>
        <MenuPopup size='compact'>
          <MenuItem>Zoom In</MenuItem>
          <MenuItem>Zoom Out</MenuItem>
          <MenuSubmenu>
            <MenuSubmenuTrigger>Layout</MenuSubmenuTrigger>
            <MenuSubmenuPopup size='compact'>
              <MenuItem>Single Page</MenuItem>
              <MenuItem>Two Pages</MenuItem>
              <MenuItem>Continuous</MenuItem>
            </MenuSubmenuPopup>
          </MenuSubmenu>
          <MenuSeparator />
          <MenuItem>Full Screen</MenuItem>
        </MenuPopup>
      </Menu>
    </Menubar>
  )
}
