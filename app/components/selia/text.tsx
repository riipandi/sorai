/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { useRender } from '@base-ui/react/use-render'
import { clx } from '#/utils'

export function Text({ className, render, ...props }: useRender.ComponentProps<'p'>) {
  return useRender({
    defaultTagName: 'p',
    render,
    props: {
      'data-slot': 'text',
      className: clx(
        'text-foreground text-base/6',
        'has-[svg]:inline-flex has-[svg]:items-center has-[svg]:gap-2',
        '[&_svg:not([class*=size-])]:size-3 *:[svg]:shrink-0',
        className
      ),
      ...props
    }
  })
}

export function TextLink({ className, render, ...props }: useRender.ComponentProps<'a'>) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: {
      className: clx('text-foreground hover:text-primary transition-all', className),
      'data-slot': 'text-link',
      ...props
    }
  })
}

export function Strong({ className, ...props }: React.ComponentProps<'strong'>) {
  return (
    <strong
      data-slot='text-strong'
      className={clx('text-foreground font-semibold', className)}
      {...props}
    />
  )
}

export function Code({ className, ...props }: React.ComponentProps<'code'>) {
  return (
    <code
      data-slot='text-code'
      className={clx(
        'text-foreground font-mono text-sm before:content-["`"] after:content-["`"]',
        className
      )}
      {...props}
    />
  )
}
