/**
 * Text components for displaying headings, paragraphs, links, and code.
 *
 * Anatomy:
 * <Heading />
 * <Text />
 * <Lead />
 * <TextLink />
 * <Strong />
 * <Code />
 * <Blockquote />
 */

import { useRender } from '@base-ui/react/use-render'
import * as React from 'react'
import { tv, type VariantProps } from '#/utils/variant'

export const headingStyles = tv({
  base: 'text-foreground tracking-normal',
  variants: {
    size: {
      xs: 'text-base font-semibold',
      sm: 'scroll-m-20 text-2xl font-semibold',
      md: 'scroll-m-20 text-3xl font-semibold',
      lg: 'scroll-m-20 text-4xl font-semibold tracking-tight first:mt-0',
      xl: 'scroll-m-20 text-6xl font-extrabold text-balance'
    }
  },
  defaultVariants: {
    size: 'lg'
  }
})

export const textStyles = tv({
  base: [
    'text-foreground text-base leading-relaxed tracking-normal not-first:mt-1',
    'has-[svg]:inline-flex has-[svg]:items-center has-[svg]:gap-1.5',
    '[&_svg:not([class*=size-])]:size-3 *:[svg]:shrink-0'
  ]
})

export const leadStyles = tv({
  base: 'text-muted text-lg leading-relaxed not-first:mt-1'
})

export const textLinkStyles = tv({
  base: [
    'text-foreground hover:text-primary items-end text-base underline underline-offset-4',
    'inline-flex gap-0.5 transition-all [&_svg:not([class*=size-])]:size-5'
  ]
})

export const strongStyles = tv({
  base: 'text-foreground font-semibold'
})

export const blockquoteStyles = tv({
  base: 'text-muted border-border border-l-2 pl-6 text-base italic not-first:mt-1'
})

export const codeStyles = tv({
  base: [
    'bg-dimmed/20 rounded-xs px-1.5 py-1 font-semibold',
    'text-foreground font-mono text-xs tracking-tight'
    // 'before:content-["`"] after:content-["`"]'
  ]
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

export type LeadProps = useRender.ComponentProps<'p'>

export function Lead({ className, render, ...props }: LeadProps) {
  return useRender({
    defaultTagName: 'p',
    render,
    props: {
      'data-slot': 'text-lead',
      className: leadStyles({ className }),
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

export type BlockquoteProps = React.ComponentProps<'blockquote'>

export function Blockquote({ className, ...props }: BlockquoteProps) {
  return (
    <blockquote
      data-slot='text-blockquote'
      className={blockquoteStyles({ className })}
      {...props}
    />
  )
}

export type CodeProps = React.ComponentProps<'code'>

export function Code({ className, ...props }: CodeProps) {
  return <code data-slot='text-code' className={codeStyles({ className })} {...props} />
}
