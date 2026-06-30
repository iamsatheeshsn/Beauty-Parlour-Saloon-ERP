import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Calendar,
  CalendarClock,
  Clock,
  DollarSign,
  Package,
  UserCheck,
  Users,
} from 'lucide-react'
import { useAppSettings } from '@/contexts/SettingsContext'
import { Breadcrumb, Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components'
import { PageLoader } from '@/components/ui/Loader'
import { SimpleBarChart } from '@/components/dashboard/SimpleBarChart'
import { StatCard } from '@/components/dashboard/StatCard'
import { dashboardService } from '@/services/authService'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency, formatDate } from '@/utils/format'

export default function DashboardPage() {
  const { user } = useAuth()
  const { settings } = useAppSettings()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getData(),
    refetchInterval: 60_000,
  })

  if (isLoading) return <PageLoader />

  if (isError || !data?.data) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">
        Failed to load dashboard data. Please refresh the page.
      </div>
    )
  }

  const payload = data.data
  const stats = payload.stats
  const company = payload.company
  const recentActivity = payload.recent_activity ?? []
  const upcoming = payload.upcoming_appointments ?? []
  const charts = payload.charts

  const currency = company?.currency ?? settings.currency

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <Breadcrumb items={[{ label: 'Dashboard' }]} />
        <h1 className="mt-2 font-serif text-2xl font-semibold text-foreground sm:text-3xl">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {company?.name || settings.company_name || settings.app_name} · {currency}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4 2xl:grid-cols-4">
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(stats.today_revenue ?? 0, currency)}
          icon={DollarSign}
          gradient="from-[#8B6914] to-[#C9A46C]"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.today_appointments ?? 0}
          icon={Calendar}
          gradient="from-[#7A2E3E] to-[#9B3D52]"
        />
        <StatCard
          title="Customers"
          value={stats.total_customers ?? 0}
          icon={Users}
          gradient="from-[#B76E79] to-[#D4A5AE]"
        />
        <StatCard
          title="Active Staff"
          value={stats.active_staff ?? 0}
          icon={UserCheck}
          gradient="from-[#5C2230] to-[#7A2E3E]"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.total_revenue ?? 0, currency)}
          icon={DollarSign}
          gradient="from-[#6B4C3B] to-[#A67C52]"
        />
        <StatCard
          title="Total Appointments"
          value={stats.total_appointments ?? 0}
          icon={Clock}
          gradient="from-[#9B3D52] to-[#B76E79]"
        />
        <StatCard
          title="Pending Today"
          value={stats.pending_appointments ?? stats.pending_payments ?? 0}
          icon={CalendarClock}
          gradient="from-[#7A2E3E] to-[#C47B8A]"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.low_stock_count ?? 0}
          icon={(stats.low_stock_count ?? 0) > 0 ? AlertTriangle : Package}
          gradient="from-[#8B4513] to-[#CD853F]"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue — Last 7 Days</CardTitle>
            <CardDescription>Daily paid invoice totals</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              labels={charts.revenue.labels}
              values={charts.revenue.data}
              formatValue={(v) => formatCurrency(v, currency)}
              colorClass="bg-gradient-to-r from-[#7A2E3E] to-[#C9A46C]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
            <CardDescription>Last 30 days by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              labels={charts.services.labels}
              values={charts.services.data}
              formatValue={(v) => formatCurrency(v, currency)}
              colorClass="bg-secondary/80"
              emptyMessage="No service sales yet"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appointments — Last 7 Days</CardTitle>
            <CardDescription>Daily booking volume</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              labels={charts.appointments.labels}
              values={charts.appointments.data}
              formatValue={(v) => String(v)}
              colorClass="bg-primary/60"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Next scheduled visits</CardDescription>
            </div>
            <Link to="/appointments" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No upcoming appointments</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((appt) => (
                  <Link
                    key={appt.id}
                    to="/appointments"
                    className="flex items-start justify-between gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {appt.customer?.name ?? 'Walk-in'} · {appt.code}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(appt.scheduled_at, settings.timezone)}
                        {appt.staff?.name ? ` · ${appt.staff.name}` : ''}
                      </p>
                    </div>
                    <Badge>{appt.status.replace(/_/g, ' ')}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the salon</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No recent activity</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg border border-border/60 p-3"
                >
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{activity.action_label}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{activity.description}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground/70">
                      {formatDate(activity.created_at, settings.timezone)}
                      {activity.user?.name ? ` · ${activity.user.name}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
