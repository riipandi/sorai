import { forwardRef, useState } from 'react'
import { clx } from '#/utils'

interface PasswordInputProps {
  id: string
  name: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  autoComplete?: string
  error?: string
  className?: string
  label?: string
  required?: boolean
  disabled?: boolean
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      id,
      name,
      value,
      onChange,
      onBlur,
      placeholder = '•••••••',
      autoComplete = 'current-password',
      error,
      className = '',
      label,
      required = false,
      disabled = false
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false)

    const toggleVisibility = () => {
      setIsVisible((prev) => !prev)
    }

    return (
      <div className={className}>
        {label && (
          <label htmlFor={id} className='mb-1 block text-sm font-medium text-gray-700'>
            {label}
            {required && <span className='ml-1 text-red-500'>*</span>}
          </label>
        )}
        <div className='relative'>
          <input
            ref={ref}
            id={id}
            name={name}
            type={isVisible ? 'text' : 'password'}
            autoComplete={autoComplete}
            value={value}
            onBlur={onBlur}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={clx(
              'block w-full rounded-md border px-3 py-2 pr-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500',
              error ? 'border-red-300' : 'border-gray-300'
            )}
          />
          <button
            type='button'
            onClick={toggleVisibility}
            className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none'
            aria-label={isVisible ? 'Hide password' : 'Show password'}
          >
            {isVisible ? (
              <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                />
              </svg>
            ) : (
              <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                />
              </svg>
            )}
          </button>
        </div>
        {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'
