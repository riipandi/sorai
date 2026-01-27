/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Progress as BaseProgress } from '@base-ui/react/progress'
import { clx } from '#/utils'

export function Progress({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseProgress.Root>) {
  return (
    <BaseProgress.Root
      data-slot='progress'
      {...props}
      className={clx('flex flex-wrap justify-between gap-1.5', className)}
    >
      {children}
      <BaseProgress.Track className='bg-track h-1.5 w-full rounded-full'>
        <BaseProgress.Indicator className='bg-primary rounded-full transition-all duration-500' />
      </BaseProgress.Track>
    </BaseProgress.Root>
  )
}

export function ProgressLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseProgress.Label>) {
  return (
    <BaseProgress.Label
      data-slot='progress-label'
      {...props}
      className={clx('text-foreground font-medium', className)}
    />
  )
}

export function ProgressValue({
  className,
  ...props
}: React.ComponentProps<typeof BaseProgress.Value>) {
  return (
    <BaseProgress.Value
      data-slot='progress-value'
      {...props}
      className={clx('text-dimmed text-sm', className)}
    />
  )
}
