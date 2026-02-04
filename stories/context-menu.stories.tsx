import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import {
  ContextMenu,
  ContextMenuPopup,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSubmenuTrigger,
  ContextMenuSubmenu,
  ContextMenuSubmenuPopup,
  ContextMenuGroup,
  ContextMenuRadioItem,
  ContextMenuRadioGroup,
  ContextMenuGroupLabel
} from '#/components/context-menu'
import { Kbd } from '#/components/kbd'

const meta = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  parameters: { layout: 'centered' },
  argTypes: {},
  tags: [],
  args: {},
  decorators: [
    (Story) => (
      <div className='flex w-full min-w-md items-center justify-center p-20'>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof ContextMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className='border-muted text-muted flex h-48 w-full items-center justify-center rounded border border-dashed select-none'>
        Right click here
      </ContextMenuTrigger>
      <ContextMenuPopup>
        <ContextMenuItem>Cast Spell</ContextMenuItem>
        <ContextMenuItem>Brew Potion</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Read Next</ContextMenuItem>
        <ContextMenuItem>Read Later</ContextMenuItem>
      </ContextMenuPopup>
    </ContextMenu>
  )
}

export const WithItemIcon: Story = {
  args: {},
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className='border-muted text-muted flex h-48 w-full items-center justify-center rounded border border-dashed select-none'>
        Right click here
      </ContextMenuTrigger>
      <ContextMenuPopup className='w-48'>
        <ContextMenuItem>
          <Lucide.BookIcon />
          Open Book
        </ContextMenuItem>
        <ContextMenuSubmenu>
          <ContextMenuSubmenuTrigger>
            <Lucide.Layers2Icon />
            Select Novel
          </ContextMenuSubmenuTrigger>
          <ContextMenuSubmenuPopup>
            <ContextMenuItem>The Da Vinci Code</ContextMenuItem>
            <ContextMenuItem>Angels & Demons</ContextMenuItem>
            <ContextMenuItem>Harry Potter</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>All Books</ContextMenuItem>
          </ContextMenuSubmenuPopup>
        </ContextMenuSubmenu>
        <ContextMenuItem>
          <Lucide.ScrollIcon />
          View Painting
        </ContextMenuItem>
        <ContextMenuItem>
          <Lucide.EyeIcon />
          Examine Clue
        </ContextMenuItem>
      </ContextMenuPopup>
    </ContextMenu>
  )
}

export const NestedSubMenu: Story = {
  args: {},
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className='border-muted text-muted flex h-48 w-full items-center justify-center rounded border border-dashed select-none'>
        Right click here
      </ContextMenuTrigger>
      <ContextMenuPopup>
        <ContextMenuItem>Add to Collection</ContextMenuItem>
        <ContextMenuSubmenu>
          <ContextMenuSubmenuTrigger>Add to Reading List</ContextMenuSubmenuTrigger>
          <ContextMenuSubmenuPopup>
            <ContextMenuItem>Recently Added</ContextMenuItem>
            <ContextMenuItem>Currently Reading</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuSubmenu>
              <ContextMenuSubmenuTrigger>More</ContextMenuSubmenuTrigger>
              <ContextMenuSubmenuPopup>
                <ContextMenuItem>Dan Brown Collection</ContextMenuItem>
                <ContextMenuItem>Harry Potter Series</ContextMenuItem>
                <ContextMenuItem>Mystery Novels</ContextMenuItem>
                <ContextMenuItem>Fantasy Books</ContextMenuItem>
              </ContextMenuSubmenuPopup>
            </ContextMenuSubmenu>
          </ContextMenuSubmenuPopup>
        </ContextMenuSubmenu>
        <ContextMenuItem>Add to Queue</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Read Next</ContextMenuItem>
        <ContextMenuItem>Read Later</ContextMenuItem>
      </ContextMenuPopup>
    </ContextMenu>
  )
}

