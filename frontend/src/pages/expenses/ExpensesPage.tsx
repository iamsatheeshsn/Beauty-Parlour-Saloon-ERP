import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import {
  BarChart3,
  ExternalLink,
  FileText,
  Pencil,
  Plus,
  Receipt,
  Trash2,
  Upload,
  Wallet,
} from 'lucide-react'
import {
  Breadcrumb,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  ConfirmDialog,
  DataTable,
  Form,
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
import { StatCard } from '@/components/dashboard/StatCard'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { useAppSettings } from '@/contexts/SettingsContext'
import {
  expenseCategoryService,
  paymentMethodService,
} from '@/services/masterService'
import {
  expenseService,
  type ExpenseCategoryReport,
  type ExpenseItem,
  type ExpensePayload,
} from '@/services/expenseService'
import { formatCurrency, formatDate } from '@/utils/format'
import { isPaginated } from '@/utils/master'

type Tab = 'entries' | 'reports'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response
    return res?.data?.message ?? 'Something went wrong.'
  }
  return 'Something went wrong.'
}

const emptyForm = (): ExpensePayload => ({
  expense_category_id: 0,
  vendor_name: '',
  reference: '',
  description: '',
  amount: 0,
  vat_rate: 0,
  vat_inclusive: false,
  expense_date: new Date().toISOString().slice(0, 10),
  notes: '',
})

