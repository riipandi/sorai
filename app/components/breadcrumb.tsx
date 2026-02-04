/**
 * A navigation component that displays the user's location within a website hierarchy.
 *
 * Anatomy:
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbButton />
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *   </BreadcrumbList>
 * </Breadcrumb>
 */

import { useRender } from '@base-ui/react/use-render'
import * as React from 'react'
import { clx, tv, type VariantProps } from '#/utils/variant'

const breadcrumbVariants = tv({
  slots: {
    list: 'flex flex-wrap items-center gap-1 wrap-break-word',
    item: 'group/breadcrumb-item inline-flex items-center gap-1',
    button:
      'hover:not-data-disabled:text-foreground outline-primary transition-colors focus:outline-0 focus-visible:outline-2 focus-visible:outline-offset-2',
    separator: 'text-muted [&>svg]:size-3.5',
    ellipsis:
      'text-muted group-hover/breadcrumb-item:text-foreground flex size-8 items-center justify-center'
  },
  variants: {
    active: {
      true: {
        button: 'text-foreground pointer-events-none font-medium'
      },
      false: {
        button: 'text-muted cursor-pointer'
      }
    }
  }
})

export function Breadcrumb({ ...props }: React.ComponentProps<'nav'>) {
  return <nav aria-label='breadcrumb' data-slot='breadcrumb' {...props} />
}

export function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  const styles = breadcrumbVariants()
  return <ol data-slot='breadcrumb-list' className={styles.list({ className })} {...props} />
}

export function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  const styles = breadcrumbVariants()
  return <li data-slot='breadcrumb-item' className={styles.item({ className })} {...props} />
}

export function BreadcrumbButton({
  active,
  className,
  render,
  ...props
}: useRender.ComponentProps<'button'> & VariantProps<typeof breadcrumbVariants>) {
  const styles = breadcrumbVariants({ active: active ?? false })
  return useRender({
    defaultTagName: 'button',
    render,
    props: {
      'data-slot': 'breadcrumb-button',
      'aria-current': active ? 'page' : undefined,
      'aria-disabled': active ? true : undefined,
      'data-active': active ? true : undefined,
      type: render ? undefined : 'button',
      tabIndex: active ? -1 : undefined,
      className: clx(styles.button(), className),
      ...props
    }
  })
}

export function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<'li'>) {
  const styles = breadcrumbVariants()
  return (
    <li
      data-slot='breadcrumb-separator'
      role='presentation'
      aria-hidden='true'
      className={styles.separator({ className })}
      {...props}
    >
      {children ?? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='m9 18 6-6-6-6' />
        </svg>
      )}
    </li>
  )
}

export function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  const styles = breadcrumbVariants()
  return (
    <span
      data-slot='breadcrumb-ellipsis'
      role='presentation'
      aria-hidden='true'
      className={styles.ellipsis({ className })}
      {...props}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='size-4'
      >
        <circle cx='12' cy='12' r='1' />
        <circle cx='19' cy='12' r='1' />
        <circle cx='5' cy='12' r='1' />
      </svg>
    </span>
  )
}
