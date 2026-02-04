import { useStore } from '@nanostores/react'
import { useCallback, useState } from 'react'
import { uiStore } from '#/stores'
import useIsMobile from './use-mobile'

export function useSidebar() {
  const { sidebarOpen } = useStore(uiStore)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { isMobile } = useIsMobile('1024px')

  return {
    sidebarOpen: isMobile ? mobileSidebarOpen : sidebarOpen,
    toggleSidebar: useCallback(() => {
      if (isMobile) {
        setMobileSidebarOpen(!mobileSidebarOpen)
      } else {
        uiStore.setKey('sidebarOpen', !sidebarOpen)
      }
    }, [isMobile, mobileSidebarOpen, sidebarOpen])
  }
}
