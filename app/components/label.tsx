/**
 * A form label component for associating text with form controls.
 *
 * Anatomy:
 * <Label />
 */

import { clx, tv } from '#/utils/variant'

export const labelStyles = tv({
  base: [
    'text-foreground flex items-center gap-2.5',
    'cursor-pointer has-[>[disabled],>[data-disabled]]:cursor-not-allowed'
  ]
})

export type LabelProps = React.ComponentProps<'label'>

export function Label({ className, ...props }: LabelProps) {
  const styles = labelStyles()
  return <label data-slot='label' className={clx(styles, className)} {...props} />
}
