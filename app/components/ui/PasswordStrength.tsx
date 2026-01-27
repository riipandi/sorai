import { clx } from '#/utils'

interface PasswordStrengthProps {
  password: string
  className?: string
}

interface PasswordStrengthResult {
  score: number
  feedback: string[]
  color: string
  label: string
}

function calculatePasswordStrength(password: string): PasswordStrengthResult {
  let score = 0
  const feedback: string[] = []

  if (!password) {
    return {
      score: 0,
      feedback: [],
      color: 'bg-gray-200',
      label: 'Password strength'
    }
  }

  // Length check
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('At least 8 characters')
  }

  if (password.length >= 12) {
    score += 1
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Lowercase letter')
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Uppercase letter')
  }

  // Number check
  if (/[0-9]/.test(password)) {
    score += 1
  } else {
    feedback.push('Number')
  }

  // Special character check
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1
  } else {
    feedback.push('Special character')
  }

  // Determine strength level
  let color = 'bg-red-500'
  let label = 'Weak'

  if (score >= 5) {
    color = 'bg-green-500'
    label = 'Strong'
  } else if (score >= 3) {
    color = 'bg-yellow-500'
    label = 'Medium'
  } else if (score >= 1) {
    color = 'bg-orange-500'
    label = 'Fair'
  }

  return { score, feedback, color, label }
}

export function PasswordStrength({ password, className = '' }: PasswordStrengthProps) {
  const { score, feedback, color, label } = calculatePasswordStrength(password)
  const maxScore = 6

  return (
    <div className={className}>
      <div className='mb-1 flex items-center justify-between'>
        <span className='text-xs text-gray-600'>{label}</span>
        <span className='text-xs text-gray-500'>
          {password ? `${Math.round((score / maxScore) * 100)}%` : ''}
        </span>
      </div>
      <div className='h-1.5 w-full overflow-hidden rounded-full bg-gray-200'>
        <div
          className={clx('h-full transition-all duration-300', color)}
          style={{ width: `${(score / maxScore) * 100}%` }}
        />
      </div>
      {feedback.length > 0 && password.length > 0 && (
        <ul className='mt-2 text-xs text-gray-500'>
          {feedback.map((item, index) => (
            <li key={index} className='flex items-center gap-1'>
              <svg className='h-3 w-3 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
