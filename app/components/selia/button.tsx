/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Button as BaseButton } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { clx } from '#/utils'

export const buttonStyles = cva(
  [
    'relative cursor-pointer font-medium select-none',
    'inline-flex items-center justify-center gap-2.5 transition-colors',
    'after:absolute after:inset-0 after:bg-white/15 after:opacity-0 hover:not-[[data-disabled]]:after:opacity-100',
    'after:transition-opacity active:not-[[data-disabled]]:after:opacity-100 data-popup-open:after:opacity-100',
    'focus:outline-0 focus-visible:outline-2 focus-visible:outline-offset-2',
    'before:bg-spinner before:-mr-7 before:size-4.5 before:scale-20 before:opacity-0 before:transition-[opacity,scale,margin-right]',
    '[&>svg]:opacity-100 [&>svg]:transition-[opacity,scale,margin-right] [&>svg:not([class*=text-])]:text-current',
    'data-disabled:cursor-not-allowed data-disabled:opacity-70'
  ],
  {
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
          'ring-border hover:not-[[data-disabled]]:bg-accent data-popup-open:bg-accent active:not-[[data-disabled]]:bg-accent ring',
          'outline-primary after:content-none'
        ],
        plain: [
          'text-foreground hover:not-[[data-disabled]]:bg-accent data-popup-open:bg-accent active:not-[[data-disabled]]:bg-accent',
          'outline-primary after:content-none'
        ]
      },
      size: {
        xs: 'h-7 gap-1.5 rounded-sm px-2 before:-mr-6 after:rounded-sm [&>svg:not([class*=size-])]:size-4',
        'xs-icon': 'size-7.5 rounded-sm after:rounded-sm [&>svg:not([class*=size-])]:size-4',
        sm: 'h-8.5 rounded px-3 after:rounded [&>svg:not([class*=size-])]:size-4.5',
        'sm-icon': 'size-8.5 rounded after:rounded [&>svg:not([class*=size-])]:size-4.5',
        md: 'h-9.5 rounded px-4 [&>svg:not([class*=size-])]:size-4.5',
        icon: 'size-9.5 rounded [&>svg:not([class*=size-])]:size-4.5',
        lg: 'h-11.5 rounded-lg px-5.5 after:rounded-lg [&>svg:not([class*=size-])]:size-4.5',
        'lg-icon': 'size-11.5 rounded-lg after:rounded-lg [&>svg:not([class*=size-])]:size-4.5'
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
        className: 'before:bg-spinner-dark'
      },
      {
        size: 'xs',
        progress: true,
        className: 'before:size-4 [&>svg]:-mr-6'
      },
      {
        size: 'sm',
        progress: true,
        className: 'before:size-4.5'
      }
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

export function Button({
  variant,
  size,
  pill,
  progress,
  block,
  className,
  ...props
}: React.ComponentProps<typeof BaseButton> & VariantProps<typeof buttonStyles>) {
  return (
    <BaseButton
      data-slot='button'
      data-size={size}
      focusableWhenDisabled
      {...props}
      className={clx(buttonStyles({ variant, size, pill, progress, block, className }))}
    />
  )
}
