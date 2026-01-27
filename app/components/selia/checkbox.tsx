/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group'
import { useRender } from '@base-ui/react/use-render'
import { clx } from '#/utils'

export function CheckboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof BaseCheckboxGroup>) {
  return (
    <BaseCheckboxGroup
      data-slot='checkbox-group'
      className={clx('flex flex-col gap-2.5', className)}
      {...props}
    />
  )
}

export function CheckboxGroupLabel({ render, ...props }: useRender.ComponentProps<'span'>) {
  return useRender({
    defaultTagName: 'span',
    render,
    props: {
      'data-slot': 'checkbox-group-label',
      className: clx('text-foreground font-medium', props.className),
      ...props
    }
  })
}

export function Checkbox({ ...props }: React.ComponentProps<typeof BaseCheckbox.Root>) {
  return (
    <BaseCheckbox.Root
      data-slot='checkbox'
      {...props}
      className={clx(
        'border-input-border bg-input shadow-input flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-xs border',
        'outline-primary focus:outline-0 focus-visible:outline-2 focus-visible:outline-offset-2',
        'data-checked:bg-primary data-checked:border-primary',
        'hover:border-input-accent-border transition-colors duration-75',
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        props.className
      )}
    >
      <BaseCheckbox.Indicator
        className='flex data-unchecked:hidden'
        render={(props, state) => (
          <span {...props}>
            {state.indeterminate ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='3'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='size-3'
              >
                <line x1='5' y1='12' x2='19' y2='12' />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='3'
                className='text-primary-foreground size-3'
                viewBox='0 0 24 24'
              >
                <path d='M20 6 9 17l-5-5'></path>
              </svg>
            )}
          </span>
        )}
      />
    </BaseCheckbox.Root>
  )
}
