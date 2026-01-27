/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Switch as BaseSwitch } from '@base-ui/react/switch'
import { clx } from '#/utils'

export function Switch({ className, ...props }: React.ComponentProps<typeof BaseSwitch.Root>) {
  return (
    <BaseSwitch.Root
      data-slot='switch'
      className={clx(
        'flex h-5 w-9 cursor-pointer items-center rounded-full px-0.5',
        'ring-input-border bg-track ring inset-shadow-xs inset-shadow-black/10 dark:inset-shadow-none',
        'data-checked:bg-primary data-checked:ring-primary',
        'transition-colors duration-75',
        'focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2',
        'data-disabled:cursor-not-allowed data-disabled:opacity-70',
        className
      )}
      {...props}
    >
      <BaseSwitch.Thumb
        data-slot='switch-thumb'
        className={clx(
          'size-4 rounded-full bg-white shadow',
          'transition-transform duration-75 data-checked:translate-x-4'
        )}
      />
    </BaseSwitch.Root>
  )
}
