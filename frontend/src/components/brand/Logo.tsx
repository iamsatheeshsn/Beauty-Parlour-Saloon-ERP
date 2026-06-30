import { useAppSettings } from '@/contexts/SettingsContext'
import { cn } from '@/utils/cn'

interface LogoProps {
  variant?: 'full' | 'icon'
  className?: string
  iconClassName?: string
  showTagline?: boolean
  /** White text for dark hero backgrounds */
  inverted?: boolean
}

export function Logo({
  variant = 'full',
  className,
  iconClassName,
  showTagline = true,
  inverted = false,
}: LogoProps) {
  const { settings } = useAppSettings()
  const appName = settings.app_name
  const customLogo = settings.app_logo

  const Icon = customLogo ? (
    <img
      src={customLogo}
      alt={appName}
      className={cn('h-10 w-10 shrink-0 rounded-[13px] object-contain', iconClassName)}
    />
  ) : (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-10 w-10 shrink-0', iconClassName)}
      aria-hidden
    >
      <defs>
        <linearGradient id="logoMarkGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor={inverted ? '#FFFAF7' : '#E8C9A0'} />
          <stop offset="0.55" stopColor={inverted ? '#E8C9A0' : '#C47B8A'} />
          <stop offset="1" stopColor={inverted ? '#D4A5AE' : settings.primary_color} />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#logoMarkGrad)" />
      <path
        d="M15 34V14h7.8c5.8 0 9.4 3.2 9.4 8.2 0 3.4-1.7 6-4.6 7.3V34h-5.8v-5.8h-3.8V34H15zm5.8-10.4h2.6c2.1 0 3.2-1 3.2-2.7 0-1.7-1.1-2.7-3.2-2.7h-2.6v5.4z"
        fill={inverted ? settings.primary_color : '#FFFAF7'}
      />
      <circle cx="37" cy="13" r="2.8" fill={inverted ? settings.primary_color : '#FFFAF7'} opacity="0.9" />
    </svg>
  )

  if (variant === 'icon') {
    return <div className={cn('flex items-center justify-center', className)}>{Icon}</div>
  }

  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <div className="flex shrink-0 items-center justify-center">{Icon}</div>
      <div className="min-w-0 flex flex-col justify-center gap-0.5">
        <p
          className={cn(
            'truncate font-serif text-base font-semibold leading-tight tracking-tight',
            inverted ? 'text-white' : 'polishe-gradient-text',
          )}
        >
          {appName}
        </p>
        {showTagline && (
          <p
            className={cn(
              'truncate text-[10px] font-medium uppercase leading-none tracking-[0.18em]',
              inverted ? 'text-white/65' : 'text-[#8B6B63]',
            )}
          >
            Dubai, UAE
          </p>
        )}
      </div>
    </div>
  )
}
