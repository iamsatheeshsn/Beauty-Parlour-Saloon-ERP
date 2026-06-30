import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  List,
  Plus,
  UserCheck,
  UserRound,
  DoorOpen,
} from 'lucide-react'
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  ConfirmDialog,
  DataTable,
  Form,
  Input,
  Modal,
  PageLoader,
  Pagination,
  Select,
  Textarea,
} from '@/components'
import { CustomerSearchInput } from '@/components/customers/CustomerSearchInput'
import { StatCard } from '@/components/dashboard/StatCard'
import { usePermission } from '@/hooks/usePermission'
import { useAppSettings } from '@/contexts/SettingsContext'
import {
  appointmentService,
  appointmentStatusLabel,
  appointmentStatusVariant,
  APPOINTMENT_STATUS_OPTIONS,
  type Appointment,
  type AppointmentPayload,
  type AppointmentStatus,
  type Customer,
  type CustomerPayload,
} from '@/services/appointmentService'
import { customerService } from '@/services/customerService'
import { salonServiceApi, formatDuration } from '@/services/salonServiceApi'
import { staffService } from '@/services/staffService'
import { isPaginated } from '@/utils/master'
import { formatCurrency, formatDate } from '@/utils/format'
import { cn } from '@/utils/cn'

const HOUR_START = 8
const HOUR_END = 20
const HOUR_HEIGHT = 48

type ViewMode = 'calendar' | 'list'

function startOfWeekMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function formatWeekRange(start: Date): string {
  const end = addDays(start, 6)
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  const yearOpts: Intl.DateTimeFormatOptions = { ...opts, year: 'numeric' }
  if (start.getMonth() === end.getMonth()) {
    return `${start.toLocaleDateString('en-AE', opts)} – ${end.getDate()}, ${end.getFullYear()}`
  }
  return `${start.toLocaleDateString('en-AE', opts)} – ${end.toLocaleDateString('en-AE', yearOpts)}`
}

function appointmentTop(scheduledAt: string): number {
  const d = new Date(scheduledAt)
  const minutesFromStart = (d.getHours() - HOUR_START) * 60 + d.getMinutes()
  return Math.max(0, (minutesFromStart / 60) * HOUR_HEIGHT)
}

function appointmentHeight(durationMinutes: number): number {
  return Math.max((durationMinutes / 60) * HOUR_HEIGHT, 28)
}

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response
    return res?.data?.message ?? 'Something went wrong.'
  }
  return 'Something went wrong.'
}

interface CustomerPickerState {
  phone: string
  customer: Customer | null
  notFound: boolean
  registerMode: boolean
  registerForm: CustomerPayload
}

const emptyCustomerPicker = (): CustomerPickerState => ({
  phone: '',
  customer: null,
  notFound: false,
  registerMode: false,
  registerForm: { name: '', phone: '', is_active: true },
})

