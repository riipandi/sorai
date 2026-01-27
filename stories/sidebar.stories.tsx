import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/selia/avatar'
import { Menu, MenuPopup, MenuItem, MenuTrigger } from '#/components/selia/menu'
import {
  Sidebar,
  SidebarCollapsible,
  SidebarCollapsiblePanel,
  SidebarCollapsibleTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupTitle,
  SidebarHeader,
  SidebarItem,
  SidebarItemButton,
  SidebarList,
  SidebarLogo,
  SidebarMenu,
  SidebarSubmenu
} from '#/components/selia/sidebar'

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
          <img src='https://selia.earth/selia.png' alt='Selia' className='size-8' />
          <span className='font-semibold'>Selia</span>
        </SidebarLogo>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupTitle>Navigation</SidebarGroupTitle>
            <SidebarGroupAction>
              <button>
                <Lucide.PlusIcon />
              </button>
            </SidebarGroupAction>
            <SidebarList>
              <SidebarItem>
                <SidebarItemButton active>
                  <Lucide.HomeIcon />
                  Dashboard
                </SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>
                  <Lucide.ShoppingBagIcon />
                  Products
                </SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarItemButton>
                  <Lucide.TagsIcon />
                  Categories
                </SidebarItemButton>
              </SidebarItem>
              <SidebarItem>
                <SidebarCollapsible>
                  <SidebarCollapsibleTrigger
                    render={
                      <SidebarItemButton>
                        <Lucide.ChartAreaIcon />
                        Reports
                      </SidebarItemButton>
                    }
                  />
                  <SidebarCollapsiblePanel>
                    <SidebarSubmenu>
                      <SidebarList>
                        <SidebarItem>
                          <SidebarItemButton>Sales</SidebarItemButton>
                        </SidebarItem>
                        <SidebarItem>
                          <SidebarItemButton>Traffic</SidebarItemButton>
                        </SidebarItem>
                        <SidebarItem>
                          <SidebarItemButton>Conversion</SidebarItemButton>
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
                          src='https://pbs.twimg.com/profile_images/1881314507865411584/aXlN8o5e_400x400.jpg'
                          alt='Avatar'
                        />
                        <AvatarFallback>RF</AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='font-medium'>Rizal Fakhri</span>
                        <span className='text-muted text-sm'>rizal@yayan.com</span>
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
