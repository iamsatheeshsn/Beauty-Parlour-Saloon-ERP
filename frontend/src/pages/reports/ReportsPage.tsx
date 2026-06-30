import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import {
  BarChart3,
  CircleDollarSign,
  Package,
  Percent,
  Receipt,
  TrendingUp,
  Users,
  UserSquare2,
} from 'lucide-react'
import {
  Breadcrumb,
  Card,
  CardContent,
  CardHeader,
  DataTable,
  Input,
  PageLoader,
  PageTabs,
  Select,
} from '@/components'
import { StatCard } from '@/components/dashboard/StatCard'
import { usePermission } from '@/hooks/usePermission'
import { useAppSettings } from '@/contexts/SettingsContext'
import { branchService } from '@/services/masterService'
import { reportsService } from '@/services/reportsService'
import { formatCurrency, formatDate } from '@/utils/format'
import { cn } from '@/utils/cn'

type Tab = 'overview' | 'sales' | 'customers' | 'staff' | 'inventory' | 'financial' | 'vat'

function monthStart(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

function BarChart({
  labels,
  values,
  formatValue,
  colorClass = 'bg-primary/70',
}: {
  labels: string[]
  values: number[]
  formatValue: (v: number) => string
  colorClass?: string
}) {
  const max = Math.max(...values, 1)
  return (
    <div className="space-y-3">
      {labels.map((label, i) => {
        const value = values[i] ?? 0
        const width = `${(value / max) * 100}%`
        return (
          <div key={`${label}-${i}`} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-sm text-muted-foreground">{label}</span>
            <div className="h-6 flex-1 rounded bg-muted">
              <div className={cn('h-6 rounded', colorClass)} style={{ width }} />
            </div>
            <span className="w-28 shrink-0 text-right text-sm font-medium">{formatValue(value)}</span>
          </div>
        )
      })}
    </div>
  )
}

function DualBarChart({
  labels,
  primary,
  secondary,
  primaryLabel,
  secondaryLabel,
  formatValue,
}: {
  labels: string[]
  primary: number[]
  secondary: number[]
  primaryLabel: string
  secondaryLabel: string
  formatValue: (v: number) => string
}) {
  const max = Math.max(...primary, ...secondary, 1)
  return (
    <div className="space-y-4">
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded bg-primary/70" /> {primaryLabel}</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded bg-secondary/70" /> {secondaryLabel}</span>
      </div>
      {labels.map((label, i) => {
        const a = primary[i] ?? 0
        const b = secondary[i] ?? 0
        return (
          <div key={label} className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className="flex items-center gap-2">
              <div className="h-5 flex-1 rounded bg-muted">
                <div className="h-5 rounded bg-primary/70" style={{ width: `${(a / max) * 100}%` }} />
              </div>
              <span className="w-24 text-right text-xs">{formatValue(a)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 flex-1 rounded bg-muted">
                <div className="h-5 rounded bg-secondary/70" style={{ width: `${(b / max) * 100}%` }} />
              </div>
              <span className="w-24 text-right text-xs">{formatValue(b)}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function ReportsPage() {
  const { hasPermission } = usePermission()
  const { settings } = useAppSettings()
  const currency = settings?.currency ?? 'AED'
  const canView = hasPermission('reports.view')

  const [tab, setTab] = useState<Tab>('overview')
  const [dateFrom, setDateFrom] = useState(monthStart)
  const [dateTo, setDateTo] = useState(today)
  const [branchId, setBranchId] = useState('')

  const filters = useMemo(
    () => ({
      date_from: dateFrom,
      date_to: dateTo,
      branch_id: branchId ? Number(branchId) : undefined,
    }),
    [dateFrom, dateTo, branchId]
  )

  const { data: branches } = useQuery({
    queryKey: ['branches-options'],
    queryFn: () => branchService.list({ all: true }),
    enabled: canView,
  })

  const branchOptions = useMemo(() => {
    const list = Array.isArray(branches) ? branches : branches?.data ?? []
    return list.map((b: { id: number; name: string }) => ({ value: String(b.id), label: b.name }))
  }, [branches])

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['reports-summary', filters],
    queryFn: () => reportsService.summary(filters),
    enabled: canView && tab === 'overview',
  })

  const { data: sales, isLoading: salesLoading } = useQuery({
    queryKey: ['reports-sales', filters],
    queryFn: () => reportsService.sales(filters),
    enabled: canView && tab === 'sales',
  })

  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ['reports-customers', filters],
    queryFn: () => reportsService.customers(filters),
    enabled: canView && tab === 'customers',
  })

  const { data: staff, isLoading: staffLoading } = useQuery({
    queryKey: ['reports-staff', filters],
    queryFn: () => reportsService.staff(filters),
    enabled: canView && tab === 'staff',
  })

  const { data: inventory, isLoading: inventoryLoading } = useQuery({
    queryKey: ['reports-inventory', filters],
    queryFn: () => reportsService.inventory(filters),
    enabled: canView && tab === 'inventory',
  })

  const { data: financial, isLoading: financialLoading } = useQuery({
    queryKey: ['reports-financial', filters],
    queryFn: () => reportsService.financial(filters),
    enabled: canView && tab === 'financial',
  })

  const { data: vat, isLoading: vatLoading } = useQuery({
    queryKey: ['reports-vat', filters],
    queryFn: () => reportsService.vat(filters),
    enabled: canView && tab === 'vat',
  })

  const fmt = (n: number) => formatCurrency(n, currency)

  const tabs: { key: Tab; label: string; icon: typeof BarChart3 }[] = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'sales', label: 'Sales', icon: Receipt },
    { key: 'customers', label: 'Customers', icon: Users },
    { key: 'staff', label: 'Staff', icon: UserSquare2 },
    { key: 'inventory', label: 'Inventory', icon: Package },
    { key: 'financial', label: 'Financial', icon: TrendingUp },
    { key: 'vat', label: 'VAT', icon: Percent },
  ]

  const topServiceColumns: ColumnDef<{ name: string; quantity: number; revenue: number }>[] = [
    { accessorKey: 'name', header: 'Service' },
    { accessorKey: 'quantity', header: 'Qty' },
    { accessorKey: 'revenue', header: 'Revenue', cell: ({ getValue }) => fmt(getValue<number>()) },
  ]

  const topCustomerColumns: ColumnDef<{ name: string; phone?: string | null; visits: number; spent: number }>[] = [
    { accessorKey: 'name', header: 'Customer' },
    { accessorKey: 'phone', header: 'Phone', cell: ({ getValue }) => getValue<string>() ?? '—' },
    { accessorKey: 'visits', header: 'Visits' },
    { accessorKey: 'spent', header: 'Spent', cell: ({ getValue }) => fmt(getValue<number>()) },
  ]

  const staffRevenueColumns: ColumnDef<{ name: string; sales_count: number; revenue: number }>[] = [
    { accessorKey: 'name', header: 'Staff' },
    { accessorKey: 'sales_count', header: 'Sales' },
    { accessorKey: 'revenue', header: 'Revenue', cell: ({ getValue }) => fmt(getValue<number>()) },
  ]

  const vatRateColumns: ColumnDef<{ vat_rate: number; taxable_amount: number; vat_amount: number }>[] = [
    { accessorKey: 'vat_rate', header: 'Rate', cell: ({ getValue }) => `${getValue<number>()}%` },
    { accessorKey: 'taxable_amount', header: 'Taxable', cell: ({ getValue }) => fmt(getValue<number>()) },
    { accessorKey: 'vat_amount', header: 'VAT', cell: ({ getValue }) => fmt(getValue<number>()) },
  ]

  const loading =
    (tab === 'overview' && summaryLoading) ||
    (tab === 'sales' && salesLoading) ||
    (tab === 'customers' && customersLoading) ||
    (tab === 'staff' && staffLoading) ||
    (tab === 'inventory' && inventoryLoading) ||
    (tab === 'financial' && financialLoading) ||
    (tab === 'vat' && vatLoading)

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Reports' }]} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground">Sales, customers, staff, inventory, financial, and VAT insights</p>
      </div>

      {!canView ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            You do not have permission to view reports.
          </CardContent>
        </Card>
      ) : (
        <>
          <PageTabs<Tab> tabs={tabs} active={tab} onChange={setTab} />

          <Card>
            <CardHeader className="flex flex-wrap items-end gap-4">
              <Input label="From" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-40" />
              <Input label="To" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-40" />
              <Select
                label="Branch"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                options={[{ value: '', label: 'All branches' }, ...branchOptions]}
                className="w-48"
              />
            </CardHeader>
          </Card>

          {loading ? (
            <PageLoader />
          ) : (
            <>
              {tab === 'overview' && summary && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Revenue" value={fmt(summary.sales.total_revenue)} icon={Receipt} />
                    <StatCard title="Invoices" value={String(summary.sales.invoice_count)} icon={BarChart3} />
                    <StatCard title="Net Profit" value={fmt(summary.financial.net_profit)} icon={TrendingUp} />
                    <StatCard title="VAT Payable" value={fmt(summary.vat.net_vat_payable)} icon={Percent} />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Metric label="Avg. Ticket" value={fmt(summary.sales.average_ticket)} />
                    <Metric label="New Customers" value={String(summary.customers.new_customers)} sub={`${summary.customers.total_customers} total`} />
                    <Metric label="Stock Value" value={fmt(summary.inventory.stock_value)} sub={`${summary.inventory.low_stock_count} low stock`} />
                    <Metric label="Expenses" value={fmt(summary.financial.expenses)} />
                    <Metric label="Payroll" value={fmt(summary.financial.payroll)} />
                    <Metric
                      label="Period"
                      value={`${formatDate(summary.period.from)} — ${formatDate(summary.period.to)}`}
                    />
                  </div>
                </div>
              )}

              {tab === 'sales' && sales && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Metric label="Total Revenue" value={fmt(sales.summary.total_revenue)} />
                    <Metric label="Invoices" value={String(sales.summary.invoice_count)} />
                    <Metric label="Avg. Ticket" value={fmt(sales.summary.average_ticket)} />
                    <Metric label="VAT Collected" value={fmt(sales.summary.vat_collected)} />
                  </div>
                  <Card>
                    <CardHeader><h3 className="font-semibold">Daily Revenue</h3></CardHeader>
                    <CardContent>
                      <BarChart labels={sales.by_day.labels} values={sales.by_day.data} formatValue={fmt} />
                    </CardContent>
                  </Card>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader><h3 className="font-semibold">By Payment Method</h3></CardHeader>
                      <CardContent>
                        {sales.by_payment_method.length > 0 ? (
                          <BarChart
                            labels={sales.by_payment_method.map((p) => p.name)}
                            values={sales.by_payment_method.map((p) => p.total)}
                            formatValue={fmt}
                            colorClass="bg-accent/70"
                          />
                        ) : (
                          <p className="py-8 text-center text-muted-foreground">No sales in this period.</p>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader><h3 className="font-semibold">By Branch</h3></CardHeader>
                      <CardContent>
                        {sales.by_branch.length > 0 ? (
                          <BarChart
                            labels={sales.by_branch.map((b) => b.name)}
                            values={sales.by_branch.map((b) => b.revenue)}
                            formatValue={fmt}
                            colorClass="bg-secondary/70"
                          />
                        ) : (
                          <p className="py-8 text-center text-muted-foreground">No branch data.</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader><h3 className="font-semibold">Top Services</h3></CardHeader>
                    <CardContent>
                      {sales.top_services.length > 0 ? (
                        <DataTable columns={topServiceColumns} data={sales.top_services} />
                      ) : (
                        <p className="py-8 text-center text-muted-foreground">No service sales in this period.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {tab === 'customers' && customers && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Metric label="Total Customers" value={String(customers.summary.total_customers)} />
                    <Metric label="Active" value={String(customers.summary.active_customers)} />
                    <Metric label="New (Period)" value={String(customers.summary.new_customers)} />
                    <Metric label="With Purchases" value={String(customers.summary.customers_with_purchases)} />
                  </div>
                  <Card>
                    <CardHeader><h3 className="font-semibold">New Customers by Day</h3></CardHeader>
                    <CardContent>
                      <BarChart
                        labels={customers.new_by_day.labels}
                        values={customers.new_by_day.data}
                        formatValue={(v) => String(v)}
                        colorClass="bg-primary/60"
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><h3 className="font-semibold">Top Customers</h3></CardHeader>
                    <CardContent>
                      {customers.top_customers.length > 0 ? (
                        <DataTable columns={topCustomerColumns} data={customers.top_customers} />
                      ) : (
                        <p className="py-8 text-center text-muted-foreground">No customer purchases in this period.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {tab === 'staff' && staff && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Metric label="Active Staff" value={String(staff.summary.active_staff)} />
                    <Metric label="Appointments" value={String(staff.summary.appointments)} />
                    <Metric label="Payroll Paid" value={fmt(staff.summary.payroll_paid)} />
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader><h3 className="font-semibold">Revenue by Staff</h3></CardHeader>
                      <CardContent>
                        {staff.revenue_by_staff.length > 0 ? (
                          <DataTable columns={staffRevenueColumns} data={staff.revenue_by_staff} />
                        ) : (
                          <p className="py-8 text-center text-muted-foreground">No staff-attributed sales.</p>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader><h3 className="font-semibold">Appointments by Staff</h3></CardHeader>
                      <CardContent>
                        {staff.appointments_by_staff.length > 0 ? (
                          <BarChart
                            labels={staff.appointments_by_staff.map((s) => s.name)}
                            values={staff.appointments_by_staff.map((s) => s.appointments)}
                            formatValue={(v) => String(v)}
                            colorClass="bg-secondary/70"
                          />
                        ) : (
                          <p className="py-8 text-center text-muted-foreground">No appointments in this period.</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {tab === 'inventory' && inventory && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <Metric label="Products" value={String(inventory.summary.product_count)} />
                    <Metric label="Stock Value" value={fmt(inventory.summary.stock_value)} />
                    <Metric label="Low Stock" value={String(inventory.summary.low_stock_count)} />
                    <Metric label="Purchases" value={fmt(inventory.summary.purchases_total)} />
                    <Metric label="Consumption (units)" value={String(inventory.summary.consumption_units)} />
                  </div>
                  <Card>
                    <CardHeader><h3 className="font-semibold">Stock Movements by Type</h3></CardHeader>
                    <CardContent>
                      {inventory.movements_by_type.length > 0 ? (
                        <BarChart
                          labels={inventory.movements_by_type.map((m) => m.type)}
                          values={inventory.movements_by_type.map((m) => m.quantity)}
                          formatValue={(v) => String(v)}
                          colorClass="bg-accent/70"
                        />
                      ) : (
                        <p className="py-8 text-center text-muted-foreground">No movements in this period.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {tab === 'financial' && financial && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Revenue" value={fmt(financial.summary.revenue)} icon={CircleDollarSign} />
                    <StatCard title="Expenses" value={fmt(financial.summary.expenses)} icon={Receipt} />
                    <StatCard title="Net Profit" value={fmt(financial.summary.net_profit)} icon={TrendingUp} />
                    <StatCard
                      title="Margin"
                      value={`${financial.summary.profit_margin}%`}
                      icon={Percent}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Metric label="Payroll" value={fmt(financial.summary.payroll)} />
                    <Metric label="Inventory Purchases" value={fmt(financial.summary.inventory_purchases)} />
                    <Metric label="Total Outflow" value={fmt(financial.summary.total_outflow)} />
                  </div>
                  <Card>
                    <CardHeader><h3 className="font-semibold">6-Month Trend</h3></CardHeader>
                    <CardContent>
                      <DualBarChart
                        labels={financial.monthly.labels}
                        primary={financial.monthly.revenue}
                        secondary={financial.monthly.expenses}
                        primaryLabel="Revenue"
                        secondaryLabel="Expenses"
                        formatValue={fmt}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {tab === 'vat' && vat && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Metric label="Output VAT (Sales)" value={fmt(vat.summary.output_vat)} sub={`Taxable: ${fmt(vat.summary.output_taxable)}`} />
                    <Metric label="Input VAT" value={fmt(vat.summary.total_input_vat)} sub={`Expenses: ${fmt(vat.summary.input_vat_expenses)} · Purchases: ${fmt(vat.summary.input_vat_purchases)}`} />
                    <Metric label="Net VAT Payable" value={fmt(vat.summary.net_vat_payable)} />
                  </div>
                  <Card>
                    <CardHeader><h3 className="font-semibold">6-Month VAT Trend</h3></CardHeader>
                    <CardContent>
                      <DualBarChart
                        labels={vat.monthly.labels}
                        primary={vat.monthly.output}
                        secondary={vat.monthly.input}
                        primaryLabel="Output VAT"
                        secondaryLabel="Input VAT"
                        formatValue={fmt}
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><h3 className="font-semibold">Sales VAT by Rate</h3></CardHeader>
                    <CardContent>
                      {vat.sales_by_rate.length > 0 ? (
                        <DataTable columns={vatRateColumns} data={vat.sales_by_rate} />
                      ) : (
                        <p className="py-8 text-center text-muted-foreground">No VAT data in this period.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
