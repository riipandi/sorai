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
import * as React from 'react'
import { clx } from '#/utils'

export const inputGroupStyles = cva(
  [
    'relative flex flex-wrap transition-all',
    '[&>input,&>[role="combobox"],textarea]:flex-1',
    '[&>input,&>[role="combobox"],textarea]:bg-transparent',
    '[&>input,&>[role="combobox"],textarea]:ring-0',
    '[&>input,&>[role="combobox"],textarea]:shadow-none',
    '[&>input,&>[role="combobox"],textarea]:focus:ring-0',
    'has-[>[data-align^="block"]]:flex-col'
  ],
  {
    variants: {
      variant: {
        default: 'bg-input',
        subtle: 'bg-input/60',
        plain: 'bg-transparent focus:outline-none'
      }
    },
    compoundVariants: [
      {
        variant: ['default', 'subtle'],
        className: [
          'ring-input-border hover:ring-input-accent-border shadow-input rounded ring',
          '[&:has(>input:focus),&:has(>[role="combobox"]:focus),&:has(textarea:focus)]:ring-primary',
          '[&:has(>input:focus),&:has(>[role="combobox"]:focus),&:has(textarea:focus)]:ring-2'
        ]
      }
    ],
    defaultVariants: {
      variant: 'default'
    }
  }
)

export function InputGroup({
  className,
  children,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupStyles>) {
  return (
    <div
      data-slot='input-group'
      className={clx(inputGroupStyles({ variant, className }))}
      {...props}
    >
      {children}
    </div>
  )
}

export const inputGroupAddonStyles = cva(
  [
    'flex shrink-0 items-center gap-1.5',
    '[&_svg:not([class*=text-])]:text-dimmed [&_svg:not([class*=size-])]:size-4',
    '[&_[role="combobox"]]:not-focus:ring-0',
    '[&_[role="combobox"]]:not-focus:ring-transparent',
    '[&_[role="combobox"]]:shadow-none',
    '[&.items-start,&.items-end]:py-3'
  ],
  {
    variants: {
      align: {
        start: 'not-[:has(>[role="combobox"])]:pl-2.5',
        end: 'not-[:has(>[role="combobox"])]:pr-2.5',
        'block-start': 'px-3.5 pt-3.5',
        'block-end': 'px-3.5 pb-3.5'
      }
    },
    compoundVariants: [
      {
        align: ['start', 'end'],
        className: [
          '[&_button:not([role="combobox"])]:h-7 [&_button:not([role="combobox"])]:px-2',
          'has-[>button:not([role="combobox"])]:-mx-1'
        ]
      }
    ],
    defaultVariants: {
      align: 'start'
    }
  }
)

export function InputGroupAddon({
  className,
  align,
  render,
  ...props
}: useRender.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonStyles>) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      'data-slot': 'input-group-addon',
      'data-align': align,
      className: clx(inputGroupAddonStyles({ align, className })),
      ...props
    }
  })
}

export function InputGroupText({ className, children, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot='input-group-text'
      className={clx(
        'text-muted inline-flex items-center gap-1.5 select-none',
        '[&_svg:not([class*=text-])]:text-dimmed [&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
