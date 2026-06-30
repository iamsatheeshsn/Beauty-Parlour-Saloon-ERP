import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, List, Phone, UserPlus, UserRound } from 'lucide-react'
import {
  Badge,
  Breadcrumb,
  Button,
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  Input,
  Select,
} from '@/components'
import { CustomerSearchInput } from '@/components/customers/CustomerSearchInput'
import { usePermission } from '@/hooks/usePermission'
import {
  customerService,
  GENDER_OPTIONS,
  type Customer,
  type CustomerPayload,
} from '@/services/customerService'
import { formatDate } from '@/utils/format'

export default function CustomerSearchPage() {
  const navigate = useNavigate()
  const { hasPermission } = usePermission()
  const [phone, setPhone] = useState('')
  const [searchedPhone, setSearchedPhone] = useState<string | null>(null)
  const [foundCustomer, setFoundCustomer] = useState<Customer | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [registerMode, setRegisterMode] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [registerForm, setRegisterForm] = useState<CustomerPayload>({
    name: '',
    phone: '',
    gender: null,
    is_active: true,
  })

  const searchMutation = useMutation({
    mutationFn: () => customerService.searchByPhone(phone.trim()),
    onSuccess: (result) => {
      setSearchedPhone(phone.trim())
      setNotFound(!result.found)
      setFoundCustomer(result.customer)
      setRegisterMode(!result.found)
      if (!result.found) {
        setRegisterForm((prev) => ({ ...prev, phone: phone.trim(), name: '' }))
      }
    },
    onError: (err: unknown) => setFormError(extractError(err)),
  })

  const createMutation = useMutation({
    mutationFn: (payload: CustomerPayload) => customerService.create(payload),
    onSuccess: (customer) => navigate(`/customers/${customer.id}`),
    onError: (err: unknown) => setFormError(extractError(err)),
  })

  const handleSearch = () => {
    setFormError(null)
    if (phone.trim().length < 7) {
      setFormError('Please enter a valid mobile number.')
      return
    }
    searchMutation.mutate()
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!registerForm.name.trim()) {
      setFormError('Customer name is required.')
      return
    }
    createMutation.mutate({
      ...registerForm,
      phone: registerForm.phone || phone.trim(),
    })
  }

  const resetSearch = () => {
    setPhone('')
    setSearchedPhone(null)
    setFoundCustomer(null)
    setNotFound(false)
    setRegisterMode(false)
    setFormError(null)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Customers' }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Find Customer</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search by mobile number to continue with an existing customer or register a new one
          </p>
        </div>
        {hasPermission('customers.view') && (
          <Link to="/customers/directory" className={buttonVariants({ variant: 'outline' })}>
            <List className="mr-2 h-4 w-4" />
            All Customers
          </Link>
        )}
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-xl">
            <Phone className="h-5 w-5 text-primary" />
            Mobile Number Search
          </CardTitle>
          <CardDescription>Enter the customer&apos;s UAE mobile number to look them up</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CustomerSearchInput
            value={phone}
            onChange={setPhone}
            onSearch={handleSearch}
            isSearching={searchMutation.isPending}
            autoFocus
          />
          {formError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {formError}
            </div>
          )}
        </CardContent>
      </Card>

      {foundCustomer && (
        <Card className="border-emerald-500/30">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {foundCustomer.photo ? (
                  <img
                    src={foundCustomer.photo}
                    alt={foundCustomer.name}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UserRound className="h-8 w-8" />
                  </div>
                )}
                <div>
                  <CardTitle className="font-serif">{foundCustomer.name}</CardTitle>
                  <CardDescription className="mt-1 flex flex-wrap items-center gap-2">
                    <span>{foundCustomer.phone}</span>
                    <Badge>{foundCustomer.code}</Badge>
                    {foundCustomer.is_active ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="warning">Inactive</Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-muted-foreground">Total Visits</p>
                <p className="text-lg font-semibold">{foundCustomer.total_visits}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-muted-foreground">Last Visit</p>
                <p className="text-lg font-semibold">
                  {foundCustomer.last_visit_at ? formatDate(foundCustomer.last_visit_at) : '—'}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-muted-foreground">Branch</p>
                <p className="text-lg font-semibold">{foundCustomer.branch?.name ?? '—'}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => navigate(`/customers/${foundCustomer.id}`)}>
                Continue to Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={resetSearch}>
                Search Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {notFound && registerMode && hasPermission('customers.create') && (
        <Card className="border-amber-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-xl">
              <UserPlus className="h-5 w-5 text-amber-600" />
              Register New Customer
            </CardTitle>
            <CardDescription>
              No customer found for <strong>{searchedPhone}</strong>. Create a new profile to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form onSubmit={handleRegister}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Mobile Number"
                  value={registerForm.phone || searchedPhone || ''}
                  onChange={(e) => setRegisterForm((p) => ({ ...p, phone: e.target.value }))}
                  required
                />
                <Input
                  label="Full Name"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  autoFocus
                />
                <Input
                  label="Email"
                  type="email"
                  value={registerForm.email ?? ''}
                  onChange={(e) => setRegisterForm((p) => ({ ...p, email: e.target.value || null }))}
                />
                <Select
                  label="Gender"
                  options={GENDER_OPTIONS.map((g) => ({ value: g.value, label: g.label }))}
                  placeholder="Select gender"
                  value={registerForm.gender ?? ''}
                  onChange={(e) =>
                    setRegisterForm((p) => ({
                      ...p,
                      gender: (e.target.value || null) as CustomerPayload['gender'],
                    }))
                  }
                />
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button type="submit" loading={createMutation.isPending}>
                  Register &amp; Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" onClick={resetSearch}>
                  Cancel
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      )}

      {notFound && !hasPermission('customers.create') && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No customer found with this mobile number. Contact an administrator to register new customers.
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    return (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'An error occurred'
  }
  return 'An error occurred'
}
