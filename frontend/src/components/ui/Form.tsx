import { type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface FormFieldProps {
  label?: string
  error?: string
  children: ReactNode
  className?: string
  required?: boolean
}

export function FormField({ label, error, children, className, required }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

interface FormProps {
  children: ReactNode
  onSubmit?: (e: React.FormEvent) => void
  className?: string
}

export function Form({ children, onSubmit, className }: FormProps) {
  return (
    <form onSubmit={onSubmit} className={cn('space-y-4', className)} noValidate>
      {children}
    </form>
  )
}
