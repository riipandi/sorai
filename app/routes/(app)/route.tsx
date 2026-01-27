import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import * as Lucide from 'lucide-react'
import { useEffect, useState } from 'react'
import { NotFound } from '#/errors'
import { useAuth } from '#/guards'
import { uiStore } from '#/stores'
import { Navbar } from './-navbar'

export const Route = createFileRoute('/(app)')({
  component: RouteComponent,
  notFoundComponent: NotFound,
  beforeLoad: ({ location, context }) => {
    if (!context.auth.atoken) {
      throw redirect({ to: '/signin', search: { redirect: location.href } })
    }
  }
})

function RouteComponent() {
  const navigate = Route.useNavigate()

  const { user, logout } = useAuth()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useEffect(() => {
    const ui = uiStore.get()
    setIsMobileSidebarOpen(ui.sidebar === 'show')
  }, [])

  const handleLogout = () => {
    logout()
      .then(() => navigate({ to: '/signin', search: { redirect: '/' } }))
      .catch((error) => console.error('Logout failed', error))
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => {
      const newState = !prev
      uiStore.set({ ...uiStore.get(), sidebar: newState ? 'show' : 'hide' })
      return newState
    })
  }

  return (
    <div className='bg-background text-foreground flex h-screen flex-col'>
      {/* Mobile Header */}
      <header className='border-b border-gray-200 bg-white px-4 py-3 lg:hidden'>
        <div className='flex items-center justify-between'>
          <button
            type='button'
            onClick={toggleMobileSidebar}
            className='rounded-lg p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            aria-label='Toggle sidebar'
          >
            <Lucide.Menu className='size-6' />
          </button>
          <h1 className='text-lg font-semibold text-gray-900'>Sorai LLM Gateway</h1>
          <div className='size-6' /> {/* Spacer for center alignment */}
        </div>
      </header>

      <div className='flex-1 overflow-hidden'>
        <div className='flex h-full'>
          {/* Mobile Sidebar Overlay */}
          {isMobileSidebarOpen && (
            <div
              className='fixed inset-0 z-40 bg-black/50 lg:hidden'
              onClick={toggleMobileSidebar}
              aria-hidden='true'
            />
          )}

          {/* Sidebar Navigation */}
          <Navbar user={user} logoutFn={handleLogout} />

          {/* Main Content */}
          <main className='flex-1 overflow-auto'>
            <div className='h-auto px-4 py-8 lg:px-8 lg:pb-10'>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
