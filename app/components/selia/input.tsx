/**
 * Portions of this file are based on code from Selia (https://selia.earth).
 * Selia is a collection of components designed for visual cohesion.
 * Credits to Muhamad Nauval Azhar and the contributors.
 *
 * Selia licensed under MIT - Muhamad Nauval Azhar.
 * @see: https://github.com/nauvalazhar/selia/blob/master/LICENSE
 */

import { Input as BaseInput } from '@base-ui/react/input'
import { cva, type VariantProps } from 'class-variance-authority'
import * as Lucide from 'lucide-react'
import * as React from 'react'
import { clx } from '#/utils'

export const inputStyles = cva(
  [
    'text-foreground placeholder:text-dimmed shadow-input h-9.5 w-full rounded px-3.5 transition-[color,box-shadow]',
    'ring-input-border hover:not-data-disabled:not-focus:ring-input-accent-border focus:ring-primary ring focus:ring-2 focus:outline-0',
    '[&[type="file"]]:text-dimmed file:-ml-1.5 [&[type="file"]]:py-2',
    'file:text-secondary-foreground file:ring-input-accent-border file:bg-secondary file:mr-2 file:h-5.5 file:rounded-sm file:px-1.5 file:text-sm file:ring',
    'data-disabled:cursor-not-allowed data-disabled:opacity-70'
  ],
  {
    variants: {
      variant: {
        default: 'bg-input',
        subtle: 'bg-input/60'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export interface PasswordStrengthConfig {
  minLength?: number
  requireLowercase?: boolean
  requireUppercase?: boolean
  requireNumber?: boolean
  requireSpecialChar?: boolean
  maxLength?: number
}

export type InputProps = React.ComponentProps<typeof BaseInput> &
  VariantProps<typeof inputStyles> & {
    strengthIndicator?: boolean
    passwordStrengthConfig?: PasswordStrengthConfig
  }

export function Input({
  type,
  className,
  variant,
  strengthIndicator,
  passwordStrengthConfig,
  ...props
}: InputProps) {
  return type === 'password' ? (
    <PasswordInput
      className={clx(inputStyles({ variant, className }))}
      passwordStrengthConfig={passwordStrengthConfig}
      strengthIndicator={strengthIndicator}
      {...props}
    />
  ) : (
    <BaseInput data-slot='input' className={clx(inputStyles({ variant, className }))} {...props} />
  )
}

function PasswordInput({
  value,
  strengthIndicator,
  passwordStrengthConfig,
  onChange,
  ...props
}: InputProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [localValue, setLocalValue] = React.useState('')

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev)
  }

  const currentValue = value !== undefined ? value : localValue

  const handleChange = (event: Parameters<NonNullable<typeof onChange>>[0]) => {
    if (value === undefined) {
      setLocalValue((event.target as HTMLInputElement).value)
    }
    onChange?.(event)
  }

  return (
    <div className='relative space-y-2'>
      <div className='relative'>
        <BaseInput
          data-slot='input'
          type={isVisible ? 'text' : 'password'}
          {...(value !== undefined && { value })}
          onChange={handleChange}
          {...props}
        />
        <button
          type='button'
          onClick={toggleVisibility}
          className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none'
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          <React.Activity mode={isVisible ? 'visible' : 'hidden'}>
            <Lucide.EyeOff className='size-5' fill='none' />
          </React.Activity>
          <React.Activity mode={!isVisible ? 'visible' : 'hidden'}>
            <Lucide.Eye className='size-5' fill='none' />
          </React.Activity>
        </button>
      </div>
      <React.Activity mode={strengthIndicator ? 'visible' : 'hidden'}>
        <PasswordStrength value={currentValue} config={passwordStrengthConfig} className='mt-2' />
      </React.Activity>
    </div>
  )
}

interface PasswordStrengthProps {
  value?: string | readonly string[] | number | undefined
  className?: string
  config?: PasswordStrengthConfig
}

interface PasswordStrengthRequirement {
  passed: boolean
  label: string
}

interface PasswordStrengthResult {
  score: number
  totalRequirements: number
  requirements: PasswordStrengthRequirement[]
  color: string
  label: string
}

const DEFAULT_PASSWORD_STRENGTH_CONFIG: PasswordStrengthConfig = {
  minLength: 8,
  requireLowercase: true,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialChar: true
}

function calculatePasswordStrength(
  password: string = '',
  config: PasswordStrengthConfig = DEFAULT_PASSWORD_STRENGTH_CONFIG
): PasswordStrengthResult {
  const requirements: PasswordStrengthRequirement[] = []
  let passedCount = 0
  let totalRequirements = 0

  if (!password) {
    return {
      score: 0,
      totalRequirements: 0,
      requirements: [],
      color: 'bg-gray-200',
      label: 'Weak'
    }
  }

  const {
    minLength = 8,
    maxLength,
    requireLowercase = true,
    requireUppercase = true,
    requireNumber = true,
    requireSpecialChar = true
  } = config

  // Minimum length check
  if (minLength > 0) {
    totalRequirements += 1
    const passed = password.length >= minLength
    if (passed) passedCount += 1
    requirements.push({ passed, label: `At least ${minLength} characters` })
  }

  // Maximum length check (optional)
  if (maxLength && maxLength > 0) {
    totalRequirements += 1
    const passed = password.length <= maxLength
    if (passed) passedCount += 1
    requirements.push({ passed, label: `No more than ${maxLength} characters` })
  }

  // Lowercase check
  if (requireLowercase) {
    totalRequirements += 1
    const passed = /[a-z]/.test(password)
    if (passed) passedCount += 1
    requirements.push({ passed, label: 'Lowercase letter' })
  }

  // Uppercase check
  if (requireUppercase) {
    totalRequirements += 1
    const passed = /[A-Z]/.test(password)
    if (passed) passedCount += 1
    requirements.push({ passed, label: 'Uppercase letter' })
  }

  // Number check
  if (requireNumber) {
    totalRequirements += 1
    const passed = /[0-9]/.test(password)
    if (passed) passedCount += 1
    requirements.push({ passed, label: 'Number' })
  }

  // Special character check
  if (requireSpecialChar) {
    totalRequirements += 1
    const passed = /[^a-zA-Z0-9]/.test(password)
    if (passed) passedCount += 1
    requirements.push({ passed, label: 'Special character' })
  }

  // Calculate score as percentage of passed requirements
  const score = totalRequirements > 0 ? passedCount : 0

  // Determine strength level based on percentage of passed requirements
  const percentage = totalRequirements > 0 ? (passedCount / totalRequirements) * 100 : 0
  let color = 'bg-red-500'
  let label = 'Weak'

  if (percentage >= 100) {
    color = 'bg-green-500'
    label = 'Strong'
  } else if (percentage >= 66) {
    color = 'bg-yellow-500'
    label = 'Medium'
  } else if (percentage >= 33) {
    color = 'bg-orange-500'
    label = 'Fair'
  }

  return { score, totalRequirements, requirements, color, label }
}

export function PasswordStrength({ value, className, config }: PasswordStrengthProps) {
  const passwordValue = typeof value === 'string' ? value : ''
  const { score, totalRequirements, requirements, color, label } = calculatePasswordStrength(
    passwordValue,
    config
  )

  return (
    <div className={className}>
      <div className='mb-1 flex items-center justify-between'>
        <span className='text-xs text-gray-600'>Password strength</span>
        <span className='text-xs text-gray-500'>{passwordValue ? label : ''}</span>
      </div>
      <div className='h-1.5 w-full overflow-hidden rounded-full bg-gray-200'>
        <div
          className={clx('h-full transition-all duration-300', color)}
          style={{ width: `${totalRequirements > 0 ? (score / totalRequirements) * 100 : 0}%` }}
        />
      </div>
      {requirements.length > 0 && passwordValue.length > 0 && (
        <ul className='mt-2 space-y-1 text-xs text-gray-500'>
          {requirements.map((req, index) => (
            <li key={index} className='flex items-center justify-start gap-1.5'>
              {req.passed ? (
                <Lucide.CheckCircle2
                  className='size-3.5 text-green-500'
                  strokeWidth={2.8}
                  fill='none'
                />
              ) : (
                <Lucide.CircleMinus
                  className='size-3.5 text-gray-400'
                  strokeWidth={2.8}
                  fill='none'
                />
              )}
              <span className={req.passed ? 'text-green-600' : 'text-gray-500'}>{req.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
