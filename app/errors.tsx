import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { type ErrorComponentProps, useCanGoBack, useRouter } from '@tanstack/react-router'
import * as React from 'react'

export function NotFound() {
  const router = useRouter()
  const canGoBack = useCanGoBack()

  const handleBack = () => {
    if (canGoBack) {
      router.history.back()
    } else {
      router.navigate({ href: '/' })
    }
  }

  return (
    <>
      <title>404 Not Found</title>
      <div className='relative flex min-h-screen flex-col items-center justify-center bg-gray-50'>
        <div className='absolute inset-0 bg-linear-to-b from-gray-100 via-transparent to-transparent' />
        <div className='pointer-events-none fixed inset-0 z-10 flex items-center justify-center select-none'>
          <h2 className='text-[12rem] font-black text-red-900/10 mix-blend-overlay sm:text-[16rem] md:text-[20rem]'>
            404
          </h2>
        </div>
        <div className='relative z-20 px-4 py-16 text-center sm:px-6 lg:px-8'>
          <p className='text-2xl font-bold text-red-600'>404</p>
          <h1 className='mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
            Page not found
          </h1>
          <p className='mt-6 text-base leading-7 font-medium text-gray-500'>
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-4'>
            <button
              type='button'
              onClick={handleBack}
              className='min-w-35 cursor-pointer rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700'
            >
              Go back
            </button>
            <a
              href='https://tanstack.com/router/latest/docs'
              className='min-w-35 rounded-md border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-200'
              rel='noopener noreferrer'
              target='_blank'
            >
              Docs
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export function ErrorGeneral({ error }: ErrorComponentProps) {
  const router = useRouter()
  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  React.useEffect(() => {
    queryErrorResetBoundary.reset()
  }, [queryErrorResetBoundary])

  return (
    <div className='flex min-h-full flex-1 items-center justify-center bg-gray-50'>
      <div className='w-full max-w-md rounded-lg border border-red-200 bg-white px-8 py-6 text-center shadow-md'>
        <h2 className='mb-2 text-xl font-semibold text-red-600'>Something went wrong</h2>
        <p className='mb-4 text-sm text-gray-500'>{error.message}</p>
        <button
          type='button'
          onClick={() => router.invalidate()}
          className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700'
        >
          Retry
        </button>
      </div>
    </div>
  )
}
