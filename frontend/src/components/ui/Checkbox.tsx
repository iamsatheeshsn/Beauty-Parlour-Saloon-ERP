import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || props.name
    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="flex cursor-pointer items-center gap-2">
          <input
            id={inputId}
            type="checkbox"
            ref={ref}
            className={cn(
              'h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20',
              className
            )}
            {...props}
          />
          {label && <span className="text-sm text-foreground">{label}</span>}
        </label>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
