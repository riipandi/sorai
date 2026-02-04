/**
 * An input component that can be used in forms.
 *
 * @see: https://base-ui.com/react/components/input
 *
 * Anatomy:
 * <Input />
 */

import { Input as BaseInput } from '@base-ui/react/input'
import * as React from 'react'
import { clx, tv, type VariantProps } from '#/utils/variant'

export const inputStyles = tv({
  base: [
    'text-foreground placeholder:text-dimmed shadow-input h-9 w-full rounded px-3 transition-[color,box-shadow]',
    'ring-input-border hover:not-data-disabled:not-focus:ring-input-accent-border focus:ring-primary ring focus:ring-2 focus:outline-0',
    '[&[type="file"]]:text-dimmed file:-ml-1 data-disabled:cursor-not-allowed data-disabled:opacity-70 [&[type="file"]]:py-1.5',
    'file:text-dimmed hover:file:text-muted hover:file:ring-input-accent-border file:ring-dimmed/60 hover:file:bg-dimmed/20 file:mr-2 file:h-5 file:bg-transparent',
    'file:rounded-xs file:px-1.5 file:text-xs file:font-medium file:tracking-tighter file:ring file:transition-all file:duration-150'
  ],
  variants: {
    variant: {
      default: 'bg-input',
      subtle: 'bg-input/60'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export type InputProps = React.ComponentProps<typeof BaseInput> & VariantProps<typeof inputStyles>

export function Input({ className, variant, ...props }: InputProps) {
  const styles = inputStyles({ variant })
  return <BaseInput data-slot='input' className={clx(styles, className)} {...props} />
}
