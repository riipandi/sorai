/**
 * A graphical display of a numeric value within a range.
 *
 * @see: https://base-ui.com/react/components/meter
 *
 * Anatomy:
 * <Meter.Root>
 *   <Meter.Label />
 *   <Meter.Track>
 *     <Meter.Indicator />
 *   </Meter.Track>
 *   <Meter.Value />
 * </Meter.Root>
 */

import { Meter as BaseMeter } from '@base-ui/react/meter'
import { clx, tv } from '#/utils/variant'

export const meterStyles = tv({
  base: 'flex flex-wrap justify-between gap-1',
  slots: {
    label: 'text-foreground font-medium',
    track: 'bg-track h-1.5 w-full rounded-full',
    indicator: 'bg-primary rounded-full transition-all duration-500',
    value: 'text-dimmed text-base'
  }
})

export type MeterProps = React.ComponentProps<typeof BaseMeter.Root>
export type MeterLabelProps = React.ComponentProps<typeof BaseMeter.Label>
export type MeterTrackProps = React.ComponentProps<typeof BaseMeter.Track>
export type MeterIndicatorProps = React.ComponentProps<typeof BaseMeter.Indicator>
export type MeterValueProps = React.ComponentProps<typeof BaseMeter.Value>

export function Meter({ className, children, ...props }: MeterProps) {
  const styles = meterStyles()
  return (
    <BaseMeter.Root data-slot='meter' className={clx(styles.base(), className)} {...props}>
      {children}
      <MeterTrack />
    </BaseMeter.Root>
  )
}

export function MeterLabel({ className, ...props }: MeterLabelProps) {
  const styles = meterStyles()
  return (
    <BaseMeter.Label
      data-slot='meter-label'
      className={clx(styles.label(), className)}
      {...props}
    />
  )
}

export function MeterTrack({ className, children, ...props }: MeterTrackProps) {
  const styles = meterStyles()
  return (
    <BaseMeter.Track data-slot='meter-track' className={clx(styles.track(), className)} {...props}>
      {children}
      <MeterIndicator />
    </BaseMeter.Track>
  )
}

export function MeterIndicator({ className, ...props }: MeterIndicatorProps) {
  const styles = meterStyles()
  return (
    <BaseMeter.Indicator
      data-slot='meter-indicator'
      className={clx(styles.indicator(), className)}
      {...props}
    />
  )
}

export function MeterValue({ className, ...props }: MeterValueProps) {
  const styles = meterStyles()
  return (
    <BaseMeter.Value
      data-slot='meter-value'
      className={clx(styles.value(), className)}
      {...props}
    />
  )
}
