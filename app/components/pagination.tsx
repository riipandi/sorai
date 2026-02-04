/**
 * A navigation component for paginating through lists of items.
 *
 * Anatomy:
 * <Pagination>
 *   <PaginationList>
 *     <PaginationItem>
 *       <PaginationButton />
 *     </PaginationItem>
 *   </PaginationList>
 * </Pagination>
 */

import { useRender } from '@base-ui/react/use-render'
import { clx, tv } from '#/utils/variant'
import { buttonStyles } from './button'

const paginationVariants = tv({
  base: 'flex justify-center',
  slots: {
    list: 'flex items-center gap-1.5',
    item: '',
    button: ''
  }
})

export type PaginationProps = React.ComponentProps<'nav'>

export function Pagination({ className, ...props }: PaginationProps) {
  const styles = paginationVariants()
  return (
    <nav
      data-slot='pagination'
      aria-label='Pagination'
      className={styles.base({ className })}
      {...props}
    />
  )
}

export function PaginationList({ className, children, ...props }: React.ComponentProps<'ul'>) {
  const styles = paginationVariants()
  return (
    <ul data-slot='pagination-list' className={styles.list({ className })} {...props}>
      {children}
    </ul>
  )
}

export function PaginationItem({ className, children, ...props }: React.ComponentProps<'li'>) {
  const styles = paginationVariants()
  return (
    <li data-slot='pagination-item' className={styles.item({ className })} {...props}>
      {children}
    </li>
  )
}

export function PaginationButton({
  active,
  disabled,
  render,
  className,
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
        buttonStyles({ variant: active ? 'outline' : 'plain' }),
        active && 'pointer-events-none',
        className
      ),
      ...props
    }
  })
}
