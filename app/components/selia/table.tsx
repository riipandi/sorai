/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { clx } from '#/utils'

export function Table({ ...props }: React.ComponentProps<'table'>) {
  return (
    <table
      data-slot='table'
      {...props}
      className={clx('text-table-foreground w-full text-left', props.className)}
    />
  )
}

export function TableContainer({ ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='table-container'
      {...props}
      className={clx('overflow-x-auto', props.className)}
    />
  )
}

export function TableHeader({ ...props }: React.ComponentProps<'thead'>) {
  return <thead data-slot='table-header' {...props} className={clx(props.className)} />
}

export function TableHead({ ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot='table-head'
      {...props}
      className={clx(
        'text-muted bg-table-head border-table-separator border-y px-6 py-2 font-medium',
        props.className
      )}
    />
  )
}

export function TableBody({ ...props }: React.ComponentProps<'tbody'>) {
  return <tbody data-slot='table-body' {...props} className={clx(props.className)} />
}

export function TableRow({ ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot='table-row'
      {...props}
      className={clx(
        'border-table-separator hover:bg-table-accent border-b last:border-none',
        props.className
      )}
    />
  )
}

export function TableCell({ ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot='table-cell'
      {...props}
      className={clx(
        'px-6 py-4',
        'has-[a]:p-0 *:[a]:inline-flex *:[a]:w-full *:[a]:px-6 *:[a]:py-4',
        props.className
      )}
    />
  )
}

export function TableFooter({ ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot='table-footer'
      {...props}
      className={clx('text-muted-foreground text-xs', props.className)}
    />
  )
}

export function TableCaption({
  side,
  ...props
}: React.ComponentProps<'caption'> & {
  side?: 'top' | 'bottom'
}) {
  return (
    <caption
      data-slot='table-caption'
      {...props}
      className={clx(
        'text-muted my-4 text-sm',
        side === 'top' ? 'caption-top' : 'caption-bottom',
        props.className
      )}
    />
  )
}
