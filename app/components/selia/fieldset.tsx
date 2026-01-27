/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset'
import * as React from 'react'
import { clx } from '#/utils'

export function Fieldset({ className, ...props }: React.ComponentProps<typeof BaseFieldset.Root>) {
  return (
    <BaseFieldset.Root
      data-slot='fieldset'
      className={clx(
        'flex flex-col gap-0',
        '*:data-[slot=text]:text-muted',
        '*:data-[slot=text]:mb-6',
        '[&_[data-slot="field"]:not([data-layout="inline"])]:not-last:mb-6',
        className
      )}
      {...props}
    />
  )
}

export function FieldsetLegend({
  className,
  ...props
}: React.ComponentProps<typeof BaseFieldset.Legend>) {
  return (
    <BaseFieldset.Legend
      data-slot='fieldset-legend'
      className={clx('text-foreground mb-2 text-lg font-semibold', className)}
      {...props}
    />
  )
}
