/**
 * A numeric input element with increment and decrement buttons, and a scrub area.
 *
 * @see: https://base-ui.com/react/components/number-field
 *
 * Anatomy:
 * <NumberField.Root>
 *   <NumberField.ScrubArea>
 *     <NumberField.ScrubAreaCursor />
 *   </NumberField.ScrubArea>
 *   <NumberField.Group>
 *     <NumberField.Decrement />
 *     <NumberField.Input />
 *     <NumberField.Increment />
 *   </NumberField.Group>
 * </NumberField.Root>
 */

import { NumberField as BaseNumberField } from '@base-ui/react/number-field'
import { clx, tv, type VariantProps } from '#/utils/variant'

const numberFieldVariants = tv({
  base: [
    'flex flex-col items-start gap-2',
    'data-disabled:cursor-not-allowed data-disabled:opacity-70'
  ],
  slots: {
    scrubArea: 'cursor-ew-resize',
    group: [
      'flex h-9 rounded',
      'hover:not-focus-within:not-data-disabled:ring-input-accent-border',
      'focus-within:ring-primary focus-within:ring-2 focus-within:outline-0',
      '[&_svg:not([class*=size-])]:size-4',
      '*:[button]:flex *:[button]:size-9 *:[button]:items-center *:[button]:justify-center',
      '*:[button]:transition-all *:[button]:duration-100',
      '*:[button]:text-foreground *:[button]:cursor-pointer',
      '*:[button]:disabled:cursor-not-allowed *:[button]:disabled:opacity-70',
      '*:first:rounded-l *:last:rounded-r'
    ],
    decrement: '',
    input: [
      'z-10 w-16 px-2 text-center outline-none',
      'text-foreground placeholder:text-dimmed transition-all',
      'disabled:pointer-events-none disabled:opacity-70'
    ],
    increment: ''
  },
  variants: {
    variant: {
      default: {
        group:
          'ring-input-border bg-input shadow-input *:[button]:hover:not-[[disabled]]:bg-accent ring'
      },
      plain: {
        group: 'hover:bg-accent bg-transparent'
      }
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export type NumberFieldProps = React.ComponentProps<typeof BaseNumberField.Root> &
  VariantProps<typeof numberFieldVariants>

export function NumberField({ className, ...props }: NumberFieldProps) {
  const styles = numberFieldVariants()
  return (
    <BaseNumberField.Root
      data-slot='number-field'
      className={clx(styles.base(), className)}
      {...props}
    />
  )
}

export function NumberFieldScrubArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseNumberField.ScrubArea>) {
  const styles = numberFieldVariants()
  return (
    <BaseNumberField.ScrubArea
      data-slot='number-field-scrub-area'
      className={clx(styles.scrubArea(), className)}
      {...props}
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

export type NumberFieldGroupProps = React.ComponentProps<typeof BaseNumberField.Group> &
  VariantProps<typeof numberFieldVariants>

export function NumberFieldGroup({ className, variant, ...props }: NumberFieldGroupProps) {
  const styles = numberFieldVariants({ variant })
  return (
    <BaseNumberField.Group
      data-slot='number-field-group'
      className={clx(styles.group(), className)}
      {...props}
    />
  )
}

export function NumberFieldDecrement({
  className,
  ...props
}: React.ComponentProps<typeof BaseNumberField.Decrement>) {
  const styles = numberFieldVariants()
  return (
    <BaseNumberField.Decrement
      data-slot='number-field-decrement'
      className={clx(styles.decrement(), className)}
      {...props}
    />
  )
}

export function NumberFieldIncrement({
  className,
  ...props
}: React.ComponentProps<typeof BaseNumberField.Increment>) {
  const styles = numberFieldVariants()
  return (
    <BaseNumberField.Increment
      data-slot='number-field-increment'
      className={clx(styles.increment(), className)}
      {...props}
    />
  )
}

export function NumberFieldInput({
  className,
  ...props
}: React.ComponentProps<typeof BaseNumberField.Input>) {
  const styles = numberFieldVariants()
  return (
    <BaseNumberField.Input
      data-slot='number-field-input'
      className={clx(styles.input(), className)}
      {...props}
    />
  )
}
