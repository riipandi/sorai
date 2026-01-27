/**
 * `Remember me` is a feature that keeps users logged in across browser sessions.
 * When enabled, it stores a persistent authentication token or session ID in `localStorage` or `cookies`.
 * This allows users to remain authenticated even after closing and reopening the browser, so they do not
 * need to log in again on their next visit. Typically, a long-lived token/session are stored.
 */

import { persistentMap } from '@nanostores/persistent'
import pkg from '~/package.json' with { type: 'json' }

// Auth store type definition
export interface AuthStore {
  atoken: string | null
  atokenexp: number | null
  rtoken: string | null
  rtokenexp: number | null
  remember: boolean
}

// Persistent authentication state store
export const authStore = persistentMap<AuthStore>(
  `${pkg.name}_auth:`,
  {
    atoken: null,
    atokenexp: null,
    rtoken: null,
    rtokenexp: null,
    remember: false
  },
  {
    encode: encodeValue,
    decode: decodeValue
  }
)

// Helper to encode/decode primitive values for localStorage
function encodeValue(value: string | number | boolean | null | undefined): string {
  return value === null || value === undefined ? '' : String(value)
}

function decodeValue(encoded: string): string | number | boolean | null {
  if (encoded === '') return null
  if (encoded === 'true') return true
  if (encoded === 'false') return false
  const num = Number(encoded)
  return !Number.isNaN(num) ? num : encoded
}

export interface UIStore {
  sidebar: 'show' | 'hide'
  theme: 'light' | 'dark'
}

const uiStoreDefaults: UIStore = {
  sidebar: 'hide',
  theme: 'light'
}

export const uiStore = persistentMap<UIStore>(`${pkg.name}_ui:`, uiStoreDefaults, {
  encode: (value: UIStore[keyof UIStore]) => (value == null ? '' : String(value)),
  decode: (encoded: string, key?: keyof UIStore): UIStore[keyof UIStore] => {
    if (key === 'sidebar') {
      return encoded === 'show' || encoded === 'hide' ? encoded : uiStoreDefaults.sidebar
    }
    if (key === 'theme') {
      return encoded === 'light' || encoded === 'dark' ? encoded : uiStoreDefaults.theme
    }
    return encoded === '' ? uiStoreDefaults.sidebar : (encoded as UIStore[keyof UIStore])
  }
})
