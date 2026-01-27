/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Slider as BaseSlider } from '@base-ui/react/slider'
import { clx } from '#/utils'

export function Slider({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSlider.Root>) {
  return (
    <BaseSlider.Root
      data-slot='slider'
      className={clx('data-disabled:opacity-70', className)}
      {...props}
    >
      <BaseSlider.Control className='touch-none select-none'>
        <BaseSlider.Track className='bg-track h-1.5 w-full rounded-full'>
          <BaseSlider.Indicator className='bg-primary rounded-full' />
          {children}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  )
}

export function SliderThumb({
  className,
  ...props
}: React.ComponentProps<typeof BaseSlider.Thumb>) {
  return (
    <BaseSlider.Thumb
      data-slot='slider-thumb'
      className={clx(
        'ring-primary size-4 cursor-grab rounded-full bg-white shadow ring data-dragging:cursor-grabbing',
        'has-[:focus-visible]:outline-foreground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2',
        'data-disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
}
