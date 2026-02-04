/**
 * Text components for displaying headings, paragraphs, links, and code.
 *
 * Anatomy:
 * <Heading />
 * <Text />
 * <TextLink />
 * <Strong />
 * <Code />
 */

import { useRender } from '@base-ui/react/use-render'
import * as React from 'react'
import { tv, type VariantProps } from '#/utils/variant'

export const headingStyles = tv({
  base: 'text-foreground',
  variants: {
    size: {
      xs: 'text-base font-semibold',
      sm: 'text-xl font-semibold',
      md: 'text-3xl font-semibold',
      lg: 'text-4xl font-bold',
      xl: 'text-6xl font-bold'
    }
  },
  defaultVariants: {
    size: 'lg'
  }
})

export const textStyles = tv({
  base: [
    'text-foreground text-base leading-relaxed tracking-normal',
    'has-[svg]:inline-flex has-[svg]:items-center has-[svg]:gap-1.5',
    '[&_svg:not([class*=size-])]:size-3 *:[svg]:shrink-0'
  ]
})

export const textLinkStyles = tv({
  base: 'text-foreground hover:text-primary underline transition-all'
})

export const strongStyles = tv({
  base: 'text-foreground font-semibold'
})

export const codeStyles = tv({
  base: 'text-foreground font-mono text-base before:content-["`"] after:content-["`"]'
})

export type HeadingProps = useRender.ComponentProps<'h1'> &
  VariantProps<typeof headingStyles> & {
    level?: 1 | 2 | 3 | 4 | 5 | 6
  }

export function Heading({ level = 1, size, className, render, ...props }: HeadingProps) {
  const levelMap: Record<string, number> = {
    xl: 1,
    lg: 2,
    md: 3,
    sm: 4,
    xs: 5
  }

  const selectedLevel = levelMap[size || 'lg'] || level

  return useRender({
    defaultTagName: `h${selectedLevel}` as keyof React.JSX.IntrinsicElements,
    render,
    props: {
      'data-slot': 'heading',
      'data-level': level,
      className: headingStyles({ size, className }),
      ...props
    }
  })
}

export type TextProps = useRender.ComponentProps<'p'>

export function Text({ className, render, ...props }: TextProps) {
  return useRender({
    defaultTagName: 'p',
    render,
    props: {
      'data-slot': 'text',
      className: textStyles({ className }),
      ...props
    }
  })
}

export type TextLinkProps = useRender.ComponentProps<'a'>

export function TextLink({ className, render, ...props }: TextLinkProps) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: {
      className: textLinkStyles({ className }),
      'data-slot': 'text-link',
      ...props
    }
  })
}

export type StrongProps = React.ComponentProps<'strong'>

export function Strong({ className, ...props }: StrongProps) {
  return <strong data-slot='text-strong' className={strongStyles({ className })} {...props} />
}

export type CodeProps = React.ComponentProps<'code'>

export function Code({ className, ...props }: CodeProps) {
  return <code data-slot='text-code' className={codeStyles({ className })} {...props} />
}
