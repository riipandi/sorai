/**
 * A radio button component for selecting one option from a group.
 *
 * @see: https://base-ui.com/react/components/radio
 *
 * Anatomy:
 * <RadioGroup>
 *   <Radio.Root>
 *     <Radio.Indicator />
 *   </Radio.Root>
 * </RadioGroup>
 */

import { Radio as BaseRadio } from '@base-ui/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import { useRender } from '@base-ui/react/use-render'
import { clx, tv } from '#/utils/variant'

export const radioStyles = tv({
  slots: {
    group: 'flex flex-col gap-2.5',
    groupLabel: 'text-foreground',
    root: [
      'border-input-border bg-input shadow-input flex size-4 cursor-pointer items-center justify-center rounded-full border',
      'outline-primary focus:outline-0 focus-visible:outline-2 focus-visible:outline-offset-2',
      'data-checked:bg-primary data-checked:border-primary',
      'hover:border-input-accent-border transition-colors duration-75',
      'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-70'
    ],
    indicator: 'bg-primary-foreground size-2 rounded-full'
  }
})

export type RadioGroupProps = React.ComponentProps<typeof BaseRadioGroup>
export type RadioGroupLabelProps = useRender.ComponentProps<'span'>
export type RadioRootProps = React.ComponentProps<typeof BaseRadio.Root>

export function RadioGroup({ className, ...props }: RadioGroupProps) {
  const styles = radioStyles()
  return (
    <BaseRadioGroup data-slot='radio-group' className={clx(styles.group(), className)} {...props} />
  )
}

export function RadioGroupLabel({ className, render, ...props }: RadioGroupLabelProps) {
  const styles = radioStyles()
  return useRender({
    defaultTagName: 'span',
    render,
    props: {
      'data-slot': 'radio-group-label',
      className: clx(styles.groupLabel(), className),
      ...props
    }
  })
}

export function Radio({ className, ...props }: RadioRootProps) {
  const styles = radioStyles()
  return (
    <BaseRadio.Root data-slot='radio' className={clx(styles.root(), className)} {...props}>
      <BaseRadio.Indicator className={clx(styles.indicator())} />
    </BaseRadio.Root>
  )
}
