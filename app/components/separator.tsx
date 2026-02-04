/**
 * A simple element used for visual separation of content.
 *
 * @see: https://base-ui.com/react/components/separator
 *
 * Anatomy:
 * <Separator />
 */

import { Separator as BaseSeparator } from '@base-ui/react/separator'
import { clx, tv, type VariantProps } from '#/utils/variant'

export const separatorStyles = tv({
  base: 'bg-separator',
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'min-h-4.5 w-px'
    }
  },
  defaultVariants: {
    orientation: 'horizontal'
  }
})

export type SeparatorProps = React.ComponentProps<typeof BaseSeparator> &
  VariantProps<typeof separatorStyles>

export function Separator({ className, orientation, ...props }: SeparatorProps) {
  const styles = separatorStyles({ orientation })
  return <BaseSeparator data-slot='separator' className={clx(styles, className)} {...props} />
}
