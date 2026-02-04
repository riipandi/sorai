import { createFileRoute, Outlet, redirect, type ParsedLocation } from '@tanstack/react-router'
import { useTheme } from 'tan-themer'
import { ThemeSelector } from '#/components/theme-selector'
import { NotFound } from '#/errors'
import type { GlobalContext } from '#/routes/__root'

interface BeforeLoadParams {
  search?: { redirect?: string }
  context: GlobalContext
  location: ParsedLocation
}

export const Route = createFileRoute('/(auth)')({
  component: RouteComponent,
  notFoundComponent: NotFound,
  beforeLoad: ({ search, context }: BeforeLoadParams) => {
    const isAuthenticated = !!context.auth?.atoken
    if (isAuthenticated) {
      const redirectTo = search?.redirect ?? '/'
      throw redirect({ href: redirectTo })
    }
  }
})

function RouteComponent() {
  const { themes, theme, setTheme } = useTheme()

  return (
    <div className='bg-dimmed/5 flex min-h-screen items-center justify-center'>
      <div className='absolute top-4 right-4'>
        <ThemeSelector
          value={theme}
          themes={themes}
          onChange={setTheme}
          triggerVariant='plain'
          className='ml-auto'
        />
      </div>
      <Outlet />
    </div>
  )
}
