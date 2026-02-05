/**
 * A container for grouping inputs with addons and text.
 *
 * Anatomy:
 * <InputGroup>
 *   <InputGroupAddon>
 *     <InputGroupText />
 *   </InputGroupAddon>
 *   <input />
 * </InputGroup>
 */

import { useRender } from '@base-ui/react/use-render'
import * as React from 'react'
import { clx, tv, type VariantProps } from '#/utils/variant'

export const inputGroupVariants = tv({
  base: [
    'relative flex flex-wrap transition-all',
    '[&>input,&>[role="combobox"],textarea]:flex-1',
    '[&>input,&>[role="combobox"],textarea]:bg-transparent',
    '[&>input,&>[role="combobox"],textarea]:rounded-l-none',
    '[&>input,&>[role="combobox"],textarea]:ring-0',
    '[&>input,&>[role="combobox"],textarea]:shadow-none',
    '[&>input,&>[role="combobox"],textarea]:focus:ring-0',
    'has-[>[data-align^="block"]]:flex-col'
  ],
  slots: {
    addon: [
      'flex shrink-0 items-center gap-1.5',
      '[&_svg:not([class*=text-])]:text-dimmed [&_svg:not([class*=size-])]:size-3.5',
      '[&_[role="combobox"]]:not-focus:ring-0 [&_[role="combobox"]]:not-focus:ring-transparent',
      '[&_[role="combobox"]]:hover:not-data-disabled:bg-transparent',
      '[&_[role="combobox"]]:ml-0.5 [&_[role="combobox"]]:pr-2',
      '[&_[role="combobox"]]:shadow-none',
      '[&.items-start,&.items-end]:py-2.5 [&>button]:rounded-sm'
    ],
    text: [
      'text-muted inline-flex items-center gap-1 select-none',
      '[&_svg:not([class*=text-])]:text-dimmed [&_svg:not([class*=size-])]:size-3.5'
    ]
  },
  variants: {
    variant: {
      default: {
        base: [
          'bg-input ring-input-border hover:ring-input-accent-border shadow-input rounded ring',
          '[&:has(>input:focus),&:has(>[role="combobox"]:focus),&:has(textarea:focus)]:ring-primary',
          '[&:has(>input:focus),&:has(>[role="combobox"]:focus),&:has(textarea:focus)]:ring-2'
        ]
      },
      subtle: {
        base: [
          'bg-input/60 ring-input-border hover:ring-input-accent-border shadow-input rounded ring',
          '[&:has(>input:focus),&:has(>[role="combobox"]:focus),&:has(textarea:focus)]:ring-primary',
          '[&:has(>input:focus),&:has(>[role="combobox"]:focus),&:has(textarea:focus)]:ring-2'
        ]
      },
      plain: {
        base: 'bg-transparent focus:outline-none'
      }
    },
    align: {
      start: {
        addon: 'not-[:has(>[role="combobox"])]:pl-3 [&>button]:-ml-1'
      },
      end: {
        addon: 'not-[:has(>[role="combobox"])]:pr-3 [&>button]:-mr-1'
      },
      'block-start': {
        addon: 'px-3 pt-2.5'
      },
      'block-end': {
        addon: 'px-3 pb-2.5'
      }
    }
  },
  compoundVariants: [
    {
      align: ['start', 'end'],
      className: {
        addon: [
          '[&_button:not([role="combobox"])]:h-7 [&_button:not([role="combobox"])]:px-2',
          'has-[>button:not([role="combobox"])]:-mx-1'
        ]
      }
    },
    {
      align: ['start', 'block-start'],
      className: { addon: 'rounded-l' }
    },
    {
      align: ['end', 'block-end'],
      className: { addon: 'rounded-r' }
    }
  ],
  defaultVariants: {
    variant: 'default',
    align: 'start'
  }
})

export type InputGroupProps = React.ComponentProps<'div'> & VariantProps<typeof inputGroupVariants>

export function InputGroup({ className, children, variant, ...props }: InputGroupProps) {
  const styles = inputGroupVariants({ variant })
  return (
    <div data-slot='input-group' className={styles.base({ className })} {...props}>
      {children}
    </div>
  )
}

export type InputGroupAddonProps = useRender.ComponentProps<'div'> &
  VariantProps<typeof inputGroupVariants>

export function InputGroupAddon({
  className,
  align = 'start',
  render,
  ...props
}: InputGroupAddonProps) {
  const styles = inputGroupVariants({ align })
  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      'data-slot': 'input-group-addon',
      'data-align': align,
      className: clx(styles.addon(), className),
      ...props
    }
  })
}

export function InputGroupText({ className, children, ...props }: React.ComponentProps<'span'>) {
  const styles = inputGroupVariants()
  return (
    <span data-slot='input-group-text' className={styles.text({ className })} {...props}>
      {children}
    </span>
  )
}
