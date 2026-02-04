/**
 * A container with scrollable content.
 *
 * @see: https://base-ui.com/react/components/scroll-area
 *
 * Anatomy:
 * <ScrollArea.Root>
 *   <ScrollArea.Viewport>
 *     <ScrollArea.Content />
 *   </ScrollArea.Viewport>
 *   <ScrollArea.Scrollbar>
 *     <ScrollArea.Thumb />
 *   </ScrollArea.Scrollbar>
 *   <ScrollArea.Corner />
 * </ScrollArea.Root>
 */

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area'
import * as React from 'react'
import { clx, tv } from '#/utils/variant'

export const scrollAreaStyles = tv({
  slots: {
    root: 'overflow-hidden',
    viewport: 'size-full overscroll-contain outline-none',
    scrollbar: [
      'm-1 flex touch-none select-none',
      'pointer-events-none opacity-0 transition-opacity delay-300',
      'data-hovering:opacity-100 data-hovering:delay-0',
      'data-hovering:pointer-events-auto data-hovering:duration-75',
      'data-scrolling:opacity-100 data-scrolling:delay-0',
      'data-scrolling:pointer-events-auto data-scrolling:duration-75'
    ],
    thumb: 'bg-scrollbar w-full cursor-default rounded active:cursor-default'
  },
  variants: {
    orientation: {
      horizontal: {
        scrollbar: 'h-1.5 justify-start'
      },
      vertical: {
        scrollbar: 'w-1.5 justify-center'
      }
    }
  },
  defaultVariants: {
    orientation: 'vertical'
  }
})

export type ScrollAreaRootProps = React.ComponentProps<typeof BaseScrollArea.Root> & {
  scrollbar?: 'horizontal' | 'vertical' | 'both' | false
}

export function ScrollArea({
  children,
  className,
  scrollbar = 'both',
  ...props
}: ScrollAreaRootProps) {
  const styles = scrollAreaStyles()
  return (
    <BaseScrollArea.Root
      data-slot='scroll-area'
      className={clx(styles.root(), className)}
      {...props}
    >
      <BaseScrollArea.Viewport data-slot='scroll-area-viewport' className={clx(styles.viewport())}>
        {children}
      </BaseScrollArea.Viewport>
      <React.Activity mode={scrollbar === 'horizontal' ? 'visible' : 'hidden'}>
        <ScrollAreaScrollbar orientation='horizontal' />
      </React.Activity>
      <React.Activity mode={scrollbar === 'vertical' ? 'visible' : 'hidden'}>
        <ScrollAreaScrollbar orientation='vertical' />
      </React.Activity>
      <React.Activity mode={scrollbar === 'both' ? 'visible' : 'hidden'}>
        <ScrollAreaScrollbar orientation='horizontal' />
        <ScrollAreaScrollbar orientation='vertical' />
      </React.Activity>
      <BaseScrollArea.Corner />
    </BaseScrollArea.Root>
  )
}

function ScrollAreaScrollbar({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof BaseScrollArea.Scrollbar>) {
  const styles = scrollAreaStyles({ orientation })
  return (
    <BaseScrollArea.Scrollbar
      data-slot='scroll-area-scrollbar'
      className={clx(styles.scrollbar(), className)}
      orientation={orientation}
      {...props}
    >
      <BaseScrollArea.Thumb data-slot='scroll-area-thumb' className={clx(styles.thumb())} />
    </BaseScrollArea.Scrollbar>
  )
}