export default function AppointmentsPage() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()
  const { settings } = useAppSettings()
  const canCreate = hasPermission('appointments.create')
  const canUpdate = hasPermission('appointments.update')

  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const [weekStart, setWeekStart] = useState(() => startOfWeekMonday(new Date()))
  const [statusFilter, setStatusFilter] = useState('')
  const [staffFilter, setStaffFilter] = useState('')
  const [listPage, setListPage] = useState(1)

  const [walkInOpen, setWalkInOpen] = useState(false)
  const [bookOpen, setBookOpen] = useState(false)
  const [detailAppt, setDetailAppt] = useState<Appointment | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const [walkInPicker, setWalkInPicker] = useState<CustomerPickerState>(emptyCustomerPicker)
  const [bookPicker, setBookPicker] = useState<CustomerPickerState>(emptyCustomerPicker)
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([])
  const [bookServiceIds, setBookServiceIds] = useState<number[]>([])
  const [walkInStaffId, setWalkInStaffId] = useState('')
  const [bookStaffId, setBookStaffId] = useState('')
  const [bookScheduledAt, setBookScheduledAt] = useState(() => toDatetimeLocalValue(new Date()))
  const [bookNotes, setBookNotes] = useState('')
  const [detailStaffId, setDetailStaffId] = useState('')
  const [detailStatus, setDetailStatus] = useState<AppointmentStatus>('scheduled')
  const [cancelReason, setCancelReason] = useState('')

  const weekEnd = useMemo(() => {
    const end = addDays(weekStart, 6)
    end.setHours(23, 59, 59, 999)
    return end
  }, [weekStart])

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart])

  const { data: staffList } = useQuery({
    queryKey: ['staff-options'],
    queryFn: () => staffService.list({ per_page: 100 }),
  })

  const staffOptions = useMemo(() => {
    if (!staffList) return []
    const rows = isPaginated(staffList) ? staffList.data : staffList
    return rows.filter((s) => s.is_active)
  }, [staffList])

  const { data: servicesList } = useQuery({
    queryKey: ['services-active'],
    queryFn: () => salonServiceApi.list({ all: true, is_active: true }),
  })

  const staffSelectOptions = useMemo(
    () => staffOptions.map((s) => ({ value: s.id, label: s.name })),
    [staffOptions]
  )

  const statusSelectOptions = useMemo(
    () => APPOINTMENT_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
    []
  )

  const activeServices = useMemo(() => {
    if (!servicesList) return []
    return Array.isArray(servicesList) ? servicesList : servicesList.data ?? []
  }, [servicesList])

  const calendarQuery = useQuery({
    queryKey: ['appointments-calendar', weekStart.toISOString(), statusFilter, staffFilter],
    queryFn: () =>
      appointmentService.calendar({
        start: weekStart.toISOString(),
        end: weekEnd.toISOString(),
        status: (statusFilter || undefined) as AppointmentStatus | undefined,
        staff_id: staffFilter ? Number(staffFilter) : undefined,
      }),
    enabled: viewMode === 'calendar',
  })

  const listQuery = useQuery({
    queryKey: ['appointments-list', listPage, statusFilter, staffFilter],
    queryFn: () =>
      appointmentService.list({
        page: listPage,
        per_page: 15,
        status: statusFilter || undefined,
        staff_id: staffFilter ? Number(staffFilter) : undefined,
      }),
    enabled: viewMode === 'list',
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['appointments-calendar'] })
    queryClient.invalidateQueries({ queryKey: ['appointments-list'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }

  const walkInSearchMutation = useMutation({
    mutationFn: (phone: string) => customerService.searchByPhone(phone),
    onSuccess: (result, phone) => {
      setWalkInPicker((prev) => ({
        ...prev,
        customer: result.customer,
        notFound: !result.found,
        registerMode: !result.found,
        registerForm: !result.found ? { ...prev.registerForm, phone, name: '' } : prev.registerForm,
      }))
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const bookSearchMutation = useMutation({
    mutationFn: (phone: string) => customerService.searchByPhone(phone),
    onSuccess: (result, phone) => {
      setBookPicker((prev) => ({
        ...prev,
        customer: result.customer,
        notFound: !result.found,
        registerMode: !result.found,
        registerForm: !result.found ? { ...prev.registerForm, phone, name: '' } : prev.registerForm,
      }))
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const registerMutation = useMutation({
    mutationFn: (payload: CustomerPayload) => customerService.create(payload),
    onError: (err) => setFormError(extractError(err)),
  })

  const walkInMutation = useMutation({
    mutationFn: (payload: AppointmentPayload) => appointmentService.walkIn(payload),
    onSuccess: () => {
      invalidate()
      closeWalkIn()
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const bookMutation = useMutation({
    mutationFn: (payload: AppointmentPayload & { scheduled_at: string }) => appointmentService.book(payload),
    onSuccess: () => {
      invalidate()
      closeBook()
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: number; status: AppointmentStatus; reason?: string }) =>
      appointmentService.updateStatus(id, status, reason),
    onSuccess: (updated) => {
      invalidate()
      setDetailAppt(updated)
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const assignMutation = useMutation({
    mutationFn: ({ id, staff_id }: { id: number; staff_id: number }) => appointmentService.assignStaff(id, staff_id),
    onSuccess: (updated) => {
      invalidate()
      setDetailAppt(updated)
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => appointmentService.remove(id),
    onSuccess: () => {
      invalidate()
      setDeleteTarget(null)
      setDetailAppt(null)
    },
  })

  const calendarAppointments = calendarQuery.data ?? []
  const appointmentsByDay = useMemo(() => {
    const map: Record<string, Appointment[]> = {}
    for (const day of weekDays) {
      map[toIsoDate(day)] = []
    }
    for (const appt of calendarAppointments) {
      const key = toIsoDate(new Date(appt.scheduled_at))
      if (map[key]) map[key].push(appt)
    }
    return map
  }, [calendarAppointments, weekDays])

  const todayCount = calendarAppointments.filter(
    (a) => toIsoDate(new Date(a.scheduled_at)) === toIsoDate(new Date()) && a.status !== 'cancelled'
  ).length

  const inProgressCount = calendarAppointments.filter((a) =>
    ['checked_in', 'in_progress'].includes(a.status)
  ).length

  const closeWalkIn = () => {
    setWalkInOpen(false)
    setWalkInPicker(emptyCustomerPicker())
    setSelectedServiceIds([])
    setWalkInStaffId('')
    setFormError(null)
  }

  const closeBook = () => {
    setBookOpen(false)
    setBookPicker(emptyCustomerPicker())
    setBookServiceIds([])
    setBookStaffId('')
    setBookScheduledAt(toDatetimeLocalValue(new Date()))
    setBookNotes('')
    setFormError(null)
  }

  const openDetail = (appt: Appointment) => {
    setDetailAppt(appt)
    setDetailStaffId(appt.staff_id ? String(appt.staff_id) : '')
    setDetailStatus(appt.status)
    setCancelReason(appt.cancellation_reason ?? '')
    setFormError(null)
  }

  const resolveCustomerId = async (picker: CustomerPickerState, mode: 'walkIn' | 'book'): Promise<number | null> => {
    if (picker.customer) return picker.customer.id
    if (picker.registerMode && picker.registerForm.name.trim()) {
      const created = await registerMutation.mutateAsync({
        ...picker.registerForm,
        phone: picker.phone.trim(),
      })
      if (mode === 'walkIn') {
        setWalkInPicker((p) => ({ ...p, customer: created, registerMode: false }))
      } else {
        setBookPicker((p) => ({ ...p, customer: created, registerMode: false }))
      }
      return created.id
    }
    setFormError('Please find or register a customer first.')
    return null
  }

  const buildItems = (serviceIds: number[], staffId: string) =>
    serviceIds.map((service_id) => ({
      service_id,
      staff_id: staffId ? Number(staffId) : null,
    }))

  const handleWalkIn = async () => {
    setFormError(null)
    if (selectedServiceIds.length === 0) {
      setFormError('Select at least one service.')
      return
    }
    const customerId = await resolveCustomerId(walkInPicker, 'walkIn')
    if (!customerId) return
    walkInMutation.mutate({
      customer_id: customerId,
      staff_id: walkInStaffId ? Number(walkInStaffId) : null,
      items: buildItems(selectedServiceIds, walkInStaffId),
    })
  }

  const handleBook = async () => {
    setFormError(null)
    if (bookServiceIds.length === 0) {
      setFormError('Select at least one service.')
      return
    }
    if (!bookScheduledAt) {
      setFormError('Please choose date and time.')
      return
    }
    const customerId = await resolveCustomerId(bookPicker, 'book')
    if (!customerId) return
    bookMutation.mutate({
      customer_id: customerId,
      staff_id: bookStaffId ? Number(bookStaffId) : null,
      scheduled_at: new Date(bookScheduledAt).toISOString(),
      notes: bookNotes || null,
      items: buildItems(bookServiceIds, bookStaffId),
    })
  }

  const toggleService = (id: number, list: number[], setter: (v: number[]) => void) => {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
  }

  const listData = listQuery.data
  const listRows = listData && isPaginated(listData) ? listData.data : []
  const listMeta = listData && isPaginated(listData) ? listData.meta : null

  const columns: ColumnDef<Appointment>[] = [
    { accessorKey: 'code', header: 'Code' },
    {
      accessorKey: 'customer.name',
      header: 'Customer',
      cell: ({ row }) => row.original.customer?.name ?? '—',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ getValue }) => (
        <Badge variant="default">{getValue() === 'walk_in' ? 'Walk-in' : 'Scheduled'}</Badge>
      ),
    },
    {
      accessorKey: 'scheduled_at',
      header: 'When',
      cell: ({ getValue }) => formatDate(String(getValue())),
    },
    {
      accessorKey: 'staff.name',
      header: 'Staff',
      cell: ({ row }) => row.original.staff?.name ?? 'Unassigned',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue() as AppointmentStatus
        return <Badge variant={appointmentStatusVariant(status)}>{appointmentStatusLabel(status)}</Badge>
      },
    },
    {
      accessorKey: 'total_amount',
      header: 'Amount',
      cell: ({ getValue }) => formatCurrency(Number(getValue()), settings?.currency ?? 'AED'),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button type="button" variant="ghost" size="sm" onClick={() => openDetail(row.original)}>
          View
        </Button>
      ),
    },
  ]

  const renderCustomerSection = (
    picker: CustomerPickerState,
    setPicker: React.Dispatch<React.SetStateAction<CustomerPickerState>>,
    onSearch: () => void,
    searching: boolean
  ) => (
    <div className="space-y-3">
      <CustomerSearchInput
        value={picker.phone}
        onChange={(v) => setPicker((p) => ({ ...p, phone: v }))}
        onSearch={onSearch}
        isSearching={searching}
      />
      {picker.customer && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
          <UserRound className="h-8 w-8 text-primary" />
          <div>
            <p className="font-medium">{picker.customer.name}</p>
            <p className="text-sm text-muted-foreground">{picker.customer.phone}</p>
          </div>
        </div>
      )}
      {picker.registerMode && !picker.customer && (
        <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
          <p className="text-sm font-medium">Register new customer</p>
          <Input
            placeholder="Full name"
            value={picker.registerForm.name}
            onChange={(e) =>
              setPicker((p) => ({ ...p, registerForm: { ...p.registerForm, name: e.target.value } }))
            }
          />
        </div>
      )}
    </div>
  )

  const renderServicePicker = (selected: number[], setter: (v: number[]) => void) => (
    <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-border p-2">
      {activeServices.length === 0 ? (
        <p className="p-2 text-sm text-muted-foreground">No active services.</p>
      ) : (
        activeServices.map((svc) => (
          <label
            key={svc.id}
            className="flex cursor-pointer items-start gap-2 rounded-md p-2 hover:bg-muted/50"
          >
            <Checkbox
              checked={selected.includes(svc.id)}
              onChange={() => toggleService(svc.id, selected, setter)}
            />
            <span className="flex-1 text-sm">
              <span className="font-medium">{svc.name}</span>
              <span className="ml-2 text-muted-foreground">
                {formatDuration(svc.duration_minutes)} · {formatCurrency(svc.total_price, settings?.currency ?? 'AED')}
              </span>
            </span>
          </label>
        ))
      )}
    </div>
  )

  if (calendarQuery.isLoading && viewMode === 'calendar') return <PageLoader />

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Appointments' }]} />

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">Walk-ins, bookings, calendar & staff assignment</p>
        </div>
        {canCreate && (
          <div className="flex shrink-0 flex-nowrap items-center gap-1.5">
            <Button type="button" variant="outline" size="sm" onClick={() => setWalkInOpen(true)}>
              <DoorOpen />
              Walk-in
            </Button>
            <Button type="button" size="sm" onClick={() => setBookOpen(true)}>
              <Plus />
              Book Appointment
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="This Week" value={calendarAppointments.length} icon={CalendarDays} />
        <StatCard title="Today" value={todayCount} icon={Clock} />
        <StatCard title="In Progress" value={inProgressCount} icon={UserCheck} />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">Schedule</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              options={[{ value: '', label: 'All statuses' }, ...statusSelectOptions]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <Select
              options={[{ value: '', label: 'All staff' }, ...staffSelectOptions]}
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
            />
            <div className="flex rounded-lg border border-border p-0.5">
              <Button
                type="button"
                size="sm"
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                onClick={() => setViewMode('calendar')}
              >
                <CalendarDays className="mr-1 h-4 w-4" />
                Calendar
              </Button>
              <Button
                type="button"
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
              >
                <List className="mr-1 h-4 w-4" />
                List
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'calendar' ? (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <Button type="button" variant="outline" size="sm" onClick={() => setWeekStart(addDays(weekStart, -7))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium">{formatWeekRange(weekStart)}</span>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setWeekStart(startOfWeekMonday(new Date()))}>
                    Today
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setWeekStart(addDays(weekStart, 7))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-border">
                    <div />
                    {weekDays.map((day) => {
                      const isToday = toIsoDate(day) === toIsoDate(new Date())
                      return (
                        <div
                          key={day.toISOString()}
                          className={cn('border-l border-border p-2 text-center text-sm', isToday && 'bg-primary/5')}
                        >
                          <div className="font-medium">{day.toLocaleDateString('en-AE', { weekday: 'short' })}</div>
                          <div className={cn('text-muted-foreground', isToday && 'text-primary font-semibold')}>
                            {day.getDate()}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="grid grid-cols-[56px_repeat(7,1fr)]">
                    <div>
                      {Array.from({ length: HOUR_END - HOUR_START }, (_, i) => (
                        <div
                          key={i}
                          className="border-b border-border pr-2 text-right text-xs text-muted-foreground"
                          style={{ height: HOUR_HEIGHT }}
                        >
                          {String(HOUR_START + i).padStart(2, '0')}:00
                        </div>
                      ))}
                    </div>
                    {weekDays.map((day) => {
                      const key = toIsoDate(day)
                      const dayAppts = appointmentsByDay[key] ?? []
                      return (
                        <div
                          key={key}
                          className="relative border-l border-border"
                          style={{ height: (HOUR_END - HOUR_START) * HOUR_HEIGHT }}
                        >
                          {Array.from({ length: HOUR_END - HOUR_START }, (_, i) => (
                            <div key={i} className="border-b border-border/60" style={{ height: HOUR_HEIGHT }} />
                          ))}
                          {dayAppts.map((appt) => (
                            <button
                              key={appt.id}
                              type="button"
                              onClick={() => openDetail(appt)}
                              className={cn(
                                'absolute left-0.5 right-0.5 overflow-hidden rounded-md border px-1.5 py-0.5 text-left text-xs shadow-sm transition hover:brightness-95',
                                appt.status === 'cancelled' || appt.status === 'no_show'
                                  ? 'border-muted bg-muted/60 opacity-60 line-through'
                                  : appt.type === 'walk_in'
                                    ? 'border-amber-300 bg-amber-50 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100'
                                    : 'border-primary/30 bg-primary/10 text-primary'
                              )}
                              style={{
                                top: appointmentTop(appt.scheduled_at),
                                height: appointmentHeight(appt.duration_minutes),
                              }}
                            >
                              <div className="truncate font-semibold">{appt.customer?.name}</div>
                              <div className="truncate opacity-80">
                                {new Date(appt.scheduled_at).toLocaleTimeString('en-AE', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                                {appt.staff?.name ? ` · ${appt.staff.name}` : ''}
                              </div>
                            </button>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : listQuery.isLoading ? (
            <PageLoader />
          ) : listQuery.isError ? (
            <p className="text-destructive">Failed to load appointments.</p>
          ) : (
            <>
              <DataTable columns={columns} data={listRows} />
              {listMeta && listMeta.last_page > 1 && (
                <Pagination
                  currentPage={listMeta.current_page}
                  totalPages={listMeta.last_page}
                  onPageChange={setListPage}
                  className="mt-4"
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Walk-in modal */}
      <Modal
        open={walkInOpen}
        onOpenChange={(open) => !open && closeWalkIn()}
        title="New Walk-in"
        className="max-w-2xl"
      >
        <Form onSubmit={(e) => { e.preventDefault(); handleWalkIn() }}>
          <div className="space-y-4">
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            {renderCustomerSection(
              walkInPicker,
              setWalkInPicker,
              () => {
                setFormError(null)
                if (walkInPicker.phone.trim().length < 7) {
                  setFormError('Enter a valid mobile number.')
                  return
                }
                walkInSearchMutation.mutate(walkInPicker.phone.trim())
              },
              walkInSearchMutation.isPending
            )}
            <div>
              <p className="mb-2 text-sm font-medium">Services</p>
              {renderServicePicker(selectedServiceIds, setSelectedServiceIds)}
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Assign staff (optional)</p>
              <Select
                options={staffSelectOptions}
                placeholder="— Select stylist —"
                value={walkInStaffId}
                onChange={(e) => setWalkInStaffId(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeWalkIn}>
                Cancel
              </Button>
              <Button type="submit" disabled={walkInMutation.isPending || registerMutation.isPending}>
                {walkInMutation.isPending ? 'Creating…' : 'Check In Walk-in'}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Book modal */}
      <Modal
        open={bookOpen}
        onOpenChange={(open) => !open && closeBook()}
        title="Book Appointment"
        className="max-w-2xl"
      >
        <Form onSubmit={(e) => { e.preventDefault(); handleBook() }}>
          <div className="space-y-4">
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            {renderCustomerSection(
              bookPicker,
              setBookPicker,
              () => {
                setFormError(null)
                if (bookPicker.phone.trim().length < 7) {
                  setFormError('Enter a valid mobile number.')
                  return
                }
                bookSearchMutation.mutate(bookPicker.phone.trim())
              },
              bookSearchMutation.isPending
            )}
            <div>
              <p className="mb-2 text-sm font-medium">Date & time</p>
              <Input
                type="datetime-local"
                value={bookScheduledAt}
                onChange={(e) => setBookScheduledAt(e.target.value)}
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Services</p>
              {renderServicePicker(bookServiceIds, setBookServiceIds)}
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Assign staff (optional)</p>
              <Select
                options={staffSelectOptions}
                placeholder="— Select stylist —"
                value={bookStaffId}
                onChange={(e) => setBookStaffId(e.target.value)}
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Notes</p>
              <Textarea value={bookNotes} onChange={(e) => setBookNotes(e.target.value)} rows={2} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeBook}>
                Cancel
              </Button>
              <Button type="submit" disabled={bookMutation.isPending || registerMutation.isPending}>
                {bookMutation.isPending ? 'Booking…' : 'Book Appointment'}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Detail modal */}
      <Modal
        open={!!detailAppt}
        onOpenChange={(open) => !open && setDetailAppt(null)}
        title={detailAppt ? `${detailAppt.code} · ${detailAppt.customer?.name}` : 'Appointment'}
        className="max-w-2xl"
      >
        {detailAppt && (
          <div className="space-y-4">
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <div className="flex flex-wrap gap-2">
              <Badge variant={appointmentStatusVariant(detailAppt.status)}>
                {appointmentStatusLabel(detailAppt.status)}
              </Badge>
              <Badge variant="default">{detailAppt.type === 'walk_in' ? 'Walk-in' : 'Scheduled'}</Badge>
            </div>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">When</dt>
                <dd className="font-medium">{formatDate(detailAppt.scheduled_at)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Duration</dt>
                <dd className="font-medium">{formatDuration(detailAppt.duration_minutes)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Customer</dt>
                <dd className="font-medium">{detailAppt.customer?.name} · {detailAppt.customer?.phone}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Total</dt>
                <dd className="font-medium">
                  {formatCurrency(detailAppt.total_amount, settings?.currency ?? 'AED')}
                </dd>
              </div>
            </dl>
            {detailAppt.items && detailAppt.items.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium">Services</p>
                <ul className="space-y-1 rounded-lg border border-border p-3 text-sm">
                  {detailAppt.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.service_name}</span>
                      <span className="text-muted-foreground">
                        {formatDuration(item.duration_minutes)} · {formatCurrency(item.price, settings?.currency ?? 'AED')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {canUpdate && (
              <>
                <div>
                  <p className="mb-2 text-sm font-medium">Update status</p>
                  <div className="flex flex-wrap gap-2">
                    <Select
                      options={statusSelectOptions}
                      value={detailStatus}
                      onChange={(e) => setDetailStatus(e.target.value as AppointmentStatus)}
                    />
                    <Button
                      type="button"
                      size="sm"
                      disabled={statusMutation.isPending || detailStatus === detailAppt.status}
                      onClick={() => {
                        setFormError(null)
                        if (detailStatus === 'cancelled' && !cancelReason.trim()) {
                          setFormError('Cancellation reason is required.')
                          return
                        }
                        statusMutation.mutate({
                          id: detailAppt.id,
                          status: detailStatus,
                          reason: cancelReason || undefined,
                        })
                      }}
                    >
                      Update Status
                    </Button>
                  </div>
                  {detailStatus === 'cancelled' && (
                    <Textarea
                      className="mt-2"
                      placeholder="Cancellation reason"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      rows={2}
                    />
                  )}
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Assign staff</p>
                  <div className="flex flex-wrap gap-2">
                    <Select
                      options={staffSelectOptions}
                      placeholder="Unassigned"
                      value={detailStaffId}
                      onChange={(e) => setDetailStaffId(e.target.value)}
                    />
                    <Button
                      type="button"
                      size="sm"
                      disabled={assignMutation.isPending || !detailStaffId}
                      onClick={() => {
                        setFormError(null)
                        assignMutation.mutate({ id: detailAppt.id, staff_id: Number(detailStaffId) })
                      }}
                    >
                      Assign
                    </Button>
                  </div>
                </div>
              </>
            )}
            {hasPermission('appointments.delete') && (
              <div className="border-t border-border pt-4">
                <Button type="button" variant="destructive" size="sm" onClick={() => setDeleteTarget(detailAppt)}>
                  Delete appointment
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Delete appointment?"
        description={`Remove ${deleteTarget?.code}? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
