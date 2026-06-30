import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { CreditCard, Gift, Minus, Plus, Receipt, Search, ShoppingCart, Trash2 } from 'lucide-react'
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardContent,
  CardHeader,
  DataTable,
  Input,
  Modal,
  PageLoader,
  Select,
  Textarea,
} from '@/components'
import { CustomerSearchInput } from '@/components/customers/CustomerSearchInput'
import { ReceiptPrint } from '@/components/pos/ReceiptPrint'
import { StatCard } from '@/components/dashboard/StatCard'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { useAppSettings } from '@/contexts/SettingsContext'
import { customerService, type Customer, type CustomerPayload } from '@/services/customerService'
import { packageService, type CustomerPackage } from '@/services/packageService'
import { paymentMethodService } from '@/services/masterService'
import { salonServiceApi, formatDuration, type SalonServiceItem } from '@/services/salonServiceApi'
import { saleService, type CartItemPayload, type DiscountType, type ReceiptData, type Sale } from '@/services/saleService'
import { staffService } from '@/services/staffService'
import { formatCurrency, formatDate } from '@/utils/format'
import { isPaginated } from '@/utils/master'

type PosMode = 'pos' | 'invoices'

interface CartLine {
  key: string
  line_type: 'service' | 'package'
  service_id?: number
  service_package_id?: number
  name: string
  unitPrice: number
  quantity: number
  staffId: string
  redeem: boolean
  customerPackageId: string
  points?: number
}

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response
    return res?.data?.message ?? 'Something went wrong.'
  }
  return 'Something went wrong.'
}

function newKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export default function PosPage() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()
  const { settings } = useAppSettings()
  const currency = settings?.currency ?? 'AED'

  const [mode, setMode] = useState<PosMode>('pos')
  const [serviceSearch, setServiceSearch] = useState('')
  const [catalogTab, setCatalogTab] = useState<'services' | 'packages'>('services')

  const [phone, setPhone] = useState('')
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [registerMode, setRegisterMode] = useState(false)
  const [registerName, setRegisterName] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const [cart, setCart] = useState<CartLine[]>([])
  const [discountType, setDiscountType] = useState<DiscountType>('none')
  const [discountValue, setDiscountValue] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethodId, setPaymentMethodId] = useState('')
  const [paymentReference, setPaymentReference] = useState('')

  const [preview, setPreview] = useState<Awaited<ReturnType<typeof saleService.preview>> | null>(null)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)
  const [viewReceiptId, setViewReceiptId] = useState<number | null>(null)

  const debouncedCart = useDebounce(cart, 400)
  const debouncedDiscount = useDebounce({ discountType, discountValue }, 400)

  const { data: stats } = useQuery({ queryKey: ['sales-stats'], queryFn: () => saleService.stats() })

  const { data: servicesRaw } = useQuery({
    queryKey: ['pos-services'],
    queryFn: () => salonServiceApi.list({ all: true, is_active: true }),
  })

  const { data: packagesRaw } = useQuery({
    queryKey: ['pos-packages'],
    queryFn: () => packageService.listActive(),
  })

  const { data: staffRaw } = useQuery({
    queryKey: ['pos-staff'],
    queryFn: () => staffService.list({ per_page: 100 }),
  })

  const { data: paymentMethodsRaw } = useQuery({
    queryKey: ['pos-payment-methods'],
    queryFn: () => paymentMethodService.list({ all: true }),
  })

  const { data: customerPackages } = useQuery({
    queryKey: ['pos-customer-packages', customer?.id],
    queryFn: () => packageService.forCustomer(customer!.id),
    enabled: !!customer?.id,
  })

  const { data: invoicesRaw, isLoading: invoicesLoading } = useQuery({
    queryKey: ['sales-list'],
    queryFn: () => saleService.list({ per_page: 20 }),
    enabled: mode === 'invoices',
  })

  const { data: viewReceipt } = useQuery({
    queryKey: ['sale-receipt', viewReceiptId],
    queryFn: () => saleService.receipt(viewReceiptId!),
    enabled: !!viewReceiptId,
  })

  const services = useMemo(() => {
    const rows = Array.isArray(servicesRaw) ? servicesRaw : servicesRaw?.data ?? []
    const q = serviceSearch.trim().toLowerCase()
    return q ? rows.filter((s) => s.name.toLowerCase().includes(q)) : rows
  }, [servicesRaw, serviceSearch])

  const packages = packagesRaw ?? []
  const staffOptions = useMemo(() => {
    const rows = staffRaw && isPaginated(staffRaw) ? staffRaw.data : Array.isArray(staffRaw) ? staffRaw : []
    return rows.filter((s) => s.is_active).map((s) => ({ value: s.id, label: s.name }))
  }, [staffRaw])

  const paymentOptions = useMemo(() => {
    const rows = (Array.isArray(paymentMethodsRaw) ? paymentMethodsRaw : paymentMethodsRaw?.data ?? []) as {
      id: number
      name: string
      is_active: boolean
    }[]
    return rows.filter((p) => p.is_active).map((p) => ({ value: p.id, label: p.name }))
  }, [paymentMethodsRaw])

  const activeCustomerPackages = useMemo(
    () => (customerPackages?.packages ?? []).filter((p: CustomerPackage) => p.status === 'active' && p.points_remaining > 0),
    [customerPackages]
  )

  const cartPayload: CartItemPayload[] = useMemo(
    () =>
      cart.map((line) => {
        if (line.redeem && line.line_type === 'service') {
          return {
            line_type: 'package_redemption',
            service_id: line.service_id,
            staff_id: line.staffId ? Number(line.staffId) : null,
            customer_package_id: line.customerPackageId ? Number(line.customerPackageId) : undefined,
            points: line.points,
            quantity: line.quantity,
          }
        }
        if (line.line_type === 'package') {
          return {
            line_type: 'package',
            service_package_id: line.service_package_id,
            staff_id: line.staffId ? Number(line.staffId) : null,
            quantity: line.quantity,
          }
        }
        return {
          line_type: 'service',
          service_id: line.service_id,
          staff_id: line.staffId ? Number(line.staffId) : null,
          quantity: line.quantity,
        }
      }),
    [cart]
  )

  useEffect(() => {
    if (cart.length === 0) {
      setPreview(null)
      return
    }
    saleService
      .preview({
        items: cartPayload,
        discount_type: discountType,
        discount_value: discountValue ? Number(discountValue) : 0,
      })
      .then(setPreview)
      .catch(() => setPreview(null))
  }, [debouncedCart, debouncedDiscount, cartPayload, discountType, discountValue, cart.length])

  useEffect(() => {
    if (paymentOptions.length && !paymentMethodId) {
      setPaymentMethodId(String(paymentOptions[0].value))
    }
  }, [paymentOptions, paymentMethodId])

  const searchMutation = useMutation({
    mutationFn: () => customerService.searchByPhone(phone.trim()),
    onSuccess: (result) => {
      setCustomer(result.customer)
      setRegisterMode(!result.found)
      setRegisterName('')
      setFormError(null)
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const registerMutation = useMutation({
    mutationFn: (payload: CustomerPayload) => customerService.create(payload),
    onSuccess: (c) => {
      setCustomer(c)
      setRegisterMode(false)
    },
  })

  const checkoutMutation = useMutation({
    mutationFn: saleService.checkout,
    onSuccess: async (sale) => {
      queryClient.invalidateQueries({ queryKey: ['sales-list'] })
      queryClient.invalidateQueries({ queryKey: ['sales-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      const receipt = await saleService.receipt(sale.id)
      setReceiptData(receipt)
      setCart([])
      setNotes('')
      setDiscountType('none')
      setDiscountValue('')
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const addService = (svc: SalonServiceItem) => {
    setCart((c) => [
      ...c,
      {
        key: newKey(),
        line_type: 'service',
        service_id: svc.id,
        name: svc.name,
        unitPrice: svc.total_price,
        quantity: 1,
        staffId: '',
        redeem: false,
        customerPackageId: activeCustomerPackages[0] ? String(activeCustomerPackages[0].id) : '',
      },
    ])
  }

  const addPackage = (pkg: { id: number; name: string; total_price: number }) => {
    setCart((c) => [
      ...c,
      {
        key: newKey(),
        line_type: 'package',
        service_package_id: pkg.id,
        name: pkg.name,
        unitPrice: pkg.total_price,
        quantity: 1,
        staffId: '',
        redeem: false,
        customerPackageId: '',
      },
    ])
  }

  const resolveCustomer = async (): Promise<number | null> => {
    if (customer) return customer.id
    if (registerMode && registerName.trim()) {
      const created = await registerMutation.mutateAsync({
        name: registerName.trim(),
        phone: phone.trim(),
        is_active: true,
      })
      setCustomer(created)
      return created.id
    }
    setFormError('Please find or register a customer.')
    return null
  }

  const handleCheckout = async () => {
    setFormError(null)
    if (cart.length === 0) {
      setFormError('Cart is empty.')
      return
    }
    const customerId = await resolveCustomer()
    if (!customerId) return
    if (!paymentMethodId) {
      setFormError('Select a payment method.')
      return
    }
    const total = preview?.total_amount ?? 0
    checkoutMutation.mutate({
      customer_id: customerId,
      discount_type: discountType,
      discount_value: discountValue ? Number(discountValue) : 0,
      notes: notes || undefined,
      items: cartPayload,
      payments: [
        {
          payment_method_id: Number(paymentMethodId),
          amount: total,
          reference: paymentReference || undefined,
        },
      ],
    })
  }

  const invoiceRows = invoicesRaw && isPaginated(invoicesRaw) ? invoicesRaw.data : []

  const invoiceColumns: ColumnDef<Sale>[] = [
    { accessorKey: 'code', header: 'Invoice' },
    {
      accessorKey: 'customer.name',
      header: 'Customer',
      cell: ({ row }) => row.original.customer?.name ?? '—',
    },
    {
      accessorKey: 'total_amount',
      header: 'Total',
      cell: ({ getValue }) => formatCurrency(Number(getValue()), currency),
    },
    {
      accessorKey: 'paid_at',
      header: 'Paid',
      cell: ({ getValue }) => (getValue() ? formatDate(String(getValue())) : '—'),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button type="button" variant="ghost" size="sm" onClick={() => setViewReceiptId(row.original.id)}>
          <Receipt className="mr-1 h-4 w-4" />
          Receipt
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'POS & Billing' }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">POS & Billing</h1>
          <p className="text-muted-foreground">Checkout, invoices, VAT & receipt printing</p>
        </div>
        <div className="flex rounded-lg border border-border p-0.5">
          <Button type="button" size="sm" variant={mode === 'pos' ? 'default' : 'ghost'} onClick={() => setMode('pos')}>
            <ShoppingCart className="mr-1 h-4 w-4" />
            POS
          </Button>
          <Button type="button" size="sm" variant={mode === 'invoices' ? 'default' : 'ghost'} onClick={() => setMode('invoices')}>
            <Receipt className="mr-1 h-4 w-4" />
            Invoices
          </Button>
        </div>
      </div>

      {mode === 'invoices' ? (
        invoicesLoading ? (
          <PageLoader />
        ) : (
          <Card>
            <CardHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <StatCard title="Total Revenue" value={formatCurrency(stats?.total_revenue ?? 0, currency)} icon={CreditCard} />
                <StatCard title="Today" value={formatCurrency(stats?.today_revenue ?? 0, currency)} icon={Receipt} />
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={invoiceColumns} data={invoiceRows} />
            </CardContent>
          </Card>
        )
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr_380px]">
          <Card className="xl:col-span-1">
            <CardHeader>
              <p className="font-medium">Customer Lookup</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {formError && <p className="text-sm text-destructive">{formError}</p>}
              <CustomerSearchInput
                value={phone}
                onChange={setPhone}
                onSearch={() => {
                  if (phone.trim().length < 7) {
                    setFormError('Enter a valid mobile number.')
                    return
                  }
                  searchMutation.mutate()
                }}
                isSearching={searchMutation.isPending}
              />
              {customer && (
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  {customerPackages && (
                    <Badge className="mt-2" variant="success">
                      {customerPackages.balance} points available
                    </Badge>
                  )}
                </div>
              )}
              {registerMode && !customer && (
                <Input
                  placeholder="New customer name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div className="flex gap-1 rounded-lg border border-border p-0.5">
                <Button type="button" size="sm" variant={catalogTab === 'services' ? 'default' : 'ghost'} onClick={() => setCatalogTab('services')}>
                  Services
                </Button>
                <Button type="button" size="sm" variant={catalogTab === 'packages' ? 'default' : 'ghost'} onClick={() => setCatalogTab('packages')}>
                  Packages
                </Button>
              </div>
              {catalogTab === 'services' && (
                <div className="relative w-40">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-8" placeholder="Search…" value={serviceSearch} onChange={(e) => setServiceSearch(e.target.value)} />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid max-h-[420px] gap-2 overflow-y-auto sm:grid-cols-2">
                {catalogTab === 'services'
                  ? services.map((svc) => (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => addService(svc)}
                        className="rounded-lg border border-border p-3 text-left transition hover:border-primary hover:bg-primary/5"
                      >
                        <p className="font-medium">{svc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDuration(svc.duration_minutes)} · {formatCurrency(svc.total_price, currency)}
                        </p>
                      </button>
                    ))
                  : packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => addPackage(pkg)}
                        className="rounded-lg border border-border p-3 text-left transition hover:border-secondary hover:bg-secondary/5"
                      >
                        <p className="font-medium">{pkg.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {pkg.points_included} pts · {formatCurrency(pkg.total_price, currency)}
                        </p>
                      </button>
                    ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="flex items-center gap-2 font-medium">
                <ShoppingCart className="h-4 w-4" />
                Cart ({cart.length})
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">Add services or packages</p>
              )}
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {cart.map((line) => (
                  <div key={line.key} className="rounded-lg border border-border p-2 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{line.name}</p>
                        {!line.redeem && (
                          <p className="text-muted-foreground">{formatCurrency(line.unitPrice, currency)}</p>
                        )}
                        {line.redeem && (
                          <Badge variant="warning">
                            <Gift className="mr-1 inline h-3 w-3" />
                            Package redemption
                          </Badge>
                        )}
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => setCart((c) => c.filter((x) => x.key !== line.key))}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    {line.line_type === 'service' && activeCustomerPackages.length > 0 && (
                      <label className="mt-2 flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={line.redeem}
                          onChange={(e) =>
                            setCart((c) =>
                              c.map((x) => (x.key === line.key ? { ...x, redeem: e.target.checked } : x))
                            )
                          }
                        />
                        Redeem with package points
                      </label>
                    )}
                    {line.redeem && (
                      <Select
                        className="mt-2"
                        options={activeCustomerPackages.map((p) => ({
                          value: p.id,
                          label: `${p.code} (${p.points_remaining} pts)`,
                        }))}
                        value={line.customerPackageId}
                        onChange={(e) =>
                          setCart((c) => c.map((x) => (x.key === line.key ? { ...x, customerPackageId: e.target.value } : x)))
                        }
                      />
                    )}
                    <Select
                      className="mt-2"
                      options={staffOptions}
                      placeholder="Assign stylist"
                      value={line.staffId}
                      onChange={(e) =>
                        setCart((c) => c.map((x) => (x.key === line.key ? { ...x, staffId: e.target.value } : x)))
                      }
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          setCart((c) =>
                            c.map((x) =>
                              x.key === line.key ? { ...x, quantity: Math.max(1, x.quantity - 1) } : x
                            )
                          )
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span>{line.quantity}</span>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          setCart((c) =>
                            c.map((x) => (x.key === line.key ? { ...x, quantity: x.quantity + 1 } : x))
                          )
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-border pt-3">
                <div className="flex gap-2">
                  <Select
                    options={[
                      { value: 'none', label: 'No discount' },
                      { value: 'percentage', label: '% Discount' },
                      { value: 'fixed', label: 'Fixed discount' },
                    ]}
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                  />
                  {discountType !== 'none' && (
                    <Input
                      type="number"
                      min={0}
                      placeholder={discountType === 'percentage' ? '%' : currency}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                    />
                  )}
                </div>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd>{formatCurrency(preview?.subtotal ?? 0, currency)}</dd>
                  </div>
                  {(preview?.discount_amount ?? 0) > 0 && (
                    <div className="flex justify-between text-destructive">
                      <dt>Discount</dt>
                      <dd>-{formatCurrency(preview!.discount_amount, currency)}</dd>
                    </div>
                  )}
                  {(preview?.vat_amount ?? 0) > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">VAT</dt>
                      <dd>{formatCurrency(preview?.vat_amount ?? 0, currency)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold">
                    <dt>Total</dt>
                    <dd className="text-primary">{formatCurrency(preview?.total_amount ?? 0, currency)}</dd>
                  </div>
                </dl>
                <Select
                  options={paymentOptions}
                  placeholder="Payment method"
                  value={paymentMethodId}
                  onChange={(e) => setPaymentMethodId(e.target.value)}
                />
                <Input
                  placeholder="Payment reference (optional)"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                />
                <Textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
                {hasPermission('sales.create') && (
                  <Button
                    type="button"
                    className="w-full"
                    size="lg"
                    loading={checkoutMutation.isPending || registerMutation.isPending}
                    disabled={cart.length === 0}
                    onClick={handleCheckout}
                  >
                    Complete Payment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Modal
        open={!!receiptData}
        onOpenChange={(o) => !o && setReceiptData(null)}
        title="Payment Successful"
        className="max-w-md"
      >
        {receiptData && (
          <ReceiptPrint data={receiptData} onClose={() => setReceiptData(null)} />
        )}
      </Modal>

      <Modal
        open={!!viewReceiptId && !!viewReceipt}
        onOpenChange={(o) => !o && setViewReceiptId(null)}
        title="Invoice Receipt"
        className="max-w-md"
      >
        {viewReceipt && (
          <ReceiptPrint data={viewReceipt} onClose={() => setViewReceiptId(null)} />
        )}
      </Modal>
    </div>
  )
}
