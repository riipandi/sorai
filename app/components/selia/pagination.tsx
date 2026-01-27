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
import { buttonStyles } from './button'

export function Pagination({ ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      data-slot='pagination'
      aria-label='Pagination'
      {...props}
      className={clx('flex justify-center', props.className)}
    />
  )
}

export function PaginationList({ children, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul data-slot='pagination-list' className='flex items-center gap-1' {...props}>
      {children}
    </ul>
  )
}

export function PaginationItem({ children, ...props }: React.ComponentProps<'li'>) {
  return (
    <li data-slot='pagination-item' {...props}>
      {children}
    </li>
  )
}

export function PaginationButton({
  active,
  disabled,
  render,
  ...props
}: useRender.ComponentProps<'button'> & {
  active?: boolean
  disabled?: boolean
}) {
  return useRender({
    defaultTagName: 'button',
    render,
    props: {
      'data-slot': 'pagination-button',
      'aria-current': active ? 'page' : undefined,
      'aria-disabled': disabled ? true : undefined,
      'data-disabled': disabled ? true : undefined,
      className: clx(
        buttonStyles({
          variant: active ? 'secondary' : 'plain'
        }),
        active && 'pointer-events-none',
        props.className
      ),
      ...props
    }
  })
}
