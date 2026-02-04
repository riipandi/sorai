import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/avatar'
import { Menu, MenuPopup, MenuItem, MenuTrigger } from '#/components/menu'
import { Sidebar, SidebarContent, SidebarCollapsible } from '#/components/sidebar'
import { SidebarCollapsiblePanel, SidebarCollapsibleTrigger } from '#/components/sidebar'
import { SidebarGroup, SidebarGroupAction, SidebarSubmenu } from '#/components/sidebar'
import { SidebarGroupTitle, SidebarFooter, SidebarHeader } from '#/components/sidebar'
import { SidebarList, SidebarLogo, SidebarMenu } from '#/components/sidebar'
import { SidebarItem, SidebarItemButton } from '#/components/sidebar'

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
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
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <Sidebar className='lg:w-72'>
      <SidebarHeader>
        <SidebarLogo>
          <img src='/images/logoipsum-211.svg' className='h-7 w-auto dark:invert' alt='Logo' />
          <span className='sr-only'>Mystery & Magic</span>
        </SidebarLogo>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupTitle>Library</SidebarGroupTitle>
            <SidebarGroupAction>
              <button>
                <Lucide.PlusIcon />
              </button>
            </SidebarGroupAction>
            <SidebarList>
              <SidebarItem>
                <SidebarItemButton active>
                  <Lucide.HomeIcon />
                  Home
                </SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>
                  <Lucide.BookIcon />
                  Books
                </SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>
                  <Lucide.BookmarkIcon />
                  Reading List
                </SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarCollapsible>
                  <SidebarCollapsibleTrigger
                    render={
                      <SidebarItemButton>
                        <Lucide.UsersIcon />
                        Characters
                      </SidebarItemButton>
                    }
                  />
                  <SidebarCollapsiblePanel>
                    <SidebarSubmenu>
                      <SidebarList>
                        <SidebarItem>
                          <SidebarItemButton>Harry Potter</SidebarItemButton>
                        </SidebarItem>
                        <SidebarItem>
                          <SidebarItemButton>Robert Langdon</SidebarItemButton>
                        </SidebarItem>
                        <SidebarItem>
                          <SidebarItemButton>Hermione Granger</SidebarItemButton>
                        </SidebarItem>
                      </SidebarList>
                    </SidebarSubmenu>
                  </SidebarCollapsiblePanel>
                </SidebarCollapsible>
              </SidebarItem>
            </SidebarList>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupTitle>Settings</SidebarGroupTitle>
            <SidebarList>
              <SidebarItem>
                <SidebarItemButton>
                  <Lucide.SettingsIcon />
                  Settings
                </SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>
                  <Lucide.UserIcon />
                  Profile
                </SidebarItemButton>
              </SidebarItem>
            </SidebarList>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarList>
            <SidebarItem>
              <Menu>
                <MenuTrigger
                  data-slot='sidebar-item-button'
                  render={
                    <SidebarItemButton>
                      <Avatar size='sm'>
                        <AvatarImage
                          src='https://api.dicebear.com/9.x/avataaars/svg?radius=50&seed=John+Doe'
                          alt='Avatar'
                        />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='font-medium'>John Doe</span>
                        <span className='text-muted text-sm'>john@example.com</span>
                      </div>
                      <Lucide.ChevronsUpDownIcon className='ml-auto' />
                    </SidebarItemButton>
                  }
                />
                <MenuPopup className='w-(--anchor-width)' side='top'>
                  <MenuItem>
                    <Lucide.UserIcon />
                    Profile
                  </MenuItem>
                  <MenuItem>
                    <Lucide.SettingsIcon />
                    Settings
                  </MenuItem>
                  <MenuItem>
                    <Lucide.LogOutIcon />
                    Logout
                  </MenuItem>
                </MenuPopup>
              </Menu>
            </SidebarItem>
          </SidebarList>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export const Compact: Story = {
  args: {},
  render: () => (
    <Sidebar className='border-border rounded-2xl border lg:w-72' size='compact'>
      <SidebarHeader>
        <SidebarLogo>
          <img src='/images/logoipsum-211.svg' className='h-7 w-auto dark:invert' alt='Logo' />
          <span className='sr-only'>Mystery & Magic</span>
        </SidebarLogo>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupTitle>Dan Brown Series</SidebarGroupTitle>
            <SidebarList>
              <SidebarItem>
                <SidebarItemButton active>The Da Vinci Code</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>Angels & Demons</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>The Lost Symbol</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>Inferno</SidebarItemButton>
              </SidebarItem>
            </SidebarList>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupTitle>Harry Potter Series</SidebarGroupTitle>
            <SidebarList>
              <SidebarItem>
                <SidebarItemButton>The Sorcerer's Stone</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>The Chamber of Secrets</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>The Prisoner of Azkaban</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>The Goblet of Fire</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>The Order of the Phoenix</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>The Half-Blood Prince</SidebarItemButton>
              </SidebarItem>
            </SidebarList>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

export const Loose: Story = {
  args: {},
  render: () => (
    <Sidebar className='border-border rounded-2xl border lg:w-72' size='loose'>
      <SidebarHeader>
        <SidebarLogo>
          <img src='/images/logoipsum-211.svg' className='h-7 w-auto dark:invert' alt='Logo' />
          <span className='sr-only'>Mystery & Magic</span>
        </SidebarLogo>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupTitle>Dan Brown Series</SidebarGroupTitle>
            <SidebarList>
              <SidebarItem>
                <SidebarItemButton>The Da Vinci Code</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>Angels & Demons</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>The Lost Symbol</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>Inferno</SidebarItemButton>
              </SidebarItem>
            </SidebarList>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupTitle>Harry Potter Series</SidebarGroupTitle>
            <SidebarList>
              <SidebarItem>
                <SidebarItemButton>The Sorcerer's Stone</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>The Chamber of Secrets</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>The Prisoner of Azkaban</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>The Goblet of Fire</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>The Order of the Phoenix</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>The Half-Blood Prince</SidebarItemButton>
              </SidebarItem>
            </SidebarList>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

export const Background: Story = {
  args: {},
  render: () => (
    <Sidebar className='border-border shadow-card bg-card rounded-2xl border lg:w-72'>
      <SidebarHeader>
        <SidebarLogo>
          <img src='/images/logoipsum-211.svg' className='h-7 w-auto dark:invert' alt='Logo' />
          <span className='sr-only'>Mystery & Magic</span>
        </SidebarLogo>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupTitle>Dan Brown Series</SidebarGroupTitle>
            <SidebarList>
              <SidebarItem>
                <SidebarItemButton>The Da Vinci Code</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>Angels & Demons</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>The Lost Symbol</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>Inferno</SidebarItemButton>
              </SidebarItem>
            </SidebarList>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupTitle>Harry Potter Series</SidebarGroupTitle>
            <SidebarList>
              <SidebarItem>
                <SidebarItemButton>The Sorcerer's Stone</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>The Chamber of Secrets</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>The Prisoner of Azkaban</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>The Goblet of Fire</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton active>The Order of the Phoenix</SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>The Half-Blood Prince</SidebarItemButton>
              </SidebarItem>
            </SidebarList>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
