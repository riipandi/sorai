/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Menubar as BaseMenubar } from '@base-ui/react/menubar'
import { clx } from '#/utils'

export function Menubar({ className, ...props }: React.ComponentProps<typeof BaseMenubar>) {
  return (
    <BaseMenubar
      className={clx(
        'bg-background ring-card-border flex items-center rounded p-1 ring',
        className
      )}
      {...props}
    />
  )
}
