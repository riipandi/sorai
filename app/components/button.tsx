/**
 * A button component that can be rendered as another HTML tag while remaining keyboard accessible.
 *
 * @see: https://base-ui.com/react/components/button
 *
 * Anatomy:
 * <Button />
 */

import { Button as BaseButton, type ButtonProps as BaseButtonProps } from '@base-ui/react/button'
import { clx, tv, type VariantProps } from '#/utils/variant'

export const buttonStyles = tv({
  base: [
    'relative cursor-pointer font-medium select-none',
    'inline-flex items-center justify-center gap-2 transition-colors',
    'after:absolute after:inset-0 after:bg-white/15 after:opacity-0 hover:not-data-disabled:after:opacity-100',
    'after:transition-opacity active:not-data-disabled:after:opacity-100 data-popup-open:after:opacity-100',
    'focus:outline-0 focus-visible:outline-2 focus-visible:outline-offset-2',
    'before:bg-spinner before:-mr-6 before:size-4 before:scale-20 before:opacity-0 before:transition-[opacity,scale,margin-right]',
    '[&>svg]:opacity-100 [&>svg]:transition-[opacity,scale,margin-right] [&>svg:not([class*=text-])]:text-current',
    'data-disabled:cursor-not-allowed data-disabled:opacity-70'
  ],
  variants: {
    variant: {
      primary: [
        'bg-primary text-primary-foreground',
        'ring-primary-border ring',
        'shadow inset-shadow-2xs inset-shadow-white/15',
        'outline-primary after:rounded'
      ],
      secondary: [
        'bg-secondary text-secondary-foreground',
        'ring-secondary-border ring',
        'shadow inset-shadow-2xs inset-shadow-white/15',
        'outline-secondary after:rounded'
      ],
      tertiary: [
        'bg-tertiary text-tertiary-foreground',
        'ring-tertiary-border ring',
        'inset-shadow-background/15 shadow inset-shadow-2xs',
        'after:bg-background/10 focus-visible:outline-tertiary after:rounded'
      ],
      danger: [
        'bg-danger text-danger-foreground',
        'ring-danger-border ring',
        'shadow inset-shadow-2xs inset-shadow-white/15',
        'outline-danger after:rounded'
      ],
      outline: [
        'text-foreground shadow',
        'ring-border hover:not-data-disabled:bg-accent data-popup-open:bg-accent active:not-data-disabled:bg-accent ring',
        'outline-primary after:content-none'
      ],
      plain: [
        'text-foreground hover:not-data-disabled:bg-accent data-popup-open:bg-accent active:not-data-disabled:bg-accent',
        'outline-primary after:content-none'
      ]
    },
    size: {
      xs: 'h-6.5 gap-1 rounded-sm px-2 text-sm before:-mr-5 after:rounded-sm [&>svg:not([class*=size-])]:size-3.5',
      sm: 'h-8 rounded px-2.5 after:rounded [&>svg:not([class*=size-])]:size-4',
      md: 'h-9 rounded px-3.5 [&>svg:not([class*=size-])]:size-4',
      lg: 'h-11 rounded-lg px-5 after:rounded-lg [&>svg:not([class*=size-])]:size-4',
      icon: 'size-9 rounded [&>svg:not([class*=size-])]:size-4',
      'icon-lg': 'size-11 rounded-lg after:rounded-lg [&>svg:not([class*=size-])]:size-4',
      'icon-xs': 'size-7 rounded-sm after:rounded-sm [&>svg:not([class*=size-])]:size-3.5',
      'icon-sm': 'size-8 rounded after:rounded [&>svg:not([class*=size-])]:size-4'
    },
    pill: {
      true: 'rounded-full after:rounded-full'
    },
    block: {
      true: 'w-full'
    },
    progress: {
      true: [
        'pointer-events-none cursor-progress opacity-70 [&>svg]:-mr-7 [&>svg]:scale-0 [&>svg]:opacity-0',
        'before:bg-spinner before:mr-0 before:size-4.5 before:scale-100 before:animate-spin before:opacity-100'
      ]
    }
  },
  compoundVariants: [
    {
      variant: 'tertiary',
      progress: true,
      class: 'before:bg-spinner-dark'
    },
    {
      size: 'xs',
      progress: true,
      class: 'before:size-3.5 [&>svg]:-mr-5'
    },
    {
      size: 'sm',
      progress: true,
      class: 'before:size-4'
    }
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
})

export type ButtonProps = BaseButtonProps & VariantProps<typeof buttonStyles>

export function Button({ variant, size, pill, progress, block, className, ...props }: ButtonProps) {
  const styles = buttonStyles({ variant, size, pill, progress, block })
  return (
    <BaseButton
      data-slot='button'
      data-size={size}
      className={clx(styles, className)}
      focusableWhenDisabled
      {...props}
    />
  )
}
