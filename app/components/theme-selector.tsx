/**
 * A theme selection dropdown for switching between light, dark, and system themes.
 *
 * Anatomy:
 * <ThemeSelector>
 */

import * as Lucide from 'lucide-react'
import * as React from 'react'
import { clx } from '#/utils/variant'
import { Button } from './button'
import { Menu, MenuPopup, MenuItem, MenuTrigger } from './menu'
import { Tooltip, TooltipPopup, TooltipTrigger } from './tooltip'

interface ThemeSelectorProps {
  value?: string
  onChange?: (theme: string) => void
  themes?: string[]
  className?: string
  triggerVariant?: 'outline' | 'plain'
}

const DEFAULT_THEMES = ['system', 'light', 'dark'] as const

function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getThemeIcon(theme: string): React.ReactNode {
  const normalizedTheme = theme.toLowerCase()

  if (normalizedTheme === 'system') {
    return <Lucide.LaptopMinimal className='size-4' />
  }

  if (normalizedTheme === 'light' || normalizedTheme.includes('light')) {
    return <Lucide.Lightbulb className='size-4' />
  }

  if (normalizedTheme === 'dark' || normalizedTheme.includes('dark')) {
    return <Lucide.Moon className='size-4' />
  }

  return <Lucide.SunMoon className='size-4' />
}

function getThemeLabel(theme: string): string {
  if (!theme) return 'System'
  return capitalize(theme.replace(/-/g, ' '))
}

export function ThemeSelector({
  value,
  onChange,
  themes,
  className,
  triggerVariant = 'outline'
}: ThemeSelectorProps) {
  const themeList = React.useMemo(() => {
    const list = (themes || [...DEFAULT_THEMES]) as string[]
    return list.length > 0 ? list : ['system']
  }, [themes])

  const safeValue = React.useMemo(() => {
    if (!value) return themeList[0] ?? 'system'
    if (typeof value === 'string' && themeList.includes(value)) {
      return value
    }
    return themeList[0] ?? 'system'
  }, [value, themeList])

  const handleThemeChange = (theme: string) => {
    onChange?.(theme)
  }

  return (
    <Menu>
      <Tooltip delay={300}>
        <TooltipTrigger
          render={
            <MenuTrigger
              render={<Button variant={triggerVariant} size='icon-sm' className={clx(className)} />}
            />
          }
        >
          <span className='sr-only'>Theme</span>
          {getThemeIcon(safeValue)}
        </TooltipTrigger>
        <TooltipPopup side='left' align='center' className='rounded-xs text-sm'>
          Select theme
        </TooltipPopup>
      </Tooltip>
      <MenuPopup size='compact' align='end'>
        {themeList.map((theme) => {
          const isSelected = safeValue === theme
          return (
            <MenuItem
              key={theme}
              onClick={() => handleThemeChange(theme)}
              className={clx('gap-2', isSelected && 'bg-accent/50')}
            >
              {getThemeIcon(theme)}
              <span className='flex-1'>{getThemeLabel(theme)}</span>
              {isSelected && <Lucide.Check className='text-primary size-4' />}
            </MenuItem>
          )
        })}
      </MenuPopup>
    </Menu>
  )
}
