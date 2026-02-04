/**
 * A switch component that can be on or off.
 *
 * @see: https://base-ui.com/react/components/switch
 *
 * Anatomy:
 * <Switch.Root>
 *   <Switch.Thumb />
 * </Switch.Root>
 */

import { Switch as BaseSwitch } from '@base-ui/react/switch'
import { clx, tv } from '#/utils/variant'

export const switchStyles = tv({
  slots: {
    root: [
      'flex h-4.5 w-8 cursor-pointer items-center rounded-full px-0.5',
      'ring-input-border bg-track ring inset-shadow-xs inset-shadow-black/10 dark:inset-shadow-none',
      'data-checked:bg-primary data-checked:ring-primary transition-colors duration-75',
      'focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2',
      'data-disabled:cursor-not-allowed data-disabled:opacity-70'
    ],
    thumb: [
      'size-3.5 rounded-full bg-white shadow',
      'transition-transform duration-75 data-checked:translate-x-3.5'
    ]
  }
})

export type SwitchProps = React.ComponentProps<typeof BaseSwitch.Root>

export function Switch({ className, ...props }: SwitchProps) {
  const styles = switchStyles()
  return (
    <BaseSwitch.Root data-slot='switch' className={clx(styles.root(), className)} {...props}>
      <BaseSwitch.Thumb data-slot='switch-thumb' className={styles.thumb()} />
    </BaseSwitch.Root>
  )
}
