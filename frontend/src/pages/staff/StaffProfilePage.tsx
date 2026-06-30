import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import {
  Banknote,
  Calendar,
  Camera,
  FileText,
  Percent,
  Trash2,
  Upload,
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
  ConfirmDialog,
  Form,
  Input,
  PageLoader,
  Select,
  Textarea,
} from '@/components'
import { StatCard } from '@/components/dashboard/StatCard'
import { usePermission } from '@/hooks/usePermission'
import { useAppSettings } from '@/contexts/SettingsContext'
import {
  ATTENDANCE_STATUS_OPTIONS,
  COMMISSION_RATE_OPTIONS,
  DOCUMENT_TYPE_OPTIONS,
  EMPLOYMENT_OPTIONS,
  LEAVE_TYPE_OPTIONS,
  type StaffLeave,
  staffService,
  type StaffMember,
  type StaffPayload,
} from '@/services/staffService'
import { GENDER_OPTIONS } from '@/services/customerService'
import { serviceCategoryService } from '@/services/masterService'
import { formatCurrency, formatDate } from '@/utils/format'
import { cn } from '@/utils/cn'
import { ROLE_LABELS, type Role } from '@/constants/roles'

type Tab = 'dashboard' | 'profile' | 'documents' | 'salary' | 'attendance' | 'leave' | 'commission'

