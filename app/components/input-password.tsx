/**
 * Password input component with visibility toggle and optional strength indicator.
 *
 * Anatomy:
 * <InputPassword>
 */

import { Input as BaseInput } from '@base-ui/react/input'
import * as Lucide from 'lucide-react'
import * as React from 'react'
import { clx, tv, type VariantProps } from '#/utils/variant'
import { Button } from './button'
import { Input, inputStyles } from './input'
import { InputGroup, InputGroupAddon } from './input-group'

export const inputPasswordVariants = tv({
  slots: {
    wrapper: 'relative space-y-1.5',
    inputWrapper: 'relative',
    input: 'rounded-r-none',
    toggleButton: [
      'rounded-xs hover:not-data-disabled:bg-transparent',
      '[&>svg:not([class*=size-])]:size-4'
    ],
    strengthIndicator: 'mt-4',
    strengthContainer: 'px-0.5',
    strengthHeader: 'mb-1 flex items-center justify-between',
    strengthLabel: 'text-muted text-sm',
    progressBar: 'bg-track h-1.5 w-full overflow-hidden rounded-full',
    progressFill: 'h-full transition-all duration-300',
    requirementsList: 'text-dimmed mt-2.5 space-y-1.5 text-sm',
    requirementItem: 'flex items-center justify-start gap-1.5',
    requirementIcon: 'size-3.5',
    requirementIconSuccess: 'text-success',
    requirementIconFailed: 'text-muted',
    requirementTextPassed: 'text-success',
    requirementTextFailed: 'text-dimmed'
  },
  variants: {
    strength: {
      weak: {
        progressFill: 'bg-danger'
      },
      fair: {
        progressFill: 'bg-warning'
      },
      medium: {
        progressFill: 'bg-warning'
      },
      strong: {
        progressFill: 'bg-success'
      }
    }
  },
  compoundVariants: [],
  defaultVariants: {
    strength: 'weak'
  }
})

/**
 * Configuration options for password strength validation.
 *
 * @example
 * ```ts
 * const config: PasswordStrengthConfig = {
 *   minLength: 8,
 *   minLowercase: 1,
 *   minUppercase: 1,
 *   minNumber: 1,
 *   minSpecialChar: 1
 * }
 * ```
 */
export interface PasswordStrengthConfig {
  /**
   * Minimum total length of the password.
   * @default 8
   */
  minLength?: number

  /**
   * Minimum number of lowercase letters required.
   * @default 1
   */
  minLowercase?: number

  /**
   * Minimum number of uppercase letters required.
   * @default 1
   */
  minUppercase?: number

  /**
   * Minimum number of digits required.
   * @default 1
   */
  minNumber?: number

  /**
   * Minimum number of special characters required.
   * @default 1
   */
  minSpecialChar?: number
}

/**
 * Props for the InputPassword component.
 *
 * @example
 * ```tsx
 * <InputPassword
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   strengthIndicator
 *   passwordStrengthConfig={{
 *     minLength: 10,
 *     minLowercase: 2,
 *     minUppercase: 2,
 *     minNumber: 1,
 *     minSpecialChar: 1
 *   }}
 * />
 * ```
 */
export type InputPasswordProps = Omit<React.ComponentProps<typeof BaseInput>, 'type'> &
  VariantProps<typeof inputStyles> & {
    /**
     * Show password strength indicator below the input.
     * @default false
     */
    strengthIndicator?: boolean

    /**
     * Configuration for password strength validation.
     * Uses default config if not provided.
     */
    passwordStrengthConfig?: PasswordStrengthConfig
  }

/**
 * Password input component with visibility toggle and optional strength indicator.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <InputPassword
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 * />
 *
 * // With strength indicator
 * <InputPassword
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   strengthIndicator
 *   passwordStrengthConfig={{
 *     minLength: 12,
 *     minLowercase: 2,
 *     minUppercase: 1,
 *     minNumber: 2,
 *     minSpecialChar: 1
 *   }}
 * />
 *
 * // With variant
 * <InputPassword
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   variant="subtle"
 *   strengthIndicator
 * />
 * ```
 */
