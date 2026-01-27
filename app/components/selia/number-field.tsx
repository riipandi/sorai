/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { NumberField as BaseNumberField } from '@base-ui/react/number-field'
import { cva, type VariantProps } from 'class-variance-authority'
import { clx } from '#/utils'

export function NumberField({
  className,
  ...props
}: React.ComponentProps<typeof BaseNumberField.Root>) {
  return (
    <BaseNumberField.Root
      data-slot='number-field'
      {...props}
      className={clx(
        'flex flex-col items-start gap-2',
        'data-disabled:cursor-not-allowed data-disabled:opacity-70',
        className
      )}
    />
  )
}

export function NumberFieldScrubArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseNumberField.ScrubArea>) {
  return (
    <BaseNumberField.ScrubArea
      data-slot='number-field-scrub-area'
      {...props}
      className={clx('cursor-ew-resize', className)}
    >
      {children}
      <NumberFieldScrubAreaCursor />
    </BaseNumberField.ScrubArea>
  )
}

export function NumberFieldScrubAreaCursor({
  ...props
}: React.ComponentProps<typeof BaseNumberField.ScrubAreaCursor>) {
  return (
    <BaseNumberField.ScrubAreaCursor data-slot='number-field-scrub-area-cursor' {...props}>
      <svg
        width='26'
        height='14'
        viewBox='0 0 24 14'
        fill='black'
        stroke='white'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z' />
      </svg>
    </BaseNumberField.ScrubAreaCursor>
  )
}

export const numberFieldGroupStyles = cva(
  [
    'flex h-9.5 rounded',
    'hover:not-[:focus-within]:not-[[data-disabled]]:ring-input-accent-border',
    'focus-within:ring-primary focus-within:ring-2 focus-within:outline-0',
    '[&_svg:not([class*=size-])]:size-4.5',
    '*:[button]:flex *:[button]:size-9.5 *:[button]:items-center *:[button]:justify-center',
    '*:[button]:transition-all *:[button]:duration-100',
    '*:[button]:text-foreground *:[button]:cursor-pointer',
    '*:[button]:disabled:cursor-not-allowed *:[button]:disabled:opacity-70',
    '*:first:rounded-l *:last:rounded-r'
  ],
  {
    variants: {
      variant: {
        default:
          'ring-input-border bg-input shadow-input *:[button]:hover:not-[[disabled]]:bg-accent ring',
        plain: 'hover:bg-accent bg-transparent'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export function NumberFieldGroup({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof BaseNumberField.Group> &
  VariantProps<typeof numberFieldGroupStyles>) {
  return (
    <BaseNumberField.Group
      data-slot='number-field-group'
      {...props}
      className={clx(numberFieldGroupStyles({ variant, className }))}
    />
  )
}

export function NumberFieldDecrement({
  className,
  ...props
}: React.ComponentProps<typeof BaseNumberField.Decrement>) {
  return (
    <BaseNumberField.Decrement
      data-slot='number-field-decrement'
      {...props}
      className={clx(className)}
    />
  )
}

export function NumberFieldIncrement({
  className,
  ...props
}: React.ComponentProps<typeof BaseNumberField.Increment>) {
  return (
    <BaseNumberField.Increment
      data-slot='number-field-increment'
      {...props}
      className={clx(className)}
    />
  )
}

export function NumberFieldInput({
  className,
  ...props
}: React.ComponentProps<typeof BaseNumberField.Input>) {
  return (
    <BaseNumberField.Input
      data-slot='number-field-input'
      {...props}
      className={clx(
        'z-10 w-20 px-2.5 text-center outline-none',
        'text-foreground placeholder:text-dimmed transition-all',
        'disabled:pointer-events-none disabled:opacity-70',
        className
      )}
    />
  )
}
