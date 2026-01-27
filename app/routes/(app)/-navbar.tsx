import { Link, type LinkProps, useLocation } from '@tanstack/react-router'
import * as Lucide from 'lucide-react'
import { Avatar, AvatarFallbackInitial, AvatarImage } from '#/components/selia/avatar'
import { Menu, MenuPopup, MenuItem, MenuTrigger, MenuSeparator } from '#/components/selia/menu'
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
import type { User } from '#/schemas/user.schema'

interface NavItem {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  to?: LinkProps['to']
  href?: LinkProps['href']
  exact?: boolean
  children?: NavItem[]
}

interface NavGroup {
  title?: string
  action?: {
    label: string
    action: () => void
  }
  items: NavItem[]
}

interface NavbarProps {
  user: User | null
  logoutFn: () => void
}

const primaryGroup: NavGroup = {
  items: [{ to: '/', label: 'Dashboard', icon: Lucide.HomeIcon, exact: true }]
}

const secondaryGroup: NavGroup = {
  title: 'Navigation',
  action: {
    label: 'Add new',
    action: () => console.log('Add new item')
  },
  items: [
    { href: '#', label: 'Products', icon: Lucide.ShoppingBagIcon },
    { href: '#', label: 'Categories', icon: Lucide.TagsIcon },
    {
      label: 'Reports',
      icon: Lucide.ChartAreaIcon,
      children: [
        { href: '#', label: 'Sales' },
        { href: '#', label: 'Traffic' },
        { href: '#', label: 'Conversion' }
      ]
    }
  ]
}

const settingsGroup: NavGroup = {
  title: 'Settings',
  items: [{ to: '/profile', label: 'User Profile', icon: Lucide.UserIcon, exact: true }]
}

function renderNavItem(item: NavItem) {
  const location = useLocation()

  if (item.children) {
    return (
      <SidebarItem key={item.label}>
        <SidebarCollapsible>
          <SidebarCollapsibleTrigger render={<SidebarItemButton />}>
            {item.icon ? <item.icon /> : null}
            {item.label}
          </SidebarCollapsibleTrigger>
          <SidebarCollapsiblePanel>
            <SidebarSubmenu>
              <SidebarList>
                {item.children.map((submenu) => (
                  <SidebarItem key={submenu.label}>
                    <SidebarItemButton
                      render={<Link to={submenu.to} activeOptions={{ exact: submenu.exact }} />}
                      active={location.pathname === submenu.to}
                    >
                      {submenu.icon ? <submenu.icon /> : null}
                      {submenu.label}
                    </SidebarItemButton>
                  </SidebarItem>
                ))}
              </SidebarList>
            </SidebarSubmenu>
          </SidebarCollapsiblePanel>
        </SidebarCollapsible>
      </SidebarItem>
    )
  }

  return (
    <SidebarItem key={item.label}>
      <SidebarItemButton
        render={<Link to={item.to} activeOptions={{ exact: item.exact }} />}
        active={location.pathname === item.to}
      >
        {item.icon ? <item.icon /> : null}
        {item.label}
      </SidebarItemButton>
    </SidebarItem>
  )
}

function renderNavGroup(group: NavGroup, index: number) {
  return (
    <SidebarGroup key={`${index}-${group.title}`}>
      {group.title && <SidebarGroupTitle>{group.title}</SidebarGroupTitle>}
      {group.action && (
        <SidebarGroupAction>
          <button onClick={group.action.action} aria-label={group.action.label}>
            <Lucide.PlusIcon />
          </button>
        </SidebarGroupAction>
      )}
      <SidebarList>{group.items.map((item) => renderNavItem(item))}</SidebarList>
    </SidebarGroup>
  )
}

function UserMenu({ user, logoutFn }: NavbarProps) {
  return (
    <Menu>
      <MenuTrigger
        data-slot='sidebar-item-button'
        render={
          <SidebarItemButton>
            <Avatar size='sm'>
              <AvatarImage
                src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?radius=50&seed=${user?.email}`}
                alt={user?.name}
              />
              <AvatarFallbackInitial name={user?.name} />
            </Avatar>
            <div className='flex flex-col'>
              <span className='font-medium'>{user?.name}</span>
              <span className='text-muted text-sm'>{user?.email}</span>
            </div>
            <Lucide.ChevronsUpDownIcon className='ml-auto' />
          </SidebarItemButton>
        }
      />
      <MenuPopup className='w-(--anchor-width)' side='top'>
        <MenuItem render={<Link to='/profile' />}>
          <Lucide.SettingsIcon />
          Settings
        </MenuItem>
        <MenuSeparator />
        <MenuItem onClick={logoutFn}>
          <Lucide.LogOutIcon />
          Logout
        </MenuItem>
      </MenuPopup>
    </Menu>
  )
}

export function Navbar({ user, logoutFn }: NavbarProps) {
  const navGroups = [primaryGroup, secondaryGroup, settingsGroup]

  return (
    <Sidebar className='border-border/50 border-r bg-gray-50' size='default'>
      <SidebarHeader>
        <SidebarLogo className='px-2 py-1'>
          <img src='/images/vite.svg' alt='Selia' className='size-6' />
          <span className='font-semibold'>Sorai</span>
        </SidebarLogo>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>{navGroups.map((group, index) => renderNavGroup(group, index))}</SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarList>
            <SidebarItem>
              <UserMenu user={user} logoutFn={logoutFn} />
            </SidebarItem>
          </SidebarList>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
