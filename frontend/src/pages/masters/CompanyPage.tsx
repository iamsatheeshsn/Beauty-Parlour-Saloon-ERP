import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Breadcrumb, Button, Form, Input, PageLoader, Select, Textarea } from '@/components'
import {
  cityService,
  companyService,
  countryService,
  emirateService,
  type Company,
  type MasterRecord,
} from '@/services/masterService'
import { useCompanyMasterAccess } from '@/hooks/useMasterAccess'

export default function CompanyPage() {
  const queryClient = useQueryClient()
  const { canView, canManage } = useCompanyMasterAccess()

  const { data: company, isLoading } = useQuery({
    queryKey: ['company'],
    queryFn: companyService.get,
    enabled: canView,
  })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<Partial<Company>>()

  const countryId = watch('country_id')
  const emirateId = watch('emirate_id')

  const [countriesQuery, emiratesQuery, citiesQuery] = useQueries({
    queries: [
      { queryKey: ['countries-options'], queryFn: () => countryService.list({ all: true }), enabled: canView },
      {
        queryKey: ['emirates-options', countryId],
        queryFn: () => emirateService.list({ all: true, country_id: countryId }),
        enabled: canView && Boolean(countryId),
      },
      {
        queryKey: ['cities-options', emirateId],
        queryFn: () => cityService.list({ all: true, emirate_id: emirateId }),
        enabled: canView && Boolean(emirateId),
      },
    ],
  })

  useEffect(() => {
    if (company) {
      reset(company)
    }
  }, [company, reset])

  const updateMutation = useMutation({
    mutationFn: companyService.update,
    onSuccess: (updated) => {
      queryClient.setQueryData(['company'], updated)
    },
  })

  if (!canView) {
    return <Navigate to="/masters" replace />
  }

  if (isLoading || !company) {
    return <PageLoader />
  }

  const toList = (data: unknown): MasterRecord[] => (Array.isArray(data) ? data : [])

  const countries = toList(countriesQuery.data)
  const emirates = toList(emiratesQuery.data)
  const cities = toList(citiesQuery.data)

  const onSubmit = (values: Partial<Company>) => {
    if (!canManage) return
    updateMutation.mutate({
      ...values,
      country_id: values.country_id ? Number(values.country_id) : undefined,
      emirate_id: values.emirate_id ? Number(values.emirate_id) : undefined,
      city_id: values.city_id ? Number(values.city_id) : undefined,
    })
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Masters', href: '/masters' }, { label: 'Company' }]} />

      <div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">Company Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your salon company details</p>
      </div>

      {!canManage && (
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
          You have view-only access to company profile.
        </div>
      )}

      {updateMutation.isSuccess && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Company updated successfully.
        </div>
      )}

      {updateMutation.isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          Failed to update company. Please try again.
        </div>
      )}

      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <fieldset disabled={!canManage} className="contents">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Company Code" {...register('code')} disabled />
            <Input label="Company Name" {...register('name', { required: true })} />
            <Input label="Trade Name" {...register('trade_name')} />
            <Input label="TRN Number" {...register('trn_number')} />
            <Input label="Email" type="email" {...register('email')} />
            <Input label="Phone" {...register('phone')} />
            <Input label="Website" {...register('website')} className="sm:col-span-2" />
            <div className="sm:col-span-2">
              <Textarea label="Address" {...register('address')} />
            </div>
            <Select
              label="Country"
              options={countries.map((c) => ({ value: c.id, label: String(c.name) }))}
              placeholder="Select country"
              {...register('country_id')}
              onChange={(e) => {
                setValue('country_id', Number(e.target.value))
                setValue('emirate_id', undefined)
                setValue('city_id', undefined)
              }}
            />
            <Select
              label="Emirate"
              options={emirates.map((e) => ({ value: e.id, label: String(e.name) }))}
              placeholder="Select emirate"
              {...register('emirate_id')}
              onChange={(e) => {
                setValue('emirate_id', Number(e.target.value))
                setValue('city_id', undefined)
              }}
            />
            <Select
              label="City"
              options={cities.map((c) => ({ value: c.id, label: String(c.name) }))}
              placeholder="Select city"
              {...register('city_id')}
            />
            <Input label="Postal Code" {...register('postal_code')} />
            <Input label="Timezone" {...register('timezone')} />
            <Input label="Currency" {...register('currency')} />
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" loading={isSubmitting || updateMutation.isPending} disabled={!canManage}>
              Save Changes
            </Button>
          </div>
        </fieldset>
      </Form>
    </div>
  )
}
