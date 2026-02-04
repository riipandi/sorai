import { TanStackDevtools, type TanStackDevtoolsReactInit } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type AnyRouter, RouterProvider } from '@tanstack/react-router'
import type { LogType } from 'consola'
import type { Options as NuqsOptions } from 'nuqs'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import { Suspense, useEffect, useState } from 'react'
import { UIProvider } from '#/components/provider'
import { Toast } from '#/components/toast'
import { AuthProvider } from '#/guards'
import type { GlobalContext } from '#/routes/__root'
import { authStore } from '#/stores'

interface AppProps {
  basePath?: string
  apiUrl: string
  logLevel?: LogType
  queryClient: QueryClient
  routes: AnyRouter
  devTools?: Partial<TanStackDevtoolsReactInit>
  nuqsOptions?: Partial<
    Pick<NuqsOptions, 'shallow' | 'clearOnDefault' | 'scroll' | 'limitUrlUpdates'>
  >
}

export default function App(props: AppProps) {
  // Define the global router context to be passed to all routes.
  // Use state to make context reactive to store changes
  const [routerContext, setRouterContext] = useState<GlobalContext>({
    queryClient: props.queryClient,
    auth: authStore.get()
  })

  // Listen to auth store changes and update context
  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setRouterContext((prev) => ({ ...prev, auth: authStore.get() }))
    })

    return unsubscribe
  }, [])

  return (
    <NuqsAdapter defaultOptions={props.nuqsOptions}>
      <UIProvider direction='ltr'>
        <QueryClientProvider client={props.queryClient}>
          <AuthProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <RouterProvider
                router={props.routes}
                context={routerContext}
                basepath={props.basePath}
              />
            </Suspense>
            <TanStackDevtools {...props.devTools} />
            <Toast showCloseButton position='bottom-right' />
          </AuthProvider>
        </QueryClientProvider>
      </UIProvider>
    </NuqsAdapter>
  )
}
