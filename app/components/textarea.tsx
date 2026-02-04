/**
 * A multiline text input component that auto-adjusts its height based on content.
 *
 * Anatomy:
 * <Textarea />
 */

import { Field as FieldPrimitive } from '@base-ui/react/field'
import { mergeProps } from '@base-ui/react/merge-props'
import * as React from 'react'
import { clx, tv, type VariantProps } from '#/utils/variant'

export const textareaStyles = tv({
  base: [
    'text-foreground placeholder:text-dimmed shadow-input w-full rounded px-3 py-3 transition-[border-color,box-shadow] placeholder:tracking-wide',
    'ring-input-border hover:not-[[disabled],[data-disabled]]:not-focus:ring-input-accent-border focus:ring-primary min-h-20 ring focus:ring-2 focus:outline-0',
    'disabled:cursor-not-allowed disabled:opacity-70',
    'field-sizing-content'
  ],
  variants: {
    variant: {
      default: 'bg-input',
      subtle: 'bg-input/60'
    },
    size: {
      sm: 'min-h-16 px-2.5 py-2',
      md: 'min-h-20 px-3 py-3',
      lg: 'min-h-24 px-3.5 py-3'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'md'
  }
})

export type TextareaProps = React.ComponentProps<'textarea'> & VariantProps<typeof textareaStyles>

export function Textarea({ className, variant, size, ...props }: TextareaProps) {
  const styles = textareaStyles({ variant, size })

  return (
    <FieldPrimitive.Control
      render={(renderProps) => (
        <textarea
          data-slot='textarea'
          className={clx(styles, className)}
          {...mergeProps(renderProps, props)}
        />
      )}
    />
  )
}
