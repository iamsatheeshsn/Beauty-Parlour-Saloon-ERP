import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components'
import { cn } from '@/utils/cn'

interface CustomerSearchInputProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  isSearching?: boolean
  placeholder?: string
  autoFocus?: boolean
}

export function CustomerSearchInput({
  value,
  onChange,
  onSearch,
  isSearching = false,
  placeholder = 'UAE mobile e.g. 050 123 4567',
  autoFocus = false,
}: CustomerSearchInputProps) {
  const [focused, setFocused] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSearch()
    }
  }

  return (
    <div
      className={cn(
        'relative rounded-xl border-2 bg-card transition-colors',
        focused ? 'border-primary shadow-sm' : 'border-border',
      )}
    >
      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full min-w-0 rounded-xl border-0 bg-transparent py-2.5 pl-4 pr-[6.25rem] text-sm text-foreground outline-none placeholder:text-muted-foreground sm:pr-[7.25rem]"
      />
      <Button
        type="button"
        size="sm"
        onClick={onSearch}
        disabled={isSearching || value.trim().length < 7}
        className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 shrink-0 px-3 sm:h-9 sm:px-4"
      >
        <Search className="h-4 w-4" />
        <span>{isSearching ? '…' : 'Search'}</span>
      </Button>
    </div>
  )
}
