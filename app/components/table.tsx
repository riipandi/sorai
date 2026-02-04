/**
 * A data table component for displaying structured information in rows and columns.
 *
 * Anatomy:
 * <TableContainer>
 *   <Table>
 *     <TableHeader>
 *       <TableRow>
 *         <TableHead />
 *       </TableRow>
 *     </TableHeader>
 *     <TableBody>
 *       <TableRow>
 *         <TableCell />
 *       </TableRow>
 *     </TableBody>
 *     <TableFooter />
 *     <TableCaption />
 *   </Table>
 * </TableContainer>
 */

import { tv, type VariantProps } from '#/utils/variant'

export const tableStyles = tv({
  slots: {
    table: 'text-table-foreground w-full text-left',
    container: 'overflow-x-auto',
    header: '',
    head: 'text-muted bg-table-head border-table-separator border-y px-5 py-1.5 font-medium',
    body: '',
    row: 'border-table-separator hover:bg-table-accent border-b last:border-none',
    cell: ['px-5 py-3', 'has-[a]:p-0 *:[a]:inline-flex *:[a]:w-full *:[a]:px-5 *:[a]:py-3'],
    footer: 'text-muted text-sm',
    caption: 'text-muted my-3'
  },
  variants: {
    side: {
      top: {
        caption: 'caption-top'
      },
      bottom: {
        caption: 'caption-bottom'
      }
    }
  },
  defaultVariants: {
    side: 'bottom'
  }
})

export type TableProps = React.ComponentProps<'table'>
export type TableContainerProps = React.ComponentProps<'div'>
export type TableHeaderProps = React.ComponentProps<'thead'>
export type TableHeadProps = React.ComponentProps<'th'>
export type TableBodyProps = React.ComponentProps<'tbody'>
export type TableRowProps = React.ComponentProps<'tr'>
export type TableCellProps = React.ComponentProps<'td'>
export type TableFooterProps = React.ComponentProps<'tfoot'>
export type TableCaptionProps = React.ComponentProps<'caption'> & VariantProps<typeof tableStyles>

export function Table({ className, ...props }: TableProps) {
  const styles = tableStyles()
  return <table data-slot='table' className={styles.table({ className })} {...props} />
}

export function TableContainer({ className, ...props }: TableContainerProps) {
  const styles = tableStyles()
  return <div data-slot='table-container' className={styles.container({ className })} {...props} />
}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  const styles = tableStyles()
  return <thead data-slot='table-header' className={styles.header({ className })} {...props} />
}

export function TableHead({ className, ...props }: TableHeadProps) {
  const styles = tableStyles()
  return <th data-slot='table-head' className={styles.head({ className })} {...props} />
}

export function TableBody({ className, ...props }: TableBodyProps) {
  const styles = tableStyles()
  return <tbody data-slot='table-body' className={styles.body({ className })} {...props} />
}

export function TableRow({ className, ...props }: TableRowProps) {
  const styles = tableStyles()
  return <tr data-slot='table-row' className={styles.row({ className })} {...props} />
}

export function TableCell({ className, ...props }: TableCellProps) {
  const styles = tableStyles()
  return <td data-slot='table-cell' className={styles.cell({ className })} {...props} />
}

export function TableFooter({ className, ...props }: TableFooterProps) {
  const styles = tableStyles()
  return <tfoot data-slot='table-footer' className={styles.footer({ className })} {...props} />
}

export function TableCaption({ side, className, ...props }: TableCaptionProps) {
  const styles = tableStyles({ side })
  return <caption data-slot='table-caption' className={styles.caption({ className })} {...props} />
}
