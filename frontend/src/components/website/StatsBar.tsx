import { STATS } from '@/constants/websiteContent'

export function StatsBar() {
  return (
    <section className="relative z-10 -mt-12 mx-4 sm:mx-6 lg:mx-auto lg:max-w-5xl">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-xl lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white px-4 py-8 text-center sm:px-6">
            <p className="font-serif text-3xl font-bold text-primary md:text-4xl">{stat.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
