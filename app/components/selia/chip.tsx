/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'
import { clx } from '#/utils'

export const chipStyles = cva('inline-flex items-center font-medium ring', {
  variants: {
    variant: {
      default: 'bg-chip ring-chip-border text-foreground',
      primary: 'bg-primary ring-primary text-primary-foreground',
      outline: 'ring-chip-border text-foreground',
      plain: 'text-foreground bg-transparent ring-transparent'
    },
    size: {
      sm: 'h-5 gap-1 rounded-sm px-1.5 text-sm [&_svg:not([class*=size-])]:size-3.5',
      md: 'h-6.5 gap-2 rounded-sm px-2 [&_svg:not([class*=size-])]:size-4',
      lg: 'h-7.5 gap-3 rounded-sm px-2.5 [&_svg:not([class*=size-])]:size-4.5'
    },
    pill: {
      true: 'rounded-full'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'md'
  }
})

export function Chip({
  render,
  variant,
  size,
  pill,
  className,
  ...props
}: useRender.ComponentProps<'div'> & VariantProps<typeof chipStyles>) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      'data-slot': 'chip',
      className: clx(chipStyles({ variant, size, pill, className })),
      ...props
    }
  })
}

export function ChipButton({ ...props }: useRender.ComponentProps<'button'>) {
  return (
    <button
      data-slot='chip-button'
      className='cursor-pointer opacity-60 transition-opacity hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-30'
      {...props}
    />
  )
}
