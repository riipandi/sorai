import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { NotFound } from '#/errors'
import type { AuthStore, UIStore } from '#/stores'

export interface GlobalContext {
  queryClient: QueryClient
  auth: AuthStore
  ui: UIStore
}

export const Route = createRootRouteWithContext<GlobalContext>()({
  component: () => <Outlet />,
  notFoundComponent: NotFound,
  loader({ context }) {
    // Always return current auth and ui state from context
    const { queryClient, auth, ui } = context
    return { queryClient, auth, ui }
  }
})
