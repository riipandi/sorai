/**
 * A native form element with consolidated error handling.
 *
 * @see: https://base-ui.com/react/components/form
 *
 * Anatomy:
 * <Form>
 *   <Field.Root>
 *     <Field.Label />
 *     <Field.Control />
 *     <Field.Error />
 *   </Field.Root>
 * </Form>
 */

import { Form as BaseForm } from '@base-ui/react/form'
import { clx, tv } from '#/utils/variant'

const formVariants = tv({
  base: 'flex flex-col gap-4'
})

export type FormProps = React.ComponentProps<typeof BaseForm>

export function Form({ className, ...props }: FormProps) {
  const styles = formVariants()
  return <BaseForm data-slot='form' className={clx(styles, className)} {...props} />
}
