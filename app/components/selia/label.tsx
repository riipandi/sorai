/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { clx } from '#/utils'

export function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot='label'
      className={clx(
        'text-foreground flex items-center gap-3',
        'cursor-pointer has-[>[disabled],>[data-disabled]]:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
}
