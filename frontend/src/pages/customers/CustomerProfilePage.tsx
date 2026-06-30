import { useRef, useState } from 'react'
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Calendar,
  Camera,
  Clock,
  Coins,
  Gift,
  MessageSquare,
  Pin,
  Trash2,
  UserRound,
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
  Form,
  Input,
  PageLoader,
  Select,
  Textarea,
} from '@/components'
import { usePermission } from '@/hooks/usePermission'
import { useAppSettings } from '@/contexts/SettingsContext'
import {
  customerService,
  GENDER_OPTIONS,
  type CustomerNote,
  type CustomerPayload,
  type CustomerVisit,
} from '@/services/customerService'
import { branchService, cityService, emirateService } from '@/services/masterService'
import {
  packageService,
  packageStatusLabel,
  packageStatusVariant,
  type CustomerPackage,
  type PointTransaction,
} from '@/services/packageService'
import { formatCurrency, formatDate } from '@/utils/format'
import { cn } from '@/utils/cn'
import { isPaginated } from '@/utils/master'

type Tab = 'profile' | 'notes' | 'visits' | 'history' | 'packages'

export default function CustomerProfilePage() {
  const { id } = useParams<{ id: string }>()
  const customerId = Number(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()
  const { settings } = useAppSettings()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState<Tab>('profile')
  const [formError, setFormError] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [deleteNoteTarget, setDeleteNoteTarget] = useState<CustomerNote | null>(null)
  const [deleteVisitTarget, setDeleteVisitTarget] = useState<CustomerVisit | null>(null)
  const [visitForm, setVisitForm] = useState({
    visited_at: toLocalDatetimeValue(new Date()),
    purpose: '',
    services_summary: '',
    amount_spent: '',
    notes: '',
  })

  const { data: customer, isLoading, isError } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => customerService.get(customerId),
    enabled: Number.isFinite(customerId),
  })

  const { data: historyData } = useQuery({
    queryKey: ['customer-history', customerId],
    queryFn: () => customerService.history(customerId),
    enabled: tab === 'history' && Number.isFinite(customerId),
  })

  const { data: notes } = useQuery({
    queryKey: ['customer-notes', customerId],
    queryFn: () => customerService.listNotes(customerId),
    enabled: tab === 'notes' && Number.isFinite(customerId),
  })

  const { data: visitsRaw } = useQuery({
    queryKey: ['customer-visits', customerId],
    queryFn: () => customerService.listVisits(customerId, { all: true }),
    enabled: tab === 'visits' && Number.isFinite(customerId),
  })

  const { data: packageSummary } = useQuery({
    queryKey: ['customer-packages-summary', customerId],
    queryFn: () => packageService.forCustomer(customerId),
    enabled: Number.isFinite(customerId) && hasPermission('customer-packages.view'),
  })

  const { data: pointHistory } = useQuery({
    queryKey: ['customer-point-history', customerId],
    queryFn: () => packageService.transactions({ customer_id: customerId, per_page: 50 }),
    enabled: tab === 'packages' && Number.isFinite(customerId) && hasPermission('customer-packages.view'),
  })

  const pointTransactions: PointTransaction[] = pointHistory && isPaginated(pointHistory) ? pointHistory.data : []

  const visits = Array.isArray(visitsRaw)
    ? visitsRaw
    : isPaginated<CustomerVisit>(visitsRaw)
      ? visitsRaw.data
      : []

  const [branchesQ, emiratesQ] = useQueries({
    queries: [
      { queryKey: ['branches-options'], queryFn: () => branchService.list({ all: true }) },
      { queryKey: ['emirates-options'], queryFn: () => emirateService.list({ all: true }) },
    ],
  })

  const [profileForm, setProfileForm] = useState<CustomerPayload | null>(null)

  const activeProfile = profileForm ?? (customer ? customerToPayload(customer) : null)

  const citiesQ = useQuery({
    queryKey: ['cities-options', activeProfile?.emirate_id],
    queryFn: () => cityService.list({ all: true, emirate_id: activeProfile?.emirate_id ?? undefined }),
    enabled: Boolean(activeProfile?.emirate_id),
  })

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<CustomerPayload>) => customerService.update(customerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] })
      setFormError(null)
    },
    onError: (err: unknown) => setFormError(extractError(err)),
  })

  const photoMutation = useMutation({
    mutationFn: (file: File) => customerService.uploadPhoto(customerId, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customer', customerId] }),
  })

  const deletePhotoMutation = useMutation({
    mutationFn: () => customerService.deletePhoto(customerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customer', customerId] }),
  })

  const createNoteMutation = useMutation({
    mutationFn: () => customerService.createNote(customerId, { note: noteText.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-notes', customerId] })
      queryClient.invalidateQueries({ queryKey: ['customer-history', customerId] })
      setNoteText('')
    },
  })

  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: number) => customerService.deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-notes', customerId] })
      queryClient.invalidateQueries({ queryKey: ['customer-history', customerId] })
      setDeleteNoteTarget(null)
    },
  })

  const createVisitMutation = useMutation({
    mutationFn: () =>
      customerService.createVisit(customerId, {
        visited_at: new Date(visitForm.visited_at).toISOString(),
        purpose: visitForm.purpose || null,
        services_summary: visitForm.services_summary || null,
        amount_spent: visitForm.amount_spent ? Number(visitForm.amount_spent) : null,
        notes: visitForm.notes || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-visits', customerId] })
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] })
      queryClient.invalidateQueries({ queryKey: ['customer-history', customerId] })
      setVisitForm({
        visited_at: toLocalDatetimeValue(new Date()),
        purpose: '',
        services_summary: '',
        amount_spent: '',
        notes: '',
      })
    },
  })

  const deleteVisitMutation = useMutation({
    mutationFn: (visitId: number) => customerService.deleteVisit(visitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-visits', customerId] })
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] })
      queryClient.invalidateQueries({ queryKey: ['customer-history', customerId] })
      setDeleteVisitTarget(null)
    },
  })

  const toOptions = (raw: unknown) => {
    const items = Array.isArray(raw) ? raw : []
    return items.map((i) => ({ value: i.id as number, label: String((i as { name: string }).name ?? '') }))
  }

  if (isLoading) return <PageLoader />
  if (isError || !customer || !activeProfile) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Customer not found.{' '}
        <Button variant="ghost" className="h-auto p-0 text-primary underline" onClick={() => navigate('/customers')}>
          Back to search
        </Button>
      </div>
    )
  }

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(activeProfile)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'notes', label: 'Notes' },
    { id: 'visits', label: 'Visits' },
    ...(hasPermission('customer-packages.view') ? [{ id: 'packages' as Tab, label: 'Packages' }] : []),
    { id: 'history', label: 'History' },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Customers', href: '/customers' },
          { label: customer.name },
        ]}
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <Card className="lg:w-72 shrink-0">
          <CardContent className="flex flex-col items-center pt-6 text-center">
            <div className="relative">
              {customer.photo ? (
                <img
                  src={customer.photo}
                  alt={customer.name}
                  className="h-28 w-28 rounded-full object-cover ring-4 ring-primary/10"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="h-14 w-14" />
                </div>
              )}
              {hasPermission('customers.update') && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-md"
                    title="Upload photo"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) photoMutation.mutate(file)
                    }}
                  />
                </>
              )}
            </div>
            <h1 className="mt-4 font-serif text-2xl font-semibold">{customer.name}</h1>
            <p className="text-sm text-muted-foreground">{customer.phone}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              <Badge>{customer.code}</Badge>
              {customer.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="warning">Inactive</Badge>}
            </div>
            {customer.photo && hasPermission('customers.update') && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-destructive"
                onClick={() => deletePhotoMutation.mutate()}
                loading={deletePhotoMutation.isPending}
              >
                Remove photo
              </Button>
            )}
            <div className="mt-6 w-full space-y-2 text-left text-sm">
              <div className="flex justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span className="text-muted-foreground">Visits</span>
                <span className="font-medium">{customer.total_visits}</span>
              </div>
              <div className="flex justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span className="text-muted-foreground">Total Spent</span>
                <span className="font-medium">{formatCurrency(customer.total_spent, settings.currency)}</span>
              </div>
              <div className="flex justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span className="text-muted-foreground">Last Visit</span>
                <span className="font-medium">
                  {customer.last_visit_at ? formatDate(customer.last_visit_at) : '—'}
                </span>
              </div>
              {hasPermission('customer-packages.view') && packageSummary && (
                <div className="flex justify-between rounded-lg bg-primary/10 px-3 py-2">
                  <span className="text-muted-foreground">Point Balance</span>
                  <span className="font-semibold text-primary">{packageSummary.balance} pts</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/30 p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                  tab === t.id ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Customer Details</CardTitle>
              </CardHeader>
              <CardContent>
                {formError && (
                  <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {formError}
                  </div>
                )}
                <Form onSubmit={handleProfileSave}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Full Name" value={activeProfile.name} onChange={(e) => setProfileForm({ ...activeProfile, name: e.target.value })} required />
                    <Input label="Mobile" value={activeProfile.phone} onChange={(e) => setProfileForm({ ...activeProfile, phone: e.target.value })} required />
                    <Input label="Email" type="email" value={activeProfile.email ?? ''} onChange={(e) => setProfileForm({ ...activeProfile, email: e.target.value || null })} />
                    <Select
                      label="Gender"
                      options={GENDER_OPTIONS.map((g) => ({ value: g.value, label: g.label }))}
                      placeholder="Select gender"
                      value={activeProfile.gender ?? ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...activeProfile,
                          gender: (e.target.value || null) as CustomerPayload['gender'],
                        })
                      }
                    />
                    <Input
                      label="Date of Birth"
                      type="date"
                      value={activeProfile.date_of_birth ?? ''}
                      onChange={(e) => setProfileForm({ ...activeProfile, date_of_birth: e.target.value || null })}
                    />
                    <Select
                      label="Branch"
                      options={toOptions(branchesQ.data)}
                      placeholder="Select branch"
                      value={activeProfile.branch_id ?? ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...activeProfile,
                          branch_id: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                    />
                    <Select
                      label="Emirate"
                      options={toOptions(emiratesQ.data)}
                      placeholder="Select emirate"
                      value={activeProfile.emirate_id ?? ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...activeProfile,
                          emirate_id: e.target.value ? Number(e.target.value) : null,
                          city_id: null,
                        })
                      }
                    />
                    <Select
                      label="City"
                      options={toOptions(citiesQ.data)}
                      placeholder="Select city"
                      value={activeProfile.city_id ?? ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...activeProfile,
                          city_id: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                    />
                    <div className="sm:col-span-2">
                      <Textarea
                        label="Address"
                        value={activeProfile.address ?? ''}
                        onChange={(e) => setProfileForm({ ...activeProfile, address: e.target.value || null })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Textarea
                        label="Summary"
                        value={activeProfile.summary ?? ''}
                        onChange={(e) => setProfileForm({ ...activeProfile, summary: e.target.value || null })}
                      />
                    </div>
                    <Checkbox
                      label="Active customer"
                      checked={activeProfile.is_active ?? true}
                      onChange={(e) => setProfileForm({ ...activeProfile, is_active: e.target.checked })}
                    />
                  </div>
                  {hasPermission('customers.update') && (
                    <div className="mt-6">
                      <Button type="submit" loading={updateMutation.isPending}>
                        Save Changes
                      </Button>
                    </div>
                  )}
                </Form>
              </CardContent>
            </Card>
          )}

          {tab === 'notes' && (
            <div className="space-y-4">
              {hasPermission('customer-notes.create') && (
                <Card>
                  <CardContent className="pt-6">
                    <Textarea
                      label="Add a note"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Preferences, allergies, stylist notes..."
                    />
                    <Button
                      className="mt-3"
                      disabled={!noteText.trim()}
                      loading={createNoteMutation.isPending}
                      onClick={() => createNoteMutation.mutate()}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Add Note
                    </Button>
                  </CardContent>
                </Card>
              )}
              <div className="space-y-3">
                {(notes ?? []).length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">No notes yet.</CardContent>
                  </Card>
                )}
                {(notes ?? []).map((note) => (
                  <Card key={note.id}>
                    <CardContent className="flex gap-3 pt-6">
                      <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="whitespace-pre-wrap text-sm">{note.note}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {note.user?.name ?? 'Staff'} · {note.created_at ? formatDate(note.created_at) : ''}
                          {note.is_pinned && (
                            <span className="ml-2 inline-flex items-center gap-1 text-primary">
                              <Pin className="h-3 w-3" /> Pinned
                            </span>
                          )}
                        </p>
                      </div>
                      {hasPermission('customer-notes.delete') && (
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteNoteTarget(note)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {tab === 'visits' && (
            <div className="space-y-4">
              {hasPermission('customer-visits.create') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">Record Visit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Visit Date & Time"
                        type="datetime-local"
                        value={visitForm.visited_at}
                        onChange={(e) => setVisitForm((p) => ({ ...p, visited_at: e.target.value }))}
                      />
                      <Input
                        label="Purpose"
                        value={visitForm.purpose}
                        onChange={(e) => setVisitForm((p) => ({ ...p, purpose: e.target.value }))}
                        placeholder="e.g. Haircut, Facial"
                      />
                      <Input
                        label="Amount Spent"
                        type="number"
                        min="0"
                        step="0.01"
                        value={visitForm.amount_spent}
                        onChange={(e) => setVisitForm((p) => ({ ...p, amount_spent: e.target.value }))}
                      />
                      <div className="sm:col-span-2">
                        <Textarea
                          label="Services Summary"
                          value={visitForm.services_summary}
                          onChange={(e) => setVisitForm((p) => ({ ...p, services_summary: e.target.value }))}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Textarea
                          label="Visit Notes"
                          value={visitForm.notes}
                          onChange={(e) => setVisitForm((p) => ({ ...p, notes: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button className="mt-4" loading={createVisitMutation.isPending} onClick={() => createVisitMutation.mutate()}>
                      <Calendar className="h-4 w-4" />
                      Record Visit
                    </Button>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {visits.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">No visits recorded yet.</CardContent>
                  </Card>
                )}
                {visits.map((visit) => (
                  <Card key={visit.id}>
                    <CardContent className="flex gap-3 pt-6">
                      <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{visit.purpose ?? 'Salon visit'}</p>
                          {visit.amount_spent != null && visit.amount_spent > 0 && (
                            <Badge>{formatCurrency(visit.amount_spent, settings.currency)}</Badge>
                          )}
                        </div>
                        {visit.services_summary && (
                          <p className="mt-1 text-sm text-muted-foreground">{visit.services_summary}</p>
                        )}
                        {visit.notes && <p className="mt-1 text-sm">{visit.notes}</p>}
                        <p className="mt-2 text-xs text-muted-foreground">
                          <Clock className="mr-1 inline h-3 w-3" />
                          {formatDate(visit.visited_at)}
                          {visit.branch?.name && ` · ${visit.branch.name}`}
                          {visit.staff?.name && ` · ${visit.staff.name}`}
                        </p>
                      </div>
                      {hasPermission('customer-visits.delete') && (
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteVisitTarget(visit)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {tab === 'packages' && hasPermission('customer-packages.view') && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Coins className="h-5 w-5 text-primary" />
                    Point Balance — {packageSummary?.balance ?? 0} pts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(packageSummary?.packages ?? []).length === 0 && (
                    <p className="text-sm text-muted-foreground">No packages purchased yet.</p>
                  )}
                  {(packageSummary?.packages ?? []).map((pkg: CustomerPackage) => (
                    <div key={pkg.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3">
                      <div>
                        <p className="font-medium">{pkg.service_package?.name ?? pkg.code}</p>
                        <p className="text-sm text-muted-foreground">
                          {pkg.points_remaining} / {pkg.points_allocated} pts remaining
                          {pkg.expires_at && ` · Expires ${formatDate(pkg.expires_at)}`}
                        </p>
                      </div>
                      <Badge variant={packageStatusVariant(pkg.status)}>{packageStatusLabel(pkg.status)}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Gift className="h-5 w-5 text-secondary" />
                    Package History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pointTransactions.length === 0 && (
                    <p className="text-sm text-muted-foreground">No point transactions yet.</p>
                  )}
                  {pointTransactions.map((tx) => (
                    <div key={tx.id} className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{tx.type_label}</p>
                        <p className="text-sm text-muted-foreground">{tx.description ?? tx.reference}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {tx.created_at ? formatDate(tx.created_at) : ''}
                          {tx.service?.name && ` · ${tx.service.name}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={cn('font-semibold', tx.points >= 0 ? 'text-green-600' : 'text-destructive')}>
                          {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                        </p>
                        <p className="text-xs text-muted-foreground">Balance: {tx.balance_after}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {tab === 'history' && (
            <div className="space-y-3">
              {(historyData?.timeline ?? []).length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">No history yet.</CardContent>
                </Card>
              )}
              {(historyData?.timeline ?? []).map((item) => (
                <Card key={`${item.type}-${item.id}`}>
                  <CardContent className="flex gap-3 pt-6">
                    {item.type === 'visit' ? (
                      <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                    ) : (
                      <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    )}
                    <div>
                      <p className="font-medium">{item.title}</p>
                      {item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}
                      <p className="mt-2 text-xs text-muted-foreground">
                        {item.occurred_at ? formatDate(item.occurred_at) : ''}
                        {item.author && ` · ${item.author}`}
                        {item.amount_spent != null && item.amount_spent > 0 &&
                          ` · ${formatCurrency(item.amount_spent, settings.currency)}`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleteNoteTarget)}
        onOpenChange={(o) => !o && setDeleteNoteTarget(null)}
        title="Delete Note"
        description="Remove this note permanently?"
        onConfirm={() => deleteNoteTarget && deleteNoteMutation.mutate(deleteNoteTarget.id)}
        loading={deleteNoteMutation.isPending}
      />

      <ConfirmDialog
        open={Boolean(deleteVisitTarget)}
        onOpenChange={(o) => !o && setDeleteVisitTarget(null)}
        title="Delete Visit"
        description="Remove this visit record? Customer stats will be recalculated."
        onConfirm={() => deleteVisitTarget && deleteVisitMutation.mutate(deleteVisitTarget.id)}
        loading={deleteVisitMutation.isPending}
      />
    </div>
  )
}

function customerToPayload(customer: {
  name: string
  phone: string
  email?: string | null
  gender?: CustomerPayload['gender']
  date_of_birth?: string | null
  address?: string | null
  branch_id?: number | null
  emirate_id?: number | null
  city_id?: number | null
  summary?: string | null
  is_active: boolean
}): CustomerPayload {
  return {
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    gender: customer.gender,
    date_of_birth: customer.date_of_birth,
    address: customer.address,
    branch_id: customer.branch_id,
    emirate_id: customer.emirate_id,
    city_id: customer.city_id,
    summary: customer.summary,
    is_active: customer.is_active,
  }
}

function toLocalDatetimeValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    return (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'An error occurred'
  }
  return 'An error occurred'
}
