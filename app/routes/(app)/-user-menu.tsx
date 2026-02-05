import { Link } from '@tanstack/react-router'
import * as Lucide from 'lucide-react'
import { Activity } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/avatar'
import { Button } from '#/components/button'
import { Menu, MenuTrigger, MenuPopup, MenuItem, MenuSeparator } from '#/components/menu'
import { SidebarItemButton } from '#/components/sidebar'
import type { User } from '#/schemas/user.schema'
import { clx } from '#/utils/variant'

interface UserMenuProp {
  user: User | null
  logoutFn: () => void
  minimal?: boolean
  noAvatar?: boolean
  className?: string
}

export function UserMenu({ user, logoutFn, minimal, noAvatar, className }: UserMenuProp) {
  return (
    <>
      <Activity mode={minimal ? 'visible' : 'hidden'}>
        <div
          className={clx(
            'text-foreground relative z-10 flex w-full cursor-pointer',
            'items-center gap-2.5 rounded-lg p-1 text-left',
            className
          )}
        >
          <Activity mode={noAvatar ? 'hidden' : 'visible'}>
            <Avatar size='sm'>
              <AvatarImage
                src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?radius=50&seed=${user?.email}`}
                alt={user?.name}
              />
              <AvatarFallback asInitial>{user?.name}</AvatarFallback>
            </Avatar>
          </Activity>
          <div className='flex flex-col'>
            <span className='font-medium'>{user?.name}</span>
            <span className='text-muted text-xs'>{user?.email}</span>
          </div>
          <Button variant='plain' size='icon' className='ml-auto' onClick={logoutFn}>
            <Lucide.LogOutIcon />
          </Button>
        </div>
      </Activity>

      <Activity mode={!minimal ? 'visible' : 'hidden'}>
        <Menu>
          <MenuTrigger
            data-slot='sidebar-item-button'
            render={<SidebarItemButton className={className} />}
          >
            <Activity mode={noAvatar ? 'hidden' : 'visible'}>
              <Avatar size='sm'>
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?radius=50&seed=${user?.email}`}
                  alt={user?.name}
                />
                <AvatarFallback asInitial>{user?.name}</AvatarFallback>
              </Avatar>
            </Activity>
            <div className='flex flex-col'>
              <span className='font-medium'>{user?.name}</span>
              <span className='text-muted text-xs'>{user?.email}</span>
            </div>
            <Lucide.ChevronsUpDown className='ml-auto' />
          </MenuTrigger>
          <MenuPopup className='w-(--anchor-width)' side='top'>
            <MenuItem>
              <Lucide.Sparkles />
              Upgrade Plan
            </MenuItem>
            <MenuItem>
              <Lucide.Palette />
              Personalization
            </MenuItem>
            <MenuItem render={<Link to='/profile' />}>
              <Lucide.Settings />
              Settings
            </MenuItem>
            <MenuSeparator />
            <MenuItem onClick={logoutFn}>
              <Lucide.LogOut />
              Logout
            </MenuItem>
          </MenuPopup>
        </Menu>
      </Activity>
    </>
  )
}
