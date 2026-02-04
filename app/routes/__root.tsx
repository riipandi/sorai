import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { ThemeProvider } from 'tan-themer'
import { NotFound } from '#/errors'
import type { AuthStore } from '#/stores'

export interface GlobalContext {
  queryClient: QueryClient
  auth: AuthStore
}

export const Route = createRootRouteWithContext<GlobalContext>()({
  component: RootComponent,
  notFoundComponent: NotFound,
  loader({ context }) {
    // Always return current auth state from context
    const { queryClient, auth } = context
    return { queryClient, auth }
  }
})

function RootComponent() {
  return (
    <ThemeProvider
      themes={['light', 'dark']}
      attribute='data-theme'
      storage='localStorage'
      defaultTheme='system'
      disableTransitionOnChange={true}
      enableColorScheme={false}
      enableSystem={true}
    >
      <Outlet />
    </ThemeProvider>
  )
}