export const AdvanceMenu: Story = {
  args: {},
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className='border-muted text-muted flex h-48 w-full items-center justify-center rounded border border-dashed select-none'>
        Right click here
      </ContextMenuTrigger>
      <ContextMenuPopup className='min-w-48'>
        <ContextMenuGroup>
          <ContextMenuGroupLabel>Wizard Profile</ContextMenuGroupLabel>
          <ContextMenuItem>
            <Lucide.UserIcon />
            Profile
          </ContextMenuItem>
          <ContextMenuItem>
            <Lucide.Wand2Icon />
            Learn Spell
          </ContextMenuItem>
          <ContextMenuItem>
            <Lucide.Settings2Icon />
            Settings
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuGroupLabel>Magical Settings</ContextMenuGroupLabel>
          <ContextMenuSubmenu>
            <ContextMenuSubmenuTrigger>Wand Core</ContextMenuSubmenuTrigger>
            <ContextMenuSubmenuPopup>
              <ContextMenuItem>Phoenix Feather</ContextMenuItem>
              <ContextMenuItem>Dragon Heartstring</ContextMenuItem>
              <ContextMenuItem>Unicorn Hair</ContextMenuItem>
            </ContextMenuSubmenuPopup>
          </ContextMenuSubmenu>
          <ContextMenuItem>
            Toggle Spellbook
            <Kbd variant='outline' className='ml-auto rounded-xs text-xs'>
              ⌘ B
            </Kbd>
          </ContextMenuItem>
          <ContextMenuSubmenu>
            <ContextMenuSubmenuTrigger>Hogwarts House</ContextMenuSubmenuTrigger>
            <ContextMenuSubmenuPopup>
              <ContextMenuRadioGroup defaultValue='gryffindor'>
                <ContextMenuRadioItem value='gryffindor'>Gryffindor</ContextMenuRadioItem>
                <ContextMenuRadioItem value='slytherin'>Slytherin</ContextMenuRadioItem>
                <ContextMenuRadioItem value='ravenclaw'>Ravenclaw</ContextMenuRadioItem>
                <ContextMenuRadioItem value='hufflepuff'>Hufflepuff</ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </ContextMenuSubmenuPopup>
          </ContextMenuSubmenu>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem className='text-danger'>
          Use Unforgivable Curse
          <Kbd variant='outline' className='ml-auto rounded-xs text-xs'>
            ⌘ Q
          </Kbd>
        </ContextMenuItem>
      </ContextMenuPopup>
    </ContextMenu>
  )
}

export const CompactMenu: Story = {
  args: {},
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className='border-muted text-muted flex h-48 w-full items-center justify-center rounded border border-dashed select-none'>
        Right click here
      </ContextMenuTrigger>
      <ContextMenuPopup size='compact'>
        <ContextMenuItem>
          <Lucide.SunIcon />
          Light
        </ContextMenuItem>
        <ContextMenuItem>
          <Lucide.MoonIcon />
          Dark
        </ContextMenuItem>
        <ContextMenuItem>
          <Lucide.Laptop2Icon />
          System
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSubmenu>
          <ContextMenuSubmenuTrigger>
            <Lucide.PaletteIcon />
            Custom
          </ContextMenuSubmenuTrigger>
          <ContextMenuSubmenuPopup size='compact'>
            <ContextMenuItem>
              <Lucide.PaletteIcon />
              Tokyo Night
            </ContextMenuItem>
            <ContextMenuItem>
              <Lucide.PaletteIcon />
              Dracula
            </ContextMenuItem>
            <ContextMenuItem>
              <Lucide.PaletteIcon />
              Nord
            </ContextMenuItem>
            <ContextMenuItem>
              <Lucide.PaletteIcon />
              Gruvbox
            </ContextMenuItem>
            <ContextMenuItem>
              <Lucide.PaletteIcon />
              Catppuccin
            </ContextMenuItem>
          </ContextMenuSubmenuPopup>
        </ContextMenuSubmenu>
      </ContextMenuPopup>
    </ContextMenu>
  )
}