export function InputPassword({
  value,
  variant,
  className,
  strengthIndicator = false,
  passwordStrengthConfig,
  onChange,
  ...props
}: InputPasswordProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [localValue, setLocalValue] = React.useState('')

  const currentValue = value !== undefined ? value : localValue
  const handleChange = (event: Parameters<NonNullable<typeof onChange>>[0]) => {
    if (value === undefined) {
      setLocalValue((event.target as HTMLInputElement).value)
    }
    onChange?.(event)
  }

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev)
  }

  const styles = inputPasswordVariants()

  return (
    <div className={styles.wrapper()}>
      <div className={styles.inputWrapper()}>
        <InputGroup>
          <Input
            type={isVisible ? 'text' : 'password'}
            className={clx(styles.input(), className)}
            {...(value !== undefined && { value })}
            onChange={handleChange}
            variant={variant}
            {...props}
          />
          <InputGroupAddon align='end'>
            <Button
              size='icon-sm'
              variant='plain'
              className={styles.toggleButton()}
              onClick={toggleVisibility}
            >
              <React.Activity mode={isVisible ? 'visible' : 'hidden'}>
                <Lucide.Eye className='text-muted' fill='none' />
              </React.Activity>
              <React.Activity mode={!isVisible ? 'visible' : 'hidden'}>
                <Lucide.EyeOff className='text-muted' fill='none' />
              </React.Activity>
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <React.Activity mode={strengthIndicator ? 'visible' : 'hidden'}>
        <PasswordStrength
          value={currentValue}
          config={passwordStrengthConfig}
          className={styles.strengthIndicator()}
        />
      </React.Activity>
    </div>
  )
}

/**
 * Props for the PasswordStrength component.
 */
interface PasswordStrengthProps {
  /**
   * Password value to check.
   */
  value?: string | readonly string[] | number | undefined

  /**
   * Additional CSS classes to apply.
   */
  className?: string

  /**
   * Configuration for strength validation.
   * Uses default config if not provided.
   */
  config?: PasswordStrengthConfig
}

/**
 * Represents a single password requirement with its pass/fail status.
 */
interface PasswordStrengthRequirement {
  /**
   * Whether the requirement has been met.
   */
  passed: boolean

  /**
   * Human-readable label describing the requirement.
   */
  label: string
}

/**
 * Result of password strength calculation.
 */
interface PasswordStrengthResult {
  /**
   * Number of requirements that passed.
   */
  score: number

  /**
   * Total number of requirements checked.
   */
  totalRequirements: number

  /**
   * Array of all requirements with their status.
   */
  requirements: PasswordStrengthRequirement[]

  /**
   * Strength label: "Weak", "Fair", "Medium", or "Strong".
   */
  label: string
}

/**
 * Default configuration for password strength validation.
 *
 * Requires:
 * - At least 8 characters
 * - At least 1 lowercase letter
 * - At least 1 uppercase letter
 * - At least 1 number
 * - At least 1 special character
 */
const DEFAULT_PASSWORD_STRENGTH_CONFIG: PasswordStrengthConfig = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumber: 1,
  minSpecialChar: 1
}