export default function ExpensesPage() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()
  const { settings } = useAppSettings()
  const currency = settings?.currency ?? 'AED'

  const [tab, setTab] = useState<Tab>('entries')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const [reportFrom, setReportFrom] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
  })
  const [reportTo, setReportTo] = useState(() => new Date().toISOString().slice(0, 10))

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ExpenseItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ExpenseItem | null>(null)
  const [form, setForm] = useState<ExpensePayload>(emptyForm())
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const canCreate = hasPermission('expenses.create')
  const canUpdate = hasPermission('expenses.update')
  const canDelete = hasPermission('expenses.delete')
  const canReport = hasPermission('expenses.reports')

  const { data: stats } = useQuery({
    queryKey: ['expense-stats'],
    queryFn: () => expenseService.stats(),
  })

  const { data: categories } = useQuery({
    queryKey: ['expense-categories-options'],
    queryFn: () => expenseCategoryService.list({ all: true }),
  })

  const { data: paymentMethods } = useQuery({
    queryKey: ['payment-methods-options'],
    queryFn: () => paymentMethodService.list({ all: true }),
  })

  const { data: listData, isLoading } = useQuery({
    queryKey: ['expenses', page, debouncedSearch, categoryFilter, dateFrom, dateTo],
    queryFn: () =>
      expenseService.list({
        page,
        per_page: 15,
        search: debouncedSearch || undefined,
        expense_category_id: categoryFilter ? Number(categoryFilter) : undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      }),
    enabled: tab === 'entries',
  })

  const { data: report, isLoading: reportLoading } = useQuery({
    queryKey: ['expense-report', reportFrom, reportTo],
    queryFn: () => expenseService.report({ date_from: reportFrom, date_to: reportTo }),
    enabled: tab === 'reports' && canReport,
  })

  const rows = useMemo(() => {
    if (!listData) return { items: [] as ExpenseItem[], meta: null }
    if (isPaginated<ExpenseItem>(listData)) return { items: listData.data, meta: listData.meta }
    return { items: listData as ExpenseItem[], meta: null }
  }, [listData])

  const categoryOptions = (Array.isArray(categories) ? categories : []).map((c: { id: number; name: string }) => ({
    value: c.id,
    label: c.name,
  }))

  const paymentOptions = (Array.isArray(paymentMethods) ? paymentMethods : []).map((p: { id: number; name: string }) => ({
    value: p.id,
    label: p.name,
  }))

  const createMutation = useMutation({
    mutationFn: ({ payload, receipt }: { payload: ExpensePayload; receipt?: File }) =>
      expenseService.create(payload, receipt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] })
      queryClient.invalidateQueries({ queryKey: ['expense-report'] })
      closeForm()
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload, receipt }: { id: number; payload: Partial<ExpensePayload>; receipt?: File }) =>
      expenseService.update(id, payload, receipt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] })
      queryClient.invalidateQueries({ queryKey: ['expense-report'] })
      closeForm()
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: expenseService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] })
      queryClient.invalidateQueries({ queryKey: ['expense-report'] })
      setDeleteTarget(null)
    },
  })

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm())
    setReceiptFile(null)
    setFormError(null)
    setFormOpen(true)
  }

  const openEdit = (row: ExpenseItem) => {
    setEditing(row)
    setForm({
      expense_category_id: row.expense_category_id,
      payment_method_id: row.payment_method_id,
      vendor_name: row.vendor_name,
      reference: row.reference,
      description: row.description,
      amount: row.amount,
      vat_rate: row.vat_rate,
      vat_inclusive: row.vat_inclusive,
      expense_date: row.expense_date,
      notes: row.notes,
    })
    setReceiptFile(null)
    setFormError(null)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
    setReceiptFile(null)
    setFormError(null)
  }

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.expense_category_id) {
      setFormError('Please select a category.')
      return
    }
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload: form, receipt: receiptFile ?? undefined })
    } else {
      createMutation.mutate({ payload: form, receipt: receiptFile ?? undefined })
    }
  }

  const columns: ColumnDef<ExpenseItem, unknown>[] = [
    { accessorKey: 'code', header: 'Code' },
    {
      accessorKey: 'expense_date',
      header: 'Date',
      cell: ({ getValue }) => formatDate(String(getValue())),
    },
    {
      id: 'category',
      header: 'Category',
      cell: ({ row }) => row.original.category?.name ?? '—',
    },
    {
      accessorKey: 'vendor_name',
      header: 'Vendor',
      cell: ({ getValue }) => String(getValue() ?? '—'),
    },
    {
      accessorKey: 'total_amount',
      header: 'Total',
      cell: ({ getValue }) => formatCurrency(Number(getValue()), currency),
    },
    {
      id: 'receipt',
      header: 'Receipt',
      cell: ({ row }) =>
        row.original.has_receipt ? (
          <a
            href={row.original.receipt_url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <Receipt className="h-4 w-4" /> View
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          {canUpdate && (
            <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {canDelete && (
            <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(row.original)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  const reportColumns: ColumnDef<ExpenseCategoryReport, unknown>[] = [
    {
      id: 'category',
      header: 'Category',
      cell: ({ row }) => row.original.category_name ?? '—',
    },
    { accessorKey: 'count', header: 'Entries' },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ getValue }) => formatCurrency(Number(getValue()), currency),
    },
    {
      id: 'share',
      header: 'Share',
      cell: ({ row }) => {
        const total = report?.total ?? 0
        const pct = total > 0 ? ((row.original.total / total) * 100).toFixed(1) : '0'
        return `${pct}%`
      },
    },
  ]

  const tabs: { key: Tab; label: string; icon: typeof Wallet }[] = [
    { key: 'entries', label: 'Entries', icon: FileText },
    { key: 'reports', label: 'Reports', icon: BarChart3 },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Expenses' }]} />

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">Expense Management</h1>
          <p className="text-muted-foreground">Record expenses, upload receipts, and view reports</p>
        </div>
        <div className="flex shrink-0 flex-nowrap items-center gap-1.5 overflow-x-auto">
          <Link to="/masters/expense-categories" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Categories
          </Link>
          {tab === 'entries' && canCreate && (
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> New Expense
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today" value={formatCurrency(stats?.today_total ?? 0, currency)} icon={Wallet} />
        <StatCard title="This Month" value={formatCurrency(stats?.month_total ?? 0, currency)} icon={Receipt} />
        <StatCard title="This Year" value={formatCurrency(stats?.year_total ?? 0, currency)} icon={BarChart3} gradient="from-amber-600 via-amber-500 to-amber-400" />
        <StatCard title="Entries (Month)" value={stats?.month_count ?? 0} icon={FileText} />
      </div>

      <PageTabs<Tab> tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'entries' && (
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <SearchInput value={search} onChange={setSearch} placeholder="Search expenses…" className="max-w-xs" />
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[{ value: '', label: 'All categories' }, ...categoryOptions.map((o) => ({ value: String(o.value), label: o.label }))]}
              className="w-44"
            />
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-40" />
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-40" />
          </CardHeader>
          <CardContent>
            {isLoading ? <PageLoader /> : (
              <>
                <DataTable columns={columns} data={rows.items} />
                {rows.meta && rows.meta.last_page > 1 && (
                  <Pagination currentPage={rows.meta.current_page} totalPages={rows.meta.last_page} onPageChange={setPage} />
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {tab === 'reports' && (
        <div className="space-y-6">
          {!canReport ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">You do not have permission to view expense reports.</CardContent></Card>
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-wrap items-end gap-4">
                  <Input label="From" type="date" value={reportFrom} onChange={(e) => setReportFrom(e.target.value)} className="w-40" />
                  <Input label="To" type="date" value={reportTo} onChange={(e) => setReportTo(e.target.value)} className="w-40" />
                </CardHeader>
                <CardContent>
                  {reportLoading ? <PageLoader /> : report && (
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-lg border border-border p-4">
                        <p className="text-sm text-muted-foreground">Total Expenses</p>
                        <p className="text-2xl font-bold">{formatCurrency(report.total, currency)}</p>
                      </div>
                      <div className="rounded-lg border border-border p-4">
                        <p className="text-sm text-muted-foreground">Entries</p>
                        <p className="text-2xl font-bold">{report.count}</p>
                      </div>
                      <div className="rounded-lg border border-border p-4">
                        <p className="text-sm text-muted-foreground">Period</p>
                        <p className="text-sm font-medium">{formatDate(report.date_from)} — {formatDate(report.date_to)}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {report && (
                <>
                  <Card>
                    <CardHeader><h3 className="font-semibold">By Category</h3></CardHeader>
                    <CardContent>
                      {report.by_category.length > 0 ? (
                        <DataTable columns={reportColumns} data={report.by_category} />
                      ) : (
                        <p className="py-8 text-center text-muted-foreground">No expenses in this period.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><h3 className="font-semibold">Monthly Trend (6 months)</h3></CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {report.monthly.labels.map((label, i) => {
                          const value = report.monthly.data[i] ?? 0
                          const max = Math.max(...report.monthly.data, 1)
                          const width = `${(value / max) * 100}%`
                          return (
                            <div key={label} className="flex items-center gap-3">
                              <span className="w-20 shrink-0 text-sm text-muted-foreground">{label}</span>
                              <div className="h-6 flex-1 rounded bg-muted">
                                <div className="h-6 rounded bg-primary/70" style={{ width }} />
                              </div>
                              <span className="w-24 shrink-0 text-right text-sm font-medium">{formatCurrency(value, currency)}</span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}
        </div>
      )}

      <Modal open={formOpen} onOpenChange={(open) => !open && closeForm()} title={editing ? 'Edit Expense' : 'New Expense'} className="max-w-2xl">
        <Form onSubmit={submitForm} className="space-y-4">
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Category"
              value={String(form.expense_category_id || '')}
              onChange={(e) => setForm({ ...form, expense_category_id: Number(e.target.value) })}
              options={[{ value: '', label: 'Select category' }, ...categoryOptions.map((o) => ({ value: String(o.value), label: o.label }))]}
              required
            />
            <Input label="Date" type="date" value={form.expense_date} onChange={(e) => setForm({ ...form, expense_date: e.target.value })} required />
            <Input label="Vendor" value={form.vendor_name ?? ''} onChange={(e) => setForm({ ...form, vendor_name: e.target.value })} />
            <Select
              label="Payment Method"
              value={String(form.payment_method_id ?? '')}
              onChange={(e) => setForm({ ...form, payment_method_id: e.target.value ? Number(e.target.value) : null })}
              options={[{ value: '', label: '—' }, ...paymentOptions.map((o) => ({ value: String(o.value), label: o.label }))]}
            />
            <Input label="Amount (AED)" type="number" step="0.01" min="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} required />
            <Input label="VAT Rate % (optional)" type="number" step="0.01" value={form.vat_rate ?? 0} onChange={(e) => setForm({ ...form, vat_rate: Number(e.target.value) })} />
            <Input label="Reference" value={form.reference ?? ''} onChange={(e) => setForm({ ...form, reference: e.target.value })} />
          </div>
          <Textarea label="Description" value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Textarea label="Notes" value={form.notes ?? ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <Checkbox label="Amount includes VAT" checked={form.vat_inclusive ?? false} onChange={(e) => setForm({ ...form, vat_inclusive: e.target.checked })} />

          <div>
            <label className="mb-2 block text-sm font-medium">Receipt (JPG, PNG, PDF — max 5MB)</label>
            {editing?.has_receipt && editing.receipt_url && (
              <a href={editing.receipt_url} target="_blank" rel="noopener noreferrer" className="mb-2 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                <ExternalLink className="h-4 w-4" /> Current receipt: {editing.receipt_original_name ?? 'View'}
              </a>
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground hover:bg-muted/50">
              <Upload className="h-5 w-5" />
              {receiptFile ? receiptFile.name : 'Choose file…'}
              <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
              {editing ? 'Save Changes' : 'Record Expense'}
            </Button>
          </div>
        </Form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Expense"
        description={`Delete expense "${deleteTarget?.code}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  )
}
