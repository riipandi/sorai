/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area'
import { clx } from '#/utils'

export function ScrollArea({
  children,
  className,
  scrollbar = 'both',
  ...props
}: React.ComponentProps<typeof BaseScrollArea.Root> & {
  scrollbar?: 'horizontal' | 'vertical' | 'both' | false
}) {
  return (
    <BaseScrollArea.Root
      data-slot='scroll-area'
      className={clx('overflow-hidden', className)}
      {...props}
    >
      <BaseScrollArea.Viewport
        data-slot='scroll-area-viewport'
        className='size-full overscroll-contain outline-none'
      >
        {children}
      </BaseScrollArea.Viewport>
      {scrollbar === 'horizontal' && <ScrollAreaScrollbar orientation='horizontal' />}
      {scrollbar === 'vertical' && <ScrollAreaScrollbar orientation='vertical' />}
      {scrollbar === 'both' && (
        <>
          <ScrollAreaScrollbar orientation='horizontal' />
          <ScrollAreaScrollbar orientation='vertical' />
        </>
      )}
      <BaseScrollArea.Corner />
    </BaseScrollArea.Root>
  )
}

function ScrollAreaScrollbar({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof BaseScrollArea.Scrollbar>) {
  return (
    <BaseScrollArea.Scrollbar
      {...props}
      data-slot='scroll-area-scrollbar'
      className={clx(
        'm-1 flex touch-none select-none',
        'pointer-events-none opacity-0 transition-opacity delay-300',
        'data-[hovering]:opacity-100 data-[hovering]:delay-0',
        'data-[hovering]:pointer-events-auto data-[hovering]:duration-75',
        'data-[scrolling]:opacity-100 data-[scrolling]:delay-0',
        'data-[scrolling]:pointer-events-auto data-[scrolling]:duration-75',
        orientation === 'vertical' ? 'w-1.5 justify-center' : 'h-1.5 justify-start',
        className
      )}
      orientation={orientation}
    >
      <BaseScrollArea.Thumb
        data-slot='scroll-area-thumb'
        className='bg-scrollbar w-full cursor-grab rounded active:cursor-grabbing'
      />
    </BaseScrollArea.Scrollbar>
  )
}
