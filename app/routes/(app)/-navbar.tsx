import { Link, useLocation, type LinkProps } from '@tanstack/react-router'
import * as Lucide from 'lucide-react'
import * as React from 'react'
import { Button } from '#/components/button'
import { Sidebar, SidebarContent, SidebarCollapsible } from '#/components/sidebar'
import { SidebarCollapsiblePanel, SidebarCollapsibleTrigger } from '#/components/sidebar'
import { SidebarGroup, SidebarGroupAction, SidebarSubmenu } from '#/components/sidebar'
import { SidebarGroupTitle, SidebarFooter, SidebarHeader } from '#/components/sidebar'
import { SidebarList, SidebarLogo, SidebarMenu } from '#/components/sidebar'
import { SidebarItem, SidebarItemButton } from '#/components/sidebar'
import type { User } from '#/schemas/user.schema'
import { clx } from '#/utils/variant'
import { CommandBar } from './-command'
import { UserMenu } from './-user-menu'

interface NavbarProp {
  user: User | null
  logoutFn: () => void
  sidebarOpen: boolean
  toggleSidebar: () => void
}

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
    icon: React.ComponentType<{ className?: string }>
  }
  items: NavItem[]
}

const primaryGroup: NavGroup = {
  items: [
    { to: '/', label: 'Dashboard', icon: Lucide.HomeIcon, exact: true },
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

const secondaryGroup: NavGroup = {
  title: 'Manage',
  action: {
    label: 'Add new',
    icon: Lucide.PlusIcon,
    action: () => console.log('Add new item')
  },
  items: [
    { href: '#', label: 'Products', icon: Lucide.ShoppingBagIcon },
    { href: '#', label: 'Categories', icon: Lucide.TagsIcon }
  ]
}

const settingsGroup: NavGroup = {
  title: 'Settings',
  items: [
    { href: '#', label: 'Manage Users', icon: Lucide.UsersIcon, exact: true },
    { href: '#', label: 'Organizations', icon: Lucide.Building, exact: true }
  ]
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
          <Button
            size='icon-xs'
            variant='plain'
            onClick={group.action.action}
            aria-label={group.action.label}
          >
            <group.action.icon />
          </Button>
        </SidebarGroupAction>
      )}
      <SidebarList>{group.items.map((item) => renderNavItem(item))}</SidebarList>
    </SidebarGroup>
  )
}

export function Navbar({ sidebarOpen, toggleSidebar, user, logoutFn }: NavbarProp) {
  const [openCommandbar, setOpenCommandbar] = React.useState(false)

  return (
    <Sidebar
      className={clx(
        'border-separator/30 size-full border-r bg-neutral-50 dark:bg-neutral-950',
        'transition-all duration-200 lg:sticky lg:h-dvh lg:w-72',
        'max-lg:bg-background fixed top-0 z-50 size-full',
        // FIXME: sidebar state always show when refresh on desktop
        sidebarOpen ? 'left-0 ml-0' : '-left-full lg:-ml-72'
      )}
      size='loose'
    >
      <SidebarHeader>
        <div className='flex items-center justify-between'>
          <SidebarLogo className='items-center px-2'>
            <img src='/images/logoipsum-211.svg' className='h-7 w-auto dark:invert' alt='Sorai' />
            <span className='sr-only'>Sorai Console</span>
          </SidebarLogo>
          <div className='flex items-center gap-2.5'>
            {/* Command Bar */}
            <CommandBar open={openCommandbar} setOpen={setOpenCommandbar} />
            <Button size='icon-sm' variant='plain' className='lg:hidden' onClick={toggleSidebar}>
              {sidebarOpen ? <Lucide.SidebarClose /> : <Lucide.SidebarOpen />}
            </Button>
          </div>
        </div>

        <SidebarMenu className='mt-6'>
          <Button variant='primary' size='sm' block>
            <Lucide.Plus />
            New Chat
          </Button>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className='py-2!'>
        <SidebarMenu>
          {[primaryGroup, secondaryGroup, settingsGroup].map((group, index) =>
            renderNavGroup(group, index)
          )}
        </SidebarMenu>
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
