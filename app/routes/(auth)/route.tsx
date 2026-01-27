import { createFileRoute, Outlet, redirect, type ParsedLocation } from '@tanstack/react-router'
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
    if (context.auth.atoken) {
      const redirectTo = search?.redirect ?? '/'
      throw redirect({ href: redirectTo })
    }
  }
})

function RouteComponent() {
  return (
    <div className='bg-background flex min-h-screen items-center justify-center'>
      <Outlet />
    </div>
  )
}
