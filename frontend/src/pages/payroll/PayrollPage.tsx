import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import {
  Banknote,
  Calculator,
  FileText,
  Pencil,
  Percent,
  Plus,
  Trash2,
} from 'lucide-react'
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardContent,
  CardHeader,
  ConfirmDialog,
  DataTable,
  Input,
  Modal,
  PageLoader,
  PageTabs,
  Pagination,
  SearchInput,
  Select,
  Textarea,
  buttonVariants,
} from '@/components'
import { PayslipPrint } from '@/components/payroll/PayslipPrint'
import { StatCard } from '@/components/dashboard/StatCard'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { useAppSettings } from '@/contexts/SettingsContext'
import {
  monthPeriod,
  payrollService,
  PAYSLIP_STATUS_OPTIONS,
  payslipStatusLabel,
  payslipStatusVariant,
  type Payslip,
  type PayrollPreview,
  type StaffPayrollOverview,
} from '@/services/payrollService'
import { formatCurrency } from '@/utils/format'
import { isPaginated } from '@/utils/master'

type Tab = 'salary' | 'calculate' | 'payslips'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response
    return res?.data?.message ?? 'Something went wrong.'
  }
  return 'Something went wrong.'
}

export default function PayrollPage() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()
  const { settings } = useAppSettings()
  const currency = settings?.currency ?? 'AED'
  const defaultPeriod = monthPeriod()

  const [tab, setTab] = useState<Tab>('salary')
  const [periodStart, setPeriodStart] = useState(defaultPeriod.period_start)
  const [periodEnd, setPeriodEnd] = useState(defaultPeriod.period_end)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const [calcUserId, setCalcUserId] = useState('')
  const [preview, setPreview] = useState<PayrollPreview | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [generateNotes, setGenerateNotes] = useState('')
  const [otherDeductions, setOtherDeductions] = useState('')
  const [otherAdditions, setOtherAdditions] = useState('')

  const [printPayslip, setPrintPayslip] = useState<Payslip | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Payslip | null>(null)

  const canGenerate = hasPermission('payslips.generate')
  const canUpdate = hasPermission('payslips.update')
  const canDelete = hasPermission('payslips.delete')

  const { data: stats } = useQuery({
    queryKey: ['payroll-stats', periodStart, periodEnd],
    queryFn: () => payrollService.stats({ period_start: periodStart, period_end: periodEnd }),
  })

  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['payroll-staff-overview', periodStart, periodEnd],
    queryFn: () => payrollService.staffOverview(periodStart, periodEnd),
    enabled: tab === 'salary' || tab === 'calculate',
  })

  const { data: pendingLeave } = useQuery({
    queryKey: ['payroll-pending-leave'],
    queryFn: () => payrollService.pendingLeave(),
    enabled: tab === 'salary' || tab === 'calculate',
  })

  const { data: payslipsData, isLoading: payslipsLoading } = useQuery({
    queryKey: ['payslips', page, debouncedSearch, statusFilter, periodStart, periodEnd],
    queryFn: () =>
      payrollService.listPayslips({
        page,
        per_page: 15,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        period_start: periodStart,
        period_end: periodEnd,
      }),
    enabled: tab === 'payslips',
  })

  const payslipRows = useMemo(() => {
    if (!payslipsData) return { items: [] as Payslip[], meta: null }
    if (isPaginated<Payslip>(payslipsData)) return { items: payslipsData.data, meta: payslipsData.meta }
    return { items: payslipsData as Payslip[], meta: null }
  }, [payslipsData])

  const staffWithSalary = (overview ?? []).filter((s) => s.current_salary)

  const previewMutation = useMutation({
    mutationFn: () =>
      payrollService.preview({
        user_id: Number(calcUserId),
        period_start: periodStart,
        period_end: periodEnd,
      }),
    onSuccess: (data) => {
      setPreview(data)
      setPreviewError(null)
    },
    onError: (err) => setPreviewError(extractError(err)),
  })

  const generateMutation = useMutation({
    mutationFn: (payload: { user_id?: number }) =>
      payrollService.generate({
        ...payload,
        period_start: periodStart,
        period_end: periodEnd,
        notes: generateNotes || undefined,
        other_deductions: otherDeductions ? Number(otherDeductions) : undefined,
        other_additions: otherAdditions ? Number(otherAdditions) : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payslips'] })
      queryClient.invalidateQueries({ queryKey: ['payroll-stats'] })
      queryClient.invalidateQueries({ queryKey: ['payroll-staff-overview'] })
      setPreview(null)
      setTab('payslips')
    },
    onError: (err) => setPreviewError(extractError(err)),
  })

  const approveMutation = useMutation({
    mutationFn: payrollService.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payslips'] })
      queryClient.invalidateQueries({ queryKey: ['payroll-stats'] })
    },
  })

  const markPaidMutation = useMutation({
    mutationFn: payrollService.markPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payslips'] })
      queryClient.invalidateQueries({ queryKey: ['payroll-stats'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: payrollService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payslips'] })
      queryClient.invalidateQueries({ queryKey: ['payroll-stats'] })
      queryClient.invalidateQueries({ queryKey: ['payroll-staff-overview'] })
      setDeleteTarget(null)
    },
  })

  const viewPayslip = async (id: number) => {
    const full = await payrollService.getPayslip(id)
    setPrintPayslip(full)
  }

  const salaryColumns: ColumnDef<StaffPayrollOverview, unknown>[] = [
    {
      id: 'employee',
      header: 'Employee',
      cell: ({ row }) => (
        <div>
          <Link to={`/staff/${row.original.user_id}`} className="font-medium text-primary hover:underline">
            {row.original.name}
          </Link>
          <p className="text-xs text-muted-foreground">{row.original.employee_code ?? '—'}</p>
        </div>
      ),
    },
    {
      id: 'branch',
      header: 'Branch',
      cell: ({ row }) => row.original.branch?.name ?? '—',
    },
    {
      id: 'salary',
      header: 'Monthly Salary',
      cell: ({ row }) =>
        row.original.current_salary
          ? formatCurrency(row.original.current_salary.total_salary, row.original.current_salary.currency ?? currency)
          : <span className="text-muted-foreground">Not set</span>,
    },
    {
      id: 'payslip',
      header: 'Payslip',
      cell: ({ row }) =>
        row.original.payslip ? (
          <Badge variant={payslipStatusVariant(row.original.payslip.status)}>
            {row.original.payslip.code} — {payslipStatusLabel(row.original.payslip.status)}
          </Badge>
        ) : (
          <span className="text-muted-foreground">Not generated</span>
        ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Link to={`/staff/${row.original.user_id}`} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
          Manage
        </Link>
      ),
    },
  ]

  const payslipColumns: ColumnDef<Payslip, unknown>[] = [
    { accessorKey: 'code', header: 'Payslip #' },
    {
      id: 'employee',
      header: 'Employee',
      cell: ({ row }) => row.original.user?.name ?? '—',
    },
    {
      accessorKey: 'gross_salary',
      header: 'Gross',
      cell: ({ getValue }) => formatCurrency(Number(getValue()), currency),
    },
    {
      accessorKey: 'commission_amount',
      header: 'Commission',
      cell: ({ getValue }) => formatCurrency(Number(getValue()), currency),
    },
    {
      accessorKey: 'leave_deduction',
      header: 'Leave Ded.',
      cell: ({ getValue, row }) =>
        Number(getValue()) > 0 ? (
          <span className="text-destructive">-{formatCurrency(Number(getValue()), currency)} ({row.original.leave_days}d)</span>
        ) : '—',
    },
    {
      accessorKey: 'net_pay',
      header: 'Net Pay',
      cell: ({ getValue }) => <span className="font-semibold">{formatCurrency(Number(getValue()), currency)}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => (
        <Badge variant={payslipStatusVariant(getValue() as Payslip['status'])}>
          {payslipStatusLabel(getValue() as Payslip['status'])}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => viewPayslip(row.original.id)}>View</Button>
          {canUpdate && row.original.status === 'draft' && (
            <Button variant="outline" size="sm" onClick={() => approveMutation.mutate(row.original.id)}>Approve</Button>
          )}
          {canUpdate && row.original.status === 'approved' && (
            <Button variant="outline" size="sm" onClick={() => markPaidMutation.mutate(row.original.id)}>Mark Paid</Button>
          )}
          {canDelete && row.original.status === 'draft' && (
            <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(row.original)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  const tabs: { key: Tab; label: string; icon: typeof Banknote }[] = [
    { key: 'salary', label: 'Salary', icon: Banknote },
    { key: 'calculate', label: 'Calculate', icon: Calculator },
    { key: 'payslips', label: 'Payslips', icon: FileText },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Payroll & Commission' }]} />

      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">Payroll & Commission</h1>
          <p className="text-muted-foreground">Salary, commission calculation, leave deductions & payslips</p>
        </div>
        <div className="flex shrink-0 flex-nowrap items-end gap-1.5 overflow-x-auto">
          <Input label="Period from" type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} className="w-40" />
          <Input label="Period to" type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} className="w-40" />
          {canGenerate && tab === 'payslips' && (
            <Button
              variant="outline"
              onClick={() => generateMutation.mutate({})}
              loading={generateMutation.isPending}
            >
              <Plus className="mr-2 h-4 w-4" /> Generate All
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Payslips" value={stats?.total ?? 0} icon={FileText} />
        <StatCard title="Draft" value={stats?.draft ?? 0} icon={Pencil} />
        <StatCard title="Paid" value={stats?.paid ?? 0} icon={Banknote} gradient="from-emerald-600 via-emerald-500 to-emerald-400" />
        <StatCard title="Total Net Pay" value={formatCurrency(stats?.total_net_pay ?? 0, currency)} icon={Percent} />
      </div>

      {(pendingLeave?.length ?? 0) > 0 && tab !== 'payslips' && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="py-3 text-sm">
            <strong>{pendingLeave?.length}</strong> pending leave request(s) may affect payroll.
            Review under Staff profiles or approve before generating payslips.
          </CardContent>
        </Card>
      )}

      <PageTabs<Tab> tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'salary' && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Staff Salary Overview</h3>
            <p className="text-sm text-muted-foreground">
              Configure salary and commission rules in each staff profile.
            </p>
          </CardHeader>
          <CardContent>
            {overviewLoading ? <PageLoader /> : (
              <DataTable columns={salaryColumns} data={overview ?? []} />
            )}
          </CardContent>
        </Card>
      )}

      {tab === 'calculate' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><h3 className="font-semibold">Commission & Leave Calculation</h3></CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Staff member"
                value={calcUserId}
                onChange={(e) => { setCalcUserId(e.target.value); setPreview(null) }}
                options={[
                  { value: '', label: 'Select staff' },
                  ...staffWithSalary.map((s) => ({ value: String(s.user_id), label: `${s.name} (${s.employee_code ?? s.user_id})` })),
                ]}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Other deductions" type="number" step="0.01" value={otherDeductions} onChange={(e) => setOtherDeductions(e.target.value)} />
                <Input label="Other additions" type="number" step="0.01" value={otherAdditions} onChange={(e) => setOtherAdditions(e.target.value)} />
              </div>
              <Textarea label="Notes" value={generateNotes} onChange={(e) => setGenerateNotes(e.target.value)} />
              {previewError && <p className="text-sm text-destructive">{previewError}</p>}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={!calcUserId}
                  loading={previewMutation.isPending}
                  onClick={() => previewMutation.mutate()}
                >
                  Preview Calculation
                </Button>
                {canGenerate && (
                  <Button
                    disabled={!calcUserId}
                    loading={generateMutation.isPending}
                    onClick={() => generateMutation.mutate({ user_id: Number(calcUserId) })}
                  >
                    Generate Payslip
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Commission is calculated from paid sales assigned to the stylist. Unpaid approved leave is deducted at daily rate (salary ÷ 30).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><h3 className="font-semibold">Preview Breakdown</h3></CardHeader>
            <CardContent>
              {!preview ? (
                <p className="py-8 text-center text-muted-foreground">Select staff and run preview to see breakdown.</p>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span>Gross salary</span><span>{formatCurrency(preview.gross_salary, preview.currency)}</span></div>
                  <div className="flex justify-between"><span>Commission</span><span className="text-green-700">+{formatCurrency(preview.commission_amount, preview.currency)}</span></div>
                  {preview.leave_deduction > 0 && (
                    <div className="flex justify-between"><span>Leave deduction ({preview.leave_days} days)</span><span className="text-destructive">-{formatCurrency(preview.leave_deduction, preview.currency)}</span></div>
                  )}
                  <hr />
                  <div className="flex justify-between font-bold text-base"><span>Net pay</span><span>{formatCurrency(preview.net_pay, preview.currency)}</span></div>
                  {preview.snapshot?.commission?.lines && preview.snapshot.commission.lines.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 font-medium">Commission lines</p>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {preview.snapshot.commission.lines.map((line, i) => (
                          <li key={i} className="flex justify-between">
                            <span>{line.description}</span>
                            <span>{formatCurrency(line.amount, preview.currency)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'payslips' && (
        <Card>
          <CardHeader className="flex flex-wrap gap-2">
            <SearchInput value={search} onChange={setSearch} placeholder="Search payslips…" className="max-w-xs" />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[{ value: '', label: 'All status' }, ...PAYSLIP_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))]}
              className="w-36"
            />
          </CardHeader>
          <CardContent>
            {payslipsLoading ? <PageLoader /> : (
              <>
                <DataTable columns={payslipColumns} data={payslipRows.items} />
                {payslipRows.meta && payslipRows.meta.last_page > 1 && (
                  <Pagination currentPage={payslipRows.meta.current_page} totalPages={payslipRows.meta.last_page} onPageChange={setPage} />
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Modal open={!!printPayslip} onOpenChange={(open) => !open && setPrintPayslip(null)} title={`Payslip ${printPayslip?.code ?? ''}`} className="max-w-lg">
        {printPayslip && (
          <PayslipPrint payslip={printPayslip} onClose={() => setPrintPayslip(null)} />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Payslip"
        description={`Delete payslip "${deleteTarget?.code}"? Only draft payslips can be deleted.`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  )
}
