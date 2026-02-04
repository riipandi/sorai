/**
 * Displays the status of a task that takes a long time.
 *
 * @see: https://base-ui.com/react/components/progress
 *
 * Anatomy:
 * <Progress.Root>
 *   <Progress.Label />
 *   <Progress.Track>
 *     <Progress.Indicator />
 *   </Progress.Track>
 *   <Progress.Value />
 * </Progress.Root>
 */

import { Progress as BaseProgress } from '@base-ui/react/progress'
import { clx, tv } from '#/utils/variant'

export const progressStyles = tv({
  slots: {
    root: 'flex flex-wrap justify-between gap-1',
    track: 'bg-track h-1.5 w-full rounded-full',
    indicator: 'bg-primary rounded-full transition-all duration-500',
    label: 'text-foreground font-medium',
    value: 'text-muted text-base'
  }
})

export type ProgressRootProps = React.ComponentProps<typeof BaseProgress.Root>
export type ProgressLabelProps = React.ComponentProps<typeof BaseProgress.Label>
export type ProgressValueProps = React.ComponentProps<typeof BaseProgress.Value>

export function Progress({ className, children, ...props }: ProgressRootProps) {
  const styles = progressStyles()
  return (
    <BaseProgress.Root data-slot='progress' className={clx(styles.root(), className)} {...props}>
      {children}
      <BaseProgress.Track className={clx(styles.track())}>
        <BaseProgress.Indicator className={clx(styles.indicator())} />
      </BaseProgress.Track>
    </BaseProgress.Root>
  )
}

export function ProgressLabel({ className, ...props }: ProgressLabelProps) {
  const styles = progressStyles()
  return (
    <BaseProgress.Label
      data-slot='progress-label'
      className={clx(styles.label(), className)}
      {...props}
    />
  )
}

export function ProgressValue({ className, ...props }: ProgressValueProps) {
  const styles = progressStyles()
  return (
    <BaseProgress.Value
      data-slot='progress-value'
      className={clx(styles.value(), className)}
      {...props}
    />
  )
}
