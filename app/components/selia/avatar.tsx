/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Avatar as BaseAvatar } from '@base-ui/react/avatar'
import { cva, type VariantProps } from 'class-variance-authority'
import * as Lucide from 'lucide-react'
import * as React from 'react'
import { clx } from '#/utils'

export const avatarStyles = cva(
  'bg-avatar text-avatar-foreground relative flex items-center justify-center rounded-full font-semibold select-none',
  {
    variants: {
      size: {
        sm: 'size-8',
        md: 'size-11',
        lg: 'size-13'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
)

export function Avatar({
  size,
  className,
  ...props
}: React.ComponentProps<typeof BaseAvatar.Root> & VariantProps<typeof avatarStyles>) {
  return (
    <BaseAvatar.Root
      data-slot='avatar'
      className={clx(avatarStyles({ size, className }))}
      {...props}
    />
  )
}

export function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof BaseAvatar.Image>) {
  return (
    <BaseAvatar.Image
      data-slot='avatar-image'
      className={clx('size-full rounded-full', className)}
      {...props}
    />
  )
}

export function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof BaseAvatar.Fallback>) {
  return (
    <BaseAvatar.Fallback
      data-slot='avatar-fallback'
      className={clx('flex size-full items-center justify-center rounded-full', className)}
      {...props}
    />
  )
}

export const avatarIndicatorStyles = cva(
  'absolute flex size-2.5 items-center justify-center rounded-full text-xs',
  {
    variants: {
      position: {
        top: 'top-0 right-0',
        bottom: 'right-0 bottom-0'
      },
      size: {
        sm: 'size-2.5',
        md: 'size-3',
        lg: 'size-3.5'
      }
    },
    defaultVariants: {
      position: 'bottom',
      size: 'md'
    }
  }
)

export function AvatarIndicator({
  position,
  size,
  className,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof avatarIndicatorStyles>) {
  return (
    <div
      data-slot='avatar-indicator'
      className={clx(avatarIndicatorStyles({ position, size, className }))}
      {...props}
    />
  )
}

/**
 * Extract initials from a name or value string
 * @param nameOrValue - The name or value to extract initials from
 * @returns The initials (up to 2 characters)
 */
function getInitials(nameOrValue: string | undefined | null): string {
  if (!nameOrValue) return ''
  const words = nameOrValue.trim().split(/\s+/)
  if (words.length === 0) return ''
  if (words.length === 1) {
    return words[0]?.charAt(0)?.toUpperCase() || ''
  }
  return ((words[0]?.charAt(0) || '') + (words[1]?.charAt(0) || '')).toUpperCase()
}

export interface AvatarFallbackInitialProps extends React.ComponentProps<
  typeof BaseAvatar.Fallback
> {
  /** The name or value to extract initials from */
  name?: string | null
  /** The value to extract initials from (alternative to name) */
  value?: string | null
}

export function AvatarFallbackInitial({
  name,
  value,
  className,
  ...props
}: AvatarFallbackInitialProps) {
  const initials = getInitials(name || value)

  return (
    <BaseAvatar.Fallback
      data-slot='avatar-fallback'
      className={clx('flex size-full items-center justify-center rounded-full text-lg', className)}
      {...props}
    >
      <React.Activity mode={initials ? 'visible' : 'hidden'}>{initials}</React.Activity>
      <React.Activity mode={!initials ? 'visible' : 'hidden'}>
        <Lucide.UserCircle className='text-avatar-foreground/70 size-3/4' strokeWidth={1.8} />
      </React.Activity>
    </BaseAvatar.Fallback>
  )
}
