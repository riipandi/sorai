/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Form as BaseForm } from '@base-ui/react/form'
import { clx } from '#/utils'

export function Form({ className, ...props }: React.ComponentProps<typeof BaseForm>) {
  return <BaseForm data-slot='form' className={clx('flex flex-col gap-6', className)} {...props} />
}
