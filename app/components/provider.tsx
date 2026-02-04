/**
 * Context provider for managing CSP and direction settings across the application.
 *
 * @see: https://base-ui.com/react/utils/csp-provider
 * @see: https://base-ui.com/react/utils/direction-provider
 *
 * Anatomy:
 * <UIProvider>
 *   {children}
 * </UIProvider>
 */

import { CSPProvider, type CSPProviderProps } from '@base-ui/react/csp-provider'
import { DirectionProvider, type DirectionProviderProps } from '@base-ui/react/direction-provider'

export interface UIProviderProps
  extends Omit<CSPProviderProps, 'children'>, Omit<DirectionProviderProps, 'children'> {
  children: React.ReactNode
}

export function UIProvider({
  children,
  nonce,
  disableStyleElements,
  direction = 'ltr'
}: UIProviderProps) {
  return (
    <CSPProvider nonce={nonce} disableStyleElements={disableStyleElements}>
      <DirectionProvider direction={direction}>{children}</DirectionProvider>
    </CSPProvider>
  )
}
