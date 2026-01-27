/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Meter as BaseMeter } from '@base-ui/react/meter'
import { clx } from '#/utils'

export function Meter({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseMeter.Root>) {
  return (
    <BaseMeter.Root
      data-slot='meter'
      {...props}
      className={clx('flex flex-wrap justify-between gap-1.5', className)}
    >
      {children}
      <BaseMeter.Track className='bg-track h-1.5 w-full rounded-full'>
        <BaseMeter.Indicator className='bg-primary rounded-full transition-all duration-500' />
      </BaseMeter.Track>
    </BaseMeter.Root>
  )
}

export function MeterLabel({ className, ...props }: React.ComponentProps<typeof BaseMeter.Label>) {
  return (
    <BaseMeter.Label
      data-slot='meter-label'
      {...props}
      className={clx('text-foreground font-medium', className)}
    />
  )
}

export function MeterValue({ className, ...props }: React.ComponentProps<typeof BaseMeter.Value>) {
  return (
    <BaseMeter.Value
      data-slot='meter-value'
      {...props}
      className={clx('text-dimmed text-sm', className)}
    />
  )
}
