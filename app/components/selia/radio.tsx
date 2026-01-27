/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Radio as BaseRadio } from '@base-ui/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import { useRender } from '@base-ui/react/use-render'
import { clx } from '#/utils'

export function RadioGroup({ className, ...props }: React.ComponentProps<typeof BaseRadioGroup>) {
  return (
    <BaseRadioGroup
      data-slot='radio-group'
      {...props}
      className={clx('flex flex-col gap-2.5', className)}
    />
  )
}

export function RadioGroupLabel({ className, render, ...props }: useRender.ComponentProps<'span'>) {
  return useRender({
    defaultTagName: 'span',
    render,
    props: {
      'data-slot': 'radio-group-label',
      className: clx('text-foreground', className),
      ...props
    }
  })
}

export function Radio({ className, ...props }: React.ComponentProps<typeof BaseRadio.Root>) {
  return (
    <BaseRadio.Root
      data-slot='radio'
      className={clx(
        'border-input-border bg-input shadow-input flex size-4 cursor-pointer items-center justify-center rounded-full border',
        'outline-primary focus:outline-0 focus-visible:outline-2 focus-visible:outline-offset-2',
        'data-[checked]:bg-primary data-[checked]:border-primary',
        'hover:border-input-accent-border transition-colors duration-75',
        'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-70',
        className
      )}
      {...props}
    >
      <BaseRadio.Indicator className='bg-primary-foreground size-2 rounded-full' />
    </BaseRadio.Root>
  )
}
