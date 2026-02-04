import type { TanStackDevtoolsReactInit } from '@tanstack/react-devtools'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { createRouter } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import { routeTree } from '#/routes.gen'
import App from './app'

// Create root element and ensure exists.
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error(
    "Root element not found. Check if it's in your index.html or if the id is correct."
  )
}

// Create the application router instance.
const appRoutes = createRouter({
  routeTree: routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  context: {
    queryClient: undefined!,
    auth: undefined!
  }
})

// Register the router instance for type safety.
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof appRoutes
  }
}

/**
 * Initialize a QueryClient instance with default options.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {},
    queries: {}
  }
})

// Define and configure TanStack DevTools with some plugins
const devToolsOptions: Partial<TanStackDevtoolsReactInit> = {
  config: {
    position: 'bottom-left',
    panelLocation: 'bottom',
    inspectHotkey: ['Alt', 'CtrlOrMeta'],
    openHotkey: ['Shift', 'D'],
    triggerHidden: true,
    requireUrlFlag: false,
    urlFlag: 'devtools',
    theme: 'dark'
  },
  plugins: [
    {
      name: 'TanStack Query',
      render: <ReactQueryDevtoolsPanel client={queryClient} theme='dark' />,
      defaultOpen: true
    },
    {
      name: 'TanStack Router',
      render: <TanStackRouterDevtoolsPanel router={appRoutes} />,
      defaultOpen: false
    }
  ]
}

// When you use Strict Mode, React renders each component twice to help you find unexpected side effects.
// @ref: https://react.dev/blog/2022/03/08/react-18-upgrade-guide#react
createRoot(rootElement).render(
  <StrictMode>
    <App
      routes={appRoutes}
      apiUrl={import.meta.env.PUBLIC_API_BASE_URL ?? '/api'}
      basePath={import.meta.env.PUBLIC_UI_BASE_URL ?? '/ui'}
      logLevel={import.meta.env.DEV ? 'debug' : 'info'}
      devTools={devToolsOptions}
      queryClient={queryClient}
    />
  </StrictMode>
)
