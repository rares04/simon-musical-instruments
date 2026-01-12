'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
  autoFocus?: boolean
  className?: string
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
  autoFocus = true,
  className,
}: OtpInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  // Initialize refs array
  React.useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  // Auto focus first input on mount
  React.useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  // Focus on the first empty input when value changes externally
  React.useEffect(() => {
    const firstEmptyIndex = value.length < length ? value.length : length - 1
    if (inputRefs.current[firstEmptyIndex] && document.activeElement?.tagName !== 'INPUT') {
      // Don't steal focus if user is typing
    }
  }, [value, length])

  const focusInput = (index: number) => {
    if (index >= 0 && index < length && inputRefs.current[index]) {
      inputRefs.current[index]?.focus()
      inputRefs.current[index]?.select()
    }
  }

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // Only allow digits
    const digit = inputValue.replace(/\D/g, '').slice(-1)

    if (digit) {
      // Build new value
      const newValue = value.slice(0, index) + digit + value.slice(index + 1)
      onChange(newValue.slice(0, length))

      // Move to next input
      if (index < length - 1) {
        focusInput(index + 1)
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Backspace':
        e.preventDefault()
        if (value[index]) {
          // Delete current digit
          const newValue = value.slice(0, index) + value.slice(index + 1)
          onChange(newValue)
        } else if (index > 0) {
          // Move to previous input and delete
          const newValue = value.slice(0, index - 1) + value.slice(index)
          onChange(newValue)
          focusInput(index - 1)
        }
        break
      case 'Delete':
        e.preventDefault()
        if (value[index]) {
          const newValue = value.slice(0, index) + value.slice(index + 1)
          onChange(newValue)
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        focusInput(index - 1)
        break
      case 'ArrowRight':
        e.preventDefault()
        focusInput(index + 1)
        break
      case 'Home':
        e.preventDefault()
        focusInput(0)
        break
      case 'End':
        e.preventDefault()
        focusInput(length - 1)
        break
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain')
    const digits = pastedData.replace(/\D/g, '').slice(0, length)

    if (digits) {
      onChange(digits)
      // Focus on the input after the last pasted digit, or the last input
      focusInput(Math.min(digits.length, length - 1))
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  return (
    <div className={cn('flex gap-2 sm:gap-3 justify-center', className)}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${length}`}
          className={cn(
            'w-11 h-14 sm:w-14 sm:h-16',
            'text-center text-2xl sm:text-3xl font-semibold font-mono',
            'border-2 rounded-xl',
            'bg-background',
            'transition-all duration-200',
            'outline-none',
            // Default border
            'border-input',
            // Focus state
            'focus:border-accent focus:ring-4 focus:ring-accent/20',
            // Error state
            error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
            // Filled state
            value[index] && !error && 'border-accent/50 bg-accent/5',
            // Disabled state
            disabled && 'opacity-50 cursor-not-allowed bg-muted',
            // Hover state (when not disabled)
            !disabled && 'hover:border-accent/50',
          )}
        />
      ))}
    </div>
  )
}
