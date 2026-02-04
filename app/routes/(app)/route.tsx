import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SidebarCloseIcon, SidebarOpenIcon } from 'lucide-react'
import { useTheme } from 'tan-themer'
import { Button } from '#/components/button'
import { ScrollArea } from '#/components/scroll-area'
import { ThemeSelector } from '#/components/theme-selector'
import { Heading } from '#/components/typography'
import { NotFound } from '#/errors'
import { requireAuthentication, useAuth } from '#/guards'
import { useSidebar } from '#/hooks/use-sidebar'
import { Navbar } from './-navbar'

export const Route = createFileRoute('/(app)')({
  component: RouteComponent,
  notFoundComponent: NotFound,
  beforeLoad: async ({ location }) => {
    return requireAuthentication(location)
  }
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { user, logout } = useAuth()
  const { themes, theme, setTheme } = useTheme()

  const { sidebarOpen, toggleSidebar } = useSidebar()

  const handleLogout = () => {
    logout()
      .then(() => navigate({ to: '/signin', search: { redirect: '/' } }))
      .catch((error) => console.error('Logout failed', error))
  }

  return (
    <div className='flex h-dvh'>
      {/* Sidebar navigation */}
      <Navbar
        user={user}
        logoutFn={handleLogout}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <main className='flex flex-1 flex-col'>
        {/* Top navigation bar */}
        <nav className='border-card-separator flex items-center gap-2.5 border-b p-4 pr-5'>
          <Button variant='plain' size='icon-sm' className='text-muted' onClick={toggleSidebar}>
            {sidebarOpen ? <SidebarCloseIcon /> : <SidebarOpenIcon />}
          </Button>
          <Heading size='xs' level={5}>
            New Chat
          </Heading>
          <ThemeSelector value={theme} themes={themes} onChange={setTheme} className='ml-auto' />
        </nav>

        {/* Main Container */}
        <ScrollArea className='flex-1'>
          <div className='mx-auto w-full shrink-0 px-4 py-4 lg:px-0'>
            <Outlet />
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}
