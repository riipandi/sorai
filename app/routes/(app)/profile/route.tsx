import { createFileRoute, Outlet } from '@tanstack/react-router'
import * as Lucide from 'lucide-react'
import { NotFound } from '#/errors'

export const Route = createFileRoute('/(app)/profile')({
  component: RouteComponent,
  notFoundComponent: NotFound
})

function RouteComponent() {
  return (
    <div className='mx-auto max-w-6xl space-y-6'>
      {/* Page Header */}
      <div className='pb-4'>
        <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>Profile</h1>
        <p className='mt-1 text-sm text-gray-500'>Manage your account settings and preferences</p>
      </div>

      {/* Profile Layout with Sidebar */}
      <div className='flex flex-col gap-6 lg:flex-row lg:gap-8'>
        {/* Profile Sidebar Navigation */}
        <aside className='w-full shrink-0 lg:w-64'>
          <nav className='space-y-1 rounded-lg border border-gray-200 bg-white p-2 shadow-sm'>
            <ProfileNavLink to='/profile' icon={Lucide.User} label='Profile' exact />
            <ProfileNavLink
              to='/profile/change-password'
              icon={Lucide.Lock}
              label='Change Password'
            />
            <ProfileNavLink to='/profile/sessions' icon={Lucide.Smartphone} label='Sessions' />
            <ProfileNavLink to='/profile/change-email' icon={Lucide.Mail} label='Change Email' />
          </nav>
        </aside>

        {/* Page Content */}
        <div className='min-w-0 flex-1'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

function ProfileNavLink({
  to,
  icon: Icon,
  label,
  exact = false
}: {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  exact?: boolean
}) {
  return (
    <Route.Link
      to={to}
      className='flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900'
      activeProps={{
        className: 'bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700'
      }}
      activeOptions={{ exact }}
    >
      <Icon className='h-4 w-4' />
      <span>{label}</span>
    </Route.Link>
  )
}