export default function StaffProfilePage() {
  const { id } = useParams<{ id: string }>()
  const staffId = Number(id)
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()
  const { settings } = useAppSettings()
  const fileRef = useRef<HTMLInputElement>(null)
  const avatarRef = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState<Tab>('dashboard')
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteDocId, setDeleteDocId] = useState<number | null>(null)

  const [docForm, setDocForm] = useState({ document_type: 'passport', title: '', document_number: '', expiry_date: '' })
  const [salaryForm, setSalaryForm] = useState({ base_salary: '', housing_allowance: '0', transport_allowance: '500', effective_from: new Date().toISOString().slice(0, 10) })
  const [attForm, setAttForm] = useState({ attendance_date: new Date().toISOString().slice(0, 10), status: 'present', check_in: '09:00', check_out: '18:00' })
  const [leaveForm, setLeaveForm] = useState({ leave_type: 'annual', start_date: '', end_date: '', reason: '' })
  const [commForm, setCommForm] = useState({ name: '', rate_type: 'percentage', rate_value: '10', service_category_id: '' })

  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff', staffId],
    queryFn: () => staffService.get(staffId),
    enabled: Number.isFinite(staffId),
  })

  const { data: dash } = useQuery({
    queryKey: ['staff-member-dashboard', staffId],
    queryFn: () => staffService.memberDashboard(staffId),
    enabled: tab === 'dashboard' && Number.isFinite(staffId),
  })

  const { data: documents } = useQuery({
    queryKey: ['staff-documents', staffId],
    queryFn: () => staffService.listDocuments(staffId),
    enabled: tab === 'documents' && Number.isFinite(staffId),
  })

  const { data: salaries } = useQuery({
    queryKey: ['staff-salaries', staffId],
    queryFn: () => staffService.listSalaries(staffId),
    enabled: tab === 'salary' && Number.isFinite(staffId),
  })

  const { data: attendance } = useQuery({
    queryKey: ['staff-attendance', staffId],
    queryFn: () => staffService.listAttendance(staffId),
    enabled: tab === 'attendance' && Number.isFinite(staffId),
  })

  const { data: leaves } = useQuery({
    queryKey: ['staff-leave', staffId],
    queryFn: () => staffService.listLeave(staffId),
    enabled: tab === 'leave' && Number.isFinite(staffId),
  })

  const { data: commissions } = useQuery({
    queryKey: ['staff-commission', staffId],
    queryFn: () => staffService.listCommission(staffId),
    enabled: tab === 'commission' && Number.isFinite(staffId),
  })

  const { data: categories } = useQuery({
    queryKey: ['service-categories-options'],
    queryFn: () => serviceCategoryService.list({ all: true }),
    enabled: tab === 'commission',
  })

  const [profileForm, setProfileForm] = useState<StaffPayload | null>(null)
  const activeProfile = profileForm ?? (staff ? staffToPayload(staff) : null)

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<StaffPayload>) => staffService.update(staffId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', staffId] })
      setFormError(null)
    },
    onError: (err: unknown) => setFormError(extractError(err)),
  })

  const avatarMutation = useMutation({
    mutationFn: (file: File) => staffService.uploadAvatar(staffId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', staffId] })
      queryClient.invalidateQueries({ queryKey: ['public-team'] })
    },
  })

  const deleteAvatarMutation = useMutation({
    mutationFn: () => staffService.deleteAvatar(staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', staffId] })
      queryClient.invalidateQueries({ queryKey: ['public-team'] })
    },
  })

  const createDocMutation = useMutation({
    mutationFn: (form: FormData) => staffService.createDocument(staffId, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-documents', staffId] })
      setDocForm({ document_type: 'passport', title: '', document_number: '', expiry_date: '' })
    },
  })

  const deleteDocMutation = useMutation({
    mutationFn: staffService.deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-documents', staffId] })
      setDeleteDocId(null)
    },
  })

  const createSalaryMutation = useMutation({
    mutationFn: () =>
      staffService.createSalary(staffId, {
        base_salary: Number(salaryForm.base_salary),
        housing_allowance: Number(salaryForm.housing_allowance),
        transport_allowance: Number(salaryForm.transport_allowance),
        effective_from: salaryForm.effective_from,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-salaries', staffId] }),
  })

  const createAttMutation = useMutation({
    mutationFn: () => staffService.createAttendance(staffId, {
      attendance_date: attForm.attendance_date,
      status: attForm.status as 'present',
      check_in: attForm.check_in,
      check_out: attForm.check_out,
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-attendance', staffId] }),
  })

  const createLeaveMutation = useMutation({
    mutationFn: () => staffService.createLeave(staffId, {
      leave_type: leaveForm.leave_type as StaffLeave['leave_type'],
      start_date: leaveForm.start_date,
      end_date: leaveForm.end_date,
      reason: leaveForm.reason,
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-leave', staffId] }),
  })

  const updateLeaveMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => staffService.updateLeave(id, { status: status as 'approved' | 'rejected' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-leave', staffId] }),
  })

  const createCommMutation = useMutation({
    mutationFn: () =>
      staffService.createCommission(staffId, {
        name: commForm.name,
        rate_type: commForm.rate_type as 'percentage' | 'fixed',
        rate_value: Number(commForm.rate_value),
        service_category_id: commForm.service_category_id ? Number(commForm.service_category_id) : null,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff-commission', staffId] }),
  })

  if (isLoading || !staff || !activeProfile) return <PageLoader />

  const tabs: { id: Tab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'profile', label: 'Profile' },
    { id: 'documents', label: 'Documents' },
    { id: 'salary', label: 'Salary' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'leave', label: 'Leave' },
    { id: 'commission', label: 'Commission' },
  ]

  const attList = Array.isArray(attendance) ? attendance : []

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Staff', href: '/staff/directory' }, { label: staff.name }]} />

      <div className="flex flex-col gap-6 lg:flex-row">
        <Card className="lg:w-72 shrink-0">
          <CardContent className="flex flex-col items-center pt-6 text-center">
            <div className="relative">
              {staff.avatar ? (
                <img
                  src={staff.avatar}
                  alt={staff.name}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/10"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="h-12 w-12" />
                </div>
              )}
              {hasPermission('staff.update') && (
                <>
                  <button
                    type="button"
                    onClick={() => avatarRef.current?.click()}
                    className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-md"
                    title="Upload profile photo"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={avatarRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) avatarMutation.mutate(file)
                    }}
                  />
                </>
              )}
            </div>
            <h1 className="mt-4 font-serif text-2xl font-semibold">{staff.name}</h1>
            <p className="text-sm text-muted-foreground">{staff.employee_code}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              <Badge>{ROLE_LABELS[(staff.role ?? staff.roles?.[0] ?? 'staff') as Role]}</Badge>
              {staff.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="warning">Inactive</Badge>}
            </div>
            {staff.avatar && hasPermission('staff.update') && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-destructive"
                onClick={() => deleteAvatarMutation.mutate()}
                loading={deleteAvatarMutation.isPending}
              >
                Remove photo
              </Button>
            )}
            <p className="mt-3 text-sm text-muted-foreground">{staff.branch?.name ?? '—'}</p>
            <p className="text-sm text-muted-foreground">{staff.staff_designation?.name ?? '—'}</p>
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
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  tab === t.id ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'dashboard' && dash && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Present (month)" value={dash.attendance_summary?.present ?? 0} icon={Calendar} />
                <StatCard title="Pending Leave" value={dash.pending_leave} icon={FileText} />
                <StatCard title="Commission Rules" value={dash.commission_rules_count} icon={Percent} />
              </div>
              {dash.current_salary && (
                <Card>
                  <CardHeader><CardTitle className="font-serif text-lg">Current Salary</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {formatCurrency(dash.current_salary.total_salary, dash.current_salary.currency || settings.currency)}
                    </p>
                    <p className="text-sm text-muted-foreground">Effective from {formatDate(dash.current_salary.effective_from)}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {tab === 'profile' && (
            <Card>
              <CardContent className="pt-6">
                {formError && <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{formError}</div>}
                <Form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(activeProfile) }}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Name" value={activeProfile.name} onChange={(e) => setProfileForm({ ...activeProfile, name: e.target.value })} />
                    <Input label="Phone" value={activeProfile.phone ?? ''} onChange={(e) => setProfileForm({ ...activeProfile, phone: e.target.value })} />
                    <Input label="Joining Date" type="date" value={activeProfile.joining_date ?? ''} onChange={(e) => setProfileForm({ ...activeProfile, joining_date: e.target.value || null })} />
                    <Select label="Employment Type" options={EMPLOYMENT_OPTIONS} value={activeProfile.employment_type ?? ''} onChange={(e) => setProfileForm({ ...activeProfile, employment_type: (e.target.value || null) as StaffPayload['employment_type'] })} />
                    <Select label="Gender" options={GENDER_OPTIONS.map((g) => ({ value: g.value, label: g.label }))} value={activeProfile.gender ?? ''} onChange={(e) => setProfileForm({ ...activeProfile, gender: (e.target.value || null) as StaffPayload['gender'] })} />
                    <Input label="Nationality" value={activeProfile.nationality ?? ''} onChange={(e) => setProfileForm({ ...activeProfile, nationality: e.target.value || null })} />
                    <Input label="Emirates ID" value={activeProfile.emirates_id ?? ''} onChange={(e) => setProfileForm({ ...activeProfile, emirates_id: e.target.value || null })} />
                    <Input label="Visa Number" value={activeProfile.visa_number ?? ''} onChange={(e) => setProfileForm({ ...activeProfile, visa_number: e.target.value || null })} />
                    <Input label="Visa Expiry" type="date" value={activeProfile.visa_expiry ?? ''} onChange={(e) => setProfileForm({ ...activeProfile, visa_expiry: e.target.value || null })} />
                    <Input label="Emergency Contact" value={activeProfile.emergency_contact_name ?? ''} onChange={(e) => setProfileForm({ ...activeProfile, emergency_contact_name: e.target.value || null })} />
                    <Input label="Emergency Phone" value={activeProfile.emergency_contact_phone ?? ''} onChange={(e) => setProfileForm({ ...activeProfile, emergency_contact_phone: e.target.value || null })} />
                    <div className="sm:col-span-2"><Textarea label="Address" value={activeProfile.address ?? ''} onChange={(e) => setProfileForm({ ...activeProfile, address: e.target.value || null })} /></div>
                    <div className="sm:col-span-2"><Textarea label="Notes" value={activeProfile.staff_notes ?? ''} onChange={(e) => setProfileForm({ ...activeProfile, staff_notes: e.target.value || null })} /></div>
                  </div>
                  {hasPermission('staff.update') && (
                    <Button type="submit" className="mt-4" loading={updateMutation.isPending}>Save Profile</Button>
                  )}
                </Form>
              </CardContent>
            </Card>
          )}

          {tab === 'documents' && (
            <div className="space-y-4">
              {hasPermission('staff-documents.create') && (
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Select label="Type" options={DOCUMENT_TYPE_OPTIONS} value={docForm.document_type} onChange={(e) => setDocForm((p) => ({ ...p, document_type: e.target.value }))} />
                      <Input label="Title" value={docForm.title} onChange={(e) => setDocForm((p) => ({ ...p, title: e.target.value }))} />
                      <Input label="Document Number" value={docForm.document_number} onChange={(e) => setDocForm((p) => ({ ...p, document_number: e.target.value }))} />
                      <Input label="Expiry Date" type="date" value={docForm.expiry_date} onChange={(e) => setDocForm((p) => ({ ...p, expiry_date: e.target.value }))} />
                    </div>
                    <input ref={fileRef} type="file" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file || !docForm.title) return
                      const fd = new FormData()
                      fd.append('document_type', docForm.document_type)
                      fd.append('title', docForm.title)
                      if (docForm.document_number) fd.append('document_number', docForm.document_number)
                      if (docForm.expiry_date) fd.append('expiry_date', docForm.expiry_date)
                      fd.append('file', file)
                      createDocMutation.mutate(fd)
                    }} />
                    <Button onClick={() => fileRef.current?.click()} disabled={!docForm.title} loading={createDocMutation.isPending}>
                      <Upload className="h-4 w-4" /> Upload Document
                    </Button>
                  </CardContent>
                </Card>
              )}
              {(documents ?? []).map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="flex items-center justify-between pt-6">
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-sm text-muted-foreground">{doc.document_type} · {doc.document_number ?? '—'}</p>
                      {doc.expiry_date && <p className="text-xs text-muted-foreground">Expires {formatDate(doc.expiry_date)}</p>}
                      {doc.file_url && <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">View file</a>}
                    </div>
                    {hasPermission('staff-documents.delete') && (
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteDocId(doc.id)}><Trash2 className="h-4 w-4" /></Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {tab === 'salary' && (
            <div className="space-y-4">
              {hasPermission('staff-salary.create') && (
                <Card>
                  <CardContent className="grid gap-3 pt-6 sm:grid-cols-2">
                    <Input label="Base Salary" type="number" value={salaryForm.base_salary} onChange={(e) => setSalaryForm((p) => ({ ...p, base_salary: e.target.value }))} />
                    <Input label="Housing Allowance" type="number" value={salaryForm.housing_allowance} onChange={(e) => setSalaryForm((p) => ({ ...p, housing_allowance: e.target.value }))} />
                    <Input label="Transport" type="number" value={salaryForm.transport_allowance} onChange={(e) => setSalaryForm((p) => ({ ...p, transport_allowance: e.target.value }))} />
                    <Input label="Effective From" type="date" value={salaryForm.effective_from} onChange={(e) => setSalaryForm((p) => ({ ...p, effective_from: e.target.value }))} />
                    <Button onClick={() => createSalaryMutation.mutate()} loading={createSalaryMutation.isPending}><Banknote className="h-4 w-4" /> Add Salary</Button>
                  </CardContent>
                </Card>
              )}
              {(salaries ?? []).map((s) => (
                <Card key={s.id}>
                  <CardContent className="pt-6">
                    <p className="text-xl font-bold">{formatCurrency(s.total_salary, s.currency)}</p>
                    <p className="text-sm text-muted-foreground">Base {formatCurrency(s.base_salary, s.currency)} · from {formatDate(s.effective_from)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {tab === 'attendance' && (
            <div className="space-y-4">
              {hasPermission('staff-attendance.create') && (
                <Card>
                  <CardContent className="grid gap-3 pt-6 sm:grid-cols-2">
                    <Input label="Date" type="date" value={attForm.attendance_date} onChange={(e) => setAttForm((p) => ({ ...p, attendance_date: e.target.value }))} />
                    <Select label="Status" options={ATTENDANCE_STATUS_OPTIONS} value={attForm.status} onChange={(e) => setAttForm((p) => ({ ...p, status: e.target.value }))} />
                    <Input label="Check In" type="time" value={attForm.check_in} onChange={(e) => setAttForm((p) => ({ ...p, check_in: e.target.value }))} />
                    <Input label="Check Out" type="time" value={attForm.check_out} onChange={(e) => setAttForm((p) => ({ ...p, check_out: e.target.value }))} />
                    <Button onClick={() => createAttMutation.mutate()} loading={createAttMutation.isPending}>Record Attendance</Button>
                  </CardContent>
                </Card>
              )}
              {attList.map((a) => (
                <Card key={a.id}>
                  <CardContent className="flex justify-between pt-6">
                    <div>
                      <p className="font-medium">{formatDate(a.attendance_date)}</p>
                      <p className="text-sm text-muted-foreground">{a.status} · {a.check_in ?? '—'} – {a.check_out ?? '—'}</p>
                    </div>
                    <Badge>{a.status}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {tab === 'leave' && (
            <div className="space-y-4">
              {hasPermission('staff-leave.create') && (
                <Card>
                  <CardContent className="grid gap-3 pt-6 sm:grid-cols-2">
                    <Select label="Type" options={LEAVE_TYPE_OPTIONS} value={leaveForm.leave_type} onChange={(e) => setLeaveForm((p) => ({ ...p, leave_type: e.target.value }))} />
                    <Input label="Start" type="date" value={leaveForm.start_date} onChange={(e) => setLeaveForm((p) => ({ ...p, start_date: e.target.value }))} />
                    <Input label="End" type="date" value={leaveForm.end_date} onChange={(e) => setLeaveForm((p) => ({ ...p, end_date: e.target.value }))} />
                    <Textarea label="Reason" value={leaveForm.reason} onChange={(e) => setLeaveForm((p) => ({ ...p, reason: e.target.value }))} />
                    <Button onClick={() => createLeaveMutation.mutate()} loading={createLeaveMutation.isPending}>Submit Leave</Button>
                  </CardContent>
                </Card>
              )}
              {(leaves ?? []).map((l) => (
                <Card key={l.id}>
                  <CardContent className="flex items-center justify-between pt-6">
                    <div>
                      <p className="font-medium">{l.leave_type} · {l.days} day(s)</p>
                      <p className="text-sm text-muted-foreground">{formatDate(l.start_date)} – {formatDate(l.end_date)}</p>
                      <Badge className="mt-1">{l.status}</Badge>
                    </div>
                    {l.status === 'pending' && hasPermission('staff-leave.update') && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateLeaveMutation.mutate({ id: l.id, status: 'approved' })}>Approve</Button>
                        <Button size="sm" variant="outline" onClick={() => updateLeaveMutation.mutate({ id: l.id, status: 'rejected' })}>Reject</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {tab === 'commission' && (
            <div className="space-y-4">
              {hasPermission('staff-commission.create') && (
                <Card>
                  <CardContent className="grid gap-3 pt-6 sm:grid-cols-2">
                    <Input label="Rule Name" value={commForm.name} onChange={(e) => setCommForm((p) => ({ ...p, name: e.target.value }))} />
                    <Select label="Rate Type" options={COMMISSION_RATE_OPTIONS} value={commForm.rate_type} onChange={(e) => setCommForm((p) => ({ ...p, rate_type: e.target.value }))} />
                    <Input label="Rate Value" type="number" value={commForm.rate_value} onChange={(e) => setCommForm((p) => ({ ...p, rate_value: e.target.value }))} />
                    <Select label="Service Category" options={(Array.isArray(categories) ? categories : []).map((c: { id: number; name: string }) => ({ value: c.id, label: c.name }))} value={commForm.service_category_id} onChange={(e) => setCommForm((p) => ({ ...p, service_category_id: e.target.value }))} placeholder="All services" />
                    <Button onClick={() => createCommMutation.mutate()} loading={createCommMutation.isPending} disabled={!commForm.name}>Add Rule</Button>
                  </CardContent>
                </Card>
              )}
              {(commissions ?? []).map((c) => (
                <Card key={c.id}>
                  <CardContent className="pt-6">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {c.rate_type === 'percentage' ? `${c.rate_value}%` : formatCurrency(c.rate_value, settings.currency)}
                      {c.service_category?.name && ` · ${c.service_category.name}`}
                    </p>
                    <Badge className="mt-1" variant={c.is_active ? 'success' : 'warning'}>{c.is_active ? 'Active' : 'Inactive'}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteDocId !== null}
        onOpenChange={(o) => !o && setDeleteDocId(null)}
        title="Delete Document"
        description="Remove this document permanently?"
        onConfirm={() => deleteDocId && deleteDocMutation.mutate(deleteDocId)}
        loading={deleteDocMutation.isPending}
      />
    </div>
  )
}

function staffToPayload(staff: StaffMember): StaffPayload {
  return {
    name: staff.name,
    email: staff.email,
    phone: staff.phone,
    employee_code: staff.employee_code,
    branch_id: staff.branch_id,
    department_id: staff.department_id,
    staff_designation_id: staff.staff_designation_id,
    role: staff.role ?? staff.roles?.[0] ?? 'staff',
    is_active: staff.is_active,
    date_of_birth: staff.date_of_birth,
    gender: staff.gender,
    nationality: staff.nationality,
    joining_date: staff.joining_date,
    employment_type: staff.employment_type,
    emirates_id: staff.emirates_id,
    visa_number: staff.visa_number,
    visa_expiry: staff.visa_expiry,
    address: staff.address,
    emergency_contact_name: staff.emergency_contact_name,
    emergency_contact_phone: staff.emergency_contact_phone,
    staff_notes: staff.staff_notes,
  }
}

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    return (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'An error occurred'
  }
  return 'An error occurred'
}
