/**
 * A compact interactive element for displaying and filtering content.
 *
 * Anatomy:
 * <Chip>
 *   <ChipButton />
 * </Chip>
 */

import { useRender } from '@base-ui/react/use-render'
import { clx, tv, type VariantProps } from '#/utils/variant'

export const chipStyles = tv({
  base: 'inline-flex items-center text-base font-medium ring',
  slots: {
    button:
      'cursor-pointer opacity-60 transition-opacity hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-30'
  },
  variants: {
    variant: {
      default: 'bg-chip ring-chip-border text-foreground',
      primary: 'bg-primary ring-primary text-primary-foreground',
      outline: 'ring-chip-border text-foreground',
      plain: 'text-foreground bg-transparent ring-transparent'
    },
    size: {
      sm: 'h-4.5 gap-1 rounded-sm px-1.5 text-sm [&_svg:not([class*=size-])]:size-3',
      md: 'h-6 gap-1.5 rounded-sm px-1.5 [&_svg:not([class*=size-])]:size-3.5',
      lg: 'h-7 gap-2 rounded-sm px-2 [&_svg:not([class*=size-])]:size-4'
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

export type ChipProps = useRender.ComponentProps<'div'> & VariantProps<typeof chipStyles>
export type ChipButtonProps = useRender.ComponentProps<'button'>

export function Chip({ render, variant, size, pill, className, ...props }: ChipProps) {
  const styles = chipStyles({ variant, size, pill })
  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      'data-slot': 'chip',
      className: clx(styles.base(), className),
      ...props
    }
  })
}

export function ChipButton({ className, ...props }: ChipButtonProps) {
  const styles = chipStyles()
  return <button data-slot='chip-button' className={clx(styles.button(), className)} {...props} />
}