/**
 * Calculates password strength based on the provided configuration.
 *
 * @param password - The password string to validate.
 * @param config - Configuration object defining strength requirements.
 * @returns Object containing score, requirements, and strength label.
 *
 * @example
 * ```ts
 * const result = calculatePasswordStrength('MyP@ssw0rd', {
 *   minLength: 8,
 *   minLowercase: 1,
 *   minUppercase: 1,
 *   minNumber: 1,
 *   minSpecialChar: 1
 * })
 *
 * console.log(result.label) // "Strong"
 * console.log(result.score) // 5
 * console.log(result.requirements)
 * // [
 * //   { passed: true, label: "At least 8 characters" },
 * //   { passed: true, label: "At least 1 lowercase letter" },
 * //   ...
 * // ]
 * ```
 */
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
      label: 'Weak'
    }
  }

  const { minLength = 8, minLowercase, minUppercase, minNumber, minSpecialChar } = config

  // Minimum length check
  if (minLength > 0) {
    totalRequirements += 1
    const passed = password.length >= minLength
    if (passed) passedCount += 1
    requirements.push({ passed, label: `At least ${minLength} characters` })
  }

  // Lowercase check
  if (minLowercase !== undefined && minLowercase > 0) {
    totalRequirements += 1
    const lowercaseCount = (password.match(/[a-z]/g) || []).length
    const passed = lowercaseCount >= minLowercase
    if (passed) passedCount += 1
    requirements.push({
      passed,
      label: `At least ${minLowercase} lowercase letter${minLowercase > 1 ? 's' : ''}`
    })
  }

  // Uppercase check
  if (minUppercase !== undefined && minUppercase > 0) {
    totalRequirements += 1
    const uppercaseCount = (password.match(/[A-Z]/g) || []).length
    const passed = uppercaseCount >= minUppercase
    if (passed) passedCount += 1
    requirements.push({
      passed,
      label: `At least ${minUppercase} uppercase letter${minUppercase > 1 ? 's' : ''}`
    })
  }

  // Number check
  if (minNumber !== undefined && minNumber > 0) {
    totalRequirements += 1
    const numberCount = (password.match(/[0-9]/g) || []).length
    const passed = numberCount >= minNumber
    if (passed) passedCount += 1
    requirements.push({
      passed,
      label: `At least ${minNumber} number${minNumber > 1 ? 's' : ''}`
    })
  }

  // Special character check
  if (minSpecialChar !== undefined && minSpecialChar > 0) {
    totalRequirements += 1
    const specialCharCount = (password.match(/[^a-zA-Z0-9]/g) || []).length
    const passed = specialCharCount >= minSpecialChar
    if (passed) passedCount += 1
    requirements.push({
      passed,
      label: `At least ${minSpecialChar} special character${minSpecialChar > 1 ? 's' : ''}`
    })
  }

  // Calculate score as percentage of passed requirements
  const score = totalRequirements > 0 ? passedCount : 0

  // Determine strength level based on percentage of passed requirements
  const percentage = totalRequirements > 0 ? (passedCount / totalRequirements) * 100 : 0
  let label = 'Weak'

  if (percentage >= 100) {
    label = 'Strong'
  } else if (percentage >= 66) {
    label = 'Medium'
  } else if (percentage >= 33) {
    label = 'Fair'
  }

  return { score, totalRequirements, requirements, label }
}

/**
 * Password strength indicator component.
 *
 * Displays a visual progress bar showing password strength
 * and a checklist of requirements with their pass/fail status.
 *
 * @example
 * ```tsx
 * <PasswordStrength
 *   value="MyP@ssw0rd"
 *   config={{
 *     minLength: 10,
 *     minLowercase: 2,
 *     minUppercase: 1,
 *     minNumber: 1,
 *     minSpecialChar: 1
 *   }}
 * />
 * ```
 */
export function PasswordStrength({ value, className, config }: PasswordStrengthProps) {
  const passwordValue = typeof value === 'string' ? value : ''
  const { score, totalRequirements, requirements, label } = calculatePasswordStrength(
    passwordValue,
    config
  )

  const styles = inputPasswordVariants()
  const strengthColor: 'weak' | 'fair' | 'medium' | 'strong' =
    label === 'Strong'
      ? 'strong'
      : label === 'Medium'
        ? 'medium'
        : label === 'Fair'
          ? 'fair'
          : 'weak'

  return (
    <div className={styles.strengthContainer({ className })}>
      <div className={styles.strengthHeader()}>
        <span className={styles.strengthLabel()}>Password strength</span>
        <span className={styles.strengthLabel()}>{passwordValue ? label : ''}</span>
      </div>
      <div className={styles.progressBar()}>
        <div
          className={styles.progressFill({ strength: strengthColor })}
          style={{ width: `${totalRequirements > 0 ? (score / totalRequirements) * 100 : 0}%` }}
        />
      </div>
      {requirements.length > 0 && passwordValue.length > 0 && (
        <ul className={styles.requirementsList()}>
          {requirements.map((req) => (
            <li key={req.label} className={styles.requirementItem()}>
              {req.passed ? (
                <Lucide.CheckCircle2
                  className={clx(styles.requirementIcon(), styles.requirementIconSuccess())}
                  strokeWidth={2.8}
                  fill='none'
                />
              ) : (
                <Lucide.CircleMinus
                  className={clx(styles.requirementIcon(), styles.requirementIconFailed())}
                  strokeWidth={2.8}
                  fill='none'
                />
              )}
              <span
                className={clx(
                  req.passed ? styles.requirementTextPassed() : styles.requirementTextFailed()
                )}
              >
                {req.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
