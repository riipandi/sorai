/**
 * A native fieldset element with an easily stylable legend.
 *
 * @see: https://base-ui.com/react/components/fieldset
 *
 * Anatomy:
 * <Fieldset.Root>
 *   <Fieldset.Legend />
 * </Fieldset.Root>
 */

import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset'
import * as React from 'react'
import { clx, tv } from '#/utils/variant'

const fieldsetVariants = tv({
  base: [
    'flex flex-col gap-0',
    '*:data-[slot=text]:text-muted *:data-[slot=text]:mb-4',
    '[&_[data-slot="field"]:not([data-layout="inline"])]:not-last:mb-4'
  ],
  slots: {
    legend: 'text-foreground mb-1.5 text-lg font-semibold'
  }
})

export type FieldsetRootProps = React.ComponentProps<typeof BaseFieldset.Root>
export type FieldsetLegendProps = React.ComponentProps<typeof BaseFieldset.Legend>

export function Fieldset({ className, ...props }: FieldsetRootProps) {
  const styles = fieldsetVariants()
  return (
    <BaseFieldset.Root data-slot='fieldset' className={clx(styles.base(), className)} {...props} />
  )
}

export function FieldsetLegend({ className, ...props }: FieldsetLegendProps) {
  const styles = fieldsetVariants()
  return (
    <BaseFieldset.Legend
      data-slot='fieldset-legend'
      className={clx(styles.legend(), className)}
      {...props}
    />
  )
}
