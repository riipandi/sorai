/**
 * Allows users to select a value from a range.
 *
 * @see: https://base-ui.com/react/components/slider
 *
 * Anatomy:
 * <Slider.Root>
 *   <Slider.Value />
 *   <Slider.Control>
 *     <Slider.Track>
 *       <Slider.Indicator />
 *       <Slider.Thumb />
 *     </Slider.Track>
 *   </Slider.Control>
 * </Slider.Root>
 */

import { Slider as BaseSlider } from '@base-ui/react/slider'
import { clx, tv, type VariantProps } from '#/utils/variant'

export const sliderStyles = tv({
  base: '',
  slots: {
    root: 'data-disabled:opacity-70',
    control: 'touch-none select-none',
    track: 'bg-track h-1.5 w-full rounded-full',
    indicator: 'bg-primary rounded-full',
    thumb: [
      'ring-primary size-3.5 cursor-grab rounded-full bg-white shadow ring data-dragging:cursor-grabbing',
      'has-focus-visible:outline-foreground has-focus-visible:outline-2 has-focus-visible:outline-offset-2',
      'data-disabled:cursor-not-allowed'
    ]
  },
  variants: {
    size: {
      sm: {
        track: 'h-1',
        thumb: 'size-3'
      },
      md: {
        track: 'h-1.5',
        thumb: 'size-3.5'
      },
      lg: {
        track: 'h-2',
        thumb: 'size-4'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
})

export type SliderProps = React.ComponentProps<typeof BaseSlider.Root> &
  VariantProps<typeof sliderStyles>
export type SliderThumbProps = React.ComponentProps<typeof BaseSlider.Thumb>

export function Slider({ className, children, size, ...props }: SliderProps) {
  const styles = sliderStyles({ size })
  return (
    <BaseSlider.Root data-slot='slider' className={clx(styles.root(), className)} {...props}>
      <BaseSlider.Control className={styles.control()}>
        <BaseSlider.Track className={styles.track()}>
          <BaseSlider.Indicator className={styles.indicator()} />
          {children}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  )
}

export function SliderThumb({ className, ...props }: SliderThumbProps) {
  const styles = sliderStyles()
  return (
    <BaseSlider.Thumb
      data-slot='slider-thumb'
      className={clx(styles.thumb(), className)}
      {...props}
    />
  )
}
