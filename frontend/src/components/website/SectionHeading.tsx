import { cn } from '@/utils/cn'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-10 md:mb-14',
        align === 'center' && 'mx-auto max-w-2xl text-center',
        align === 'left' && 'max-w-xl text-left',
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-2xl font-semibold leading-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          'mt-5 h-px w-16 bg-gradient-to-r from-primary via-secondary to-accent',
          align === 'center' && 'mx-auto',
        )}
      />
    </div>
  )
}
