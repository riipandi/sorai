import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function clx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
