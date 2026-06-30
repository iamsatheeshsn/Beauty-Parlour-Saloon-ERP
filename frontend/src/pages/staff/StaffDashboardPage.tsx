import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Users, Calendar, FileWarning, UserCheck } from 'lucide-react'
import { Breadcrumb, Card, CardContent, CardHeader, CardTitle, PageLoader, buttonVariants } from '@/components'
import { StatCard } from '@/components/dashboard/StatCard'
import { staffService } from '@/services/staffService'

export default function StaffDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['staff-dashboard'],
    queryFn: () => staffService.dashboard(),
  })

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Staff', href: '/staff' }, { label: 'Dashboard' }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Staff Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">HR overview — attendance, leave, and compliance</p>
        </div>
        <Link to="/staff/directory" className={buttonVariants({ variant: 'outline' })}>
          <Users className="mr-2 h-4 w-4" />
          Staff Directory
        </Link>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load staff dashboard.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Active Staff" value={data?.active_staff ?? 0} icon={Users} />
          <StatCard title="Present Today" value={data?.attendance_today ?? 0} icon={UserCheck} />
          <StatCard title="Pending Leave" value={data?.pending_leave ?? 0} icon={Calendar} />
          <StatCard title="Expiring Docs (30d)" value={data?.expiring_documents ?? 0} icon={FileWarning} />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-lg">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link to="/staff/directory" className={buttonVariants()}>
            Manage Staff
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
