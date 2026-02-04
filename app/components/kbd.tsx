/**
 * A keyboard shortcut indicator for displaying key combinations.
 *
 * Anatomy:
 * <Kbd>
 *   <KbdGroup />
 * </Kbd>
 */

import { clx, tv, type VariantProps } from '#/utils/variant'

export const kbdStyles = tv({
  base: [
    'inline-flex h-5 min-w-5 items-center justify-center gap-0.5 px-1.5',
    'ring-kbd-border rounded-sm text-base font-medium ring'
  ],
  variants: {
    variant: {
      default: 'bg-kbd text-kbd-foreground shadow inset-shadow-2xs inset-shadow-white/15',
      outline: 'ring-kbd-border text-kbd-foreground ring',
      plain: 'ring-0'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export type KbdProps = React.ComponentProps<'kbd'> & VariantProps<typeof kbdStyles>

export function Kbd({ variant, className, ...props }: KbdProps) {
  const styles = kbdStyles({ variant })
  return <kbd data-slot='kbd' {...props} className={clx(styles, className)} />
}

export type KbdGroupProps = React.ComponentProps<'div'>

export function KbdGroup({ className, ...props }: KbdGroupProps) {
  return (
    <div data-slot='kbd-group' {...props} className={clx('flex items-center gap-1', className)} />
  )
}
