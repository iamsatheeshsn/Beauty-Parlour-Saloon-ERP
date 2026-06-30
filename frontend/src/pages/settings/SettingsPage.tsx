import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Globe, ImageIcon, LayoutTemplate, Palette, RefreshCw, Save, Settings2, Users } from 'lucide-react'
import {
  Breadcrumb,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Input,
  PageLoader,
  Select,
  Textarea,
} from '@/components'
import { Logo } from '@/components/brand/Logo'
import { useAppSettings } from '@/contexts/SettingsContext'
import { usePermission } from '@/hooks/usePermission'
import { BrandingUpload } from '@/pages/settings/BrandingUpload'
import type { AppSettings } from '@/services/appSettingsService'
import { settingService } from '@/services/masterService'
import { staffService } from '@/services/staffService'
import { settingsService, type SettingRecord } from '@/services/settingsService'
import { extractApiError } from '@/utils/apiError'
import { applyThemeFromSettings } from '@/utils/applyTheme'
import { storageUrl } from '@/utils/storageUrl'
import type { PageBannerKey } from '@/utils/website'

const IMAGE_SETTING_KEYS = new Set([
  'app_logo',
  'app_favicon',
  'salon_interior_image',
  'banner_home',
  'banner_about',
  'banner_services',
  'banner_shop',
  'banner_blog',
  'banner_team',
  'banner_contact',
])

const JSON_SETTING_KEYS = new Set(['homepage_team_ids'])

const PAGE_BANNERS: { key: PageBannerKey; title: string; description: string }[] = [
  { key: 'banner_home', title: 'Home', description: 'Homepage hero carousel background.' },
  { key: 'banner_about', title: 'About', description: 'About page header banner.' },
  { key: 'banner_services', title: 'Services', description: 'Services page header banner.' },
  { key: 'banner_shop', title: 'Shop', description: 'Shop page header banner.' },
  { key: 'banner_blog', title: 'Blog', description: 'Blog page header banner.' },
  { key: 'banner_team', title: 'Team', description: 'Team page header banner.' },
  { key: 'banner_contact', title: 'Contact', description: 'Contact page header banner.' },
]

const SETTING_GROUPS: { id: string; label: string; description?: string; keys: string[] }[] = [
  {
    id: 'general',
    label: 'General',
    description: 'Application identity shown across the ERP.',
    keys: ['app_name'],
  },
  {
    id: 'regional',
    label: 'Regional',
    description: 'Defaults for dates, currency, and locale.',
    keys: ['timezone', 'currency', 'currency_symbol'],
  },
  {
    id: 'tax',
    label: 'Tax & VAT',
    description: 'Optional defaults; per-item VAT rates take precedence at checkout.',
    keys: ['vat_rate', 'vat_enabled'],
  },
  {
    id: 'appearance',
    label: 'Appearance',
    description: 'Brand colors applied to the interface.',
    keys: ['primary_color', 'secondary_color'],
  },
  {
    id: 'website',
    label: 'Public Website',
    description: 'Contact page and homepage content for the marketing site.',
    keys: ['public_website_name', 'public_phone', 'public_whatsapp', 'public_email', 'public_address', 'business_hours', 'map_url'],
  },
]

const FIELD_LABELS: Record<string, string> = {
  app_name: 'Application Name',
  timezone: 'Timezone',
  currency: 'Currency Code',
  currency_symbol: 'Currency Symbol',
  vat_rate: 'Default VAT Rate (%)',
  vat_enabled: 'Enable VAT flag (legacy)',
  primary_color: 'Primary Color',
  secondary_color: 'Secondary Color',
  business_hours: 'Business Hours',
  public_website_name: 'Public Website Name',
  public_phone: 'Public Phone',
  public_whatsapp: 'WhatsApp Number (footer)',
  public_email: 'Public Email',
  public_address: 'Public Address',
  map_url: 'Google Maps Link',
}

const TEXTAREA_KEYS = new Set(['public_address', 'map_url'])

function parseHomepageTeamIds(value: unknown): number[] {
  if (Array.isArray(value)) {
    return value.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0).slice(0, 4)
  }
  if (typeof value === 'string' && value.trim() !== '') {
    try {
      const parsed = JSON.parse(value) as unknown
      return parseHomepageTeamIds(parsed)
    } catch {
      return []
    }
  }
  return []
}

function teamIdsToSlots(ids: number[]): string[] {
  return [0, 1, 2, 3].map((index) => (ids[index] ? String(ids[index]) : ''))
}

function toFormValue(setting: SettingRecord): string {
  const raw = setting.casted_value ?? setting.value ?? ''
  if (setting.type === 'boolean') return raw === true || raw === '1' || raw === 'true' ? '1' : '0'
  return String(raw)
}

function toPayloadValue(type: string | undefined, formValue: string): string {
  if (type === 'boolean') return formValue === '1' || formValue === 'true' ? '1' : '0'
  return formValue
}

async function refreshBrandingQueries(queryClient: ReturnType<typeof useQueryClient>, refreshSettings: () => Promise<void>) {
  await queryClient.invalidateQueries({ queryKey: ['system-settings'] })
  await queryClient.invalidateQueries({ queryKey: ['app-settings'] })
  await refreshSettings()
}

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const { refreshSettings } = useAppSettings()
  const { hasPermission } = usePermission()
  const canManage = hasPermission('settings.manage')

  const [form, setForm] = useState<Record<string, string>>({})
  const [homepageTeamSlots, setHomepageTeamSlots] = useState<string[]>(['', '', '', ''])
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['system-settings'],
    queryFn: () => settingService.list({ all: true }),
  })

  const settings = useMemo(() => {
    const list = Array.isArray(data) ? data : (data as { data?: SettingRecord[] })?.data ?? []
    return list as SettingRecord[]
  }, [data])

  const byKey = useMemo(() => {
    const map = new Map<string, SettingRecord>()
    settings.forEach((s) => map.set(s.key, s))
    return map
  }, [settings])

  const logoSetting = byKey.get('app_logo')
  const faviconSetting = byKey.get('app_favicon')
  const interiorSetting = byKey.get('salon_interior_image')
  const homepageTeamSetting = byKey.get('homepage_team_ids')
  const logoPreviewUrl = logoSetting?.value_url ?? storageUrl(logoSetting?.value)
  const faviconPreviewUrl = faviconSetting?.value_url ?? storageUrl(faviconSetting?.value)
  const interiorPreviewUrl = interiorSetting?.value_url ?? storageUrl(interiorSetting?.value)

  const bannerPreviewUrls = useMemo(() => {
    const urls: Partial<Record<PageBannerKey, string | null>> = {}
    PAGE_BANNERS.forEach(({ key }) => {
      const setting = byKey.get(key)
      urls[key] = setting?.value_url ?? storageUrl(setting?.value) ?? null
    })
    return urls
  }, [byKey])

  const { data: staffListData } = useQuery({
    queryKey: ['staff-for-homepage-picker'],
    queryFn: () => staffService.list({ per_page: 100 }),
  })

  const homepageStaffOptions = useMemo(() => {
    const rows = staffListData?.data ?? []
    return rows
      .filter((member) => !['owner', 'admin'].includes(member.role ?? ''))
      .map((member) => ({ value: String(member.id), label: member.name }))
  }, [staffListData])

  useEffect(() => {
    if (!homepageTeamSetting) return
    const ids = parseHomepageTeamIds(
      homepageTeamSetting.casted_value ?? homepageTeamSetting.value,
    )
    setHomepageTeamSlots(teamIdsToSlots(ids))
  }, [homepageTeamSetting])

  useEffect(() => {
    if (settings.length === 0) return
    const next: Record<string, string> = {}
    settings.forEach((s) => {
      if (IMAGE_SETTING_KEYS.has(s.key) || JSON_SETTING_KEYS.has(s.key)) return
      next[s.key] = toFormValue(s)
    })
    setForm(next)
  }, [settings])

  const saveMutation = useMutation({
    mutationFn: async (updates: { id: number; key: string; value: string; type?: string }[]) => {
      await Promise.all(
        updates.map(({ id, value, type }) =>
          settingService.update(id, { value: toPayloadValue(type, value) })
        )
      )
    },
    onSuccess: async () => {
      await refreshBrandingQueries(queryClient, refreshSettings)
      await queryClient.invalidateQueries({ queryKey: ['public-settings'] })
      await queryClient.invalidateQueries({ queryKey: ['public-team-featured'] })
      setSaveSuccess(true)
      setSaveError(null)
      setTimeout(() => setSaveSuccess(false), 3000)
    },
    onError: (err) => {
      setSaveError(extractApiError(err, 'Failed to save settings. Please try again.'))
      setSaveSuccess(false)
    },
  })

  const logoUploadMutation = useMutation({
    mutationFn: settingsService.uploadLogo,
    onSuccess: async () => {
      await refreshBrandingQueries(queryClient, refreshSettings)
      setSaveSuccess(true)
      setSaveError(null)
      setTimeout(() => setSaveSuccess(false), 3000)
    },
    onError: (err) => setSaveError(extractApiError(err, 'Failed to upload logo. Please try again.')),
  })

  const logoDeleteMutation = useMutation({
    mutationFn: settingsService.deleteLogo,
    onSuccess: () => refreshBrandingQueries(queryClient, refreshSettings),
    onError: (err) => setSaveError(extractApiError(err, 'Failed to remove logo. Please try again.')),
  })

  const faviconUploadMutation = useMutation({
    mutationFn: settingsService.uploadFavicon,
    onSuccess: async () => {
      await refreshBrandingQueries(queryClient, refreshSettings)
      setSaveSuccess(true)
      setSaveError(null)
      setTimeout(() => setSaveSuccess(false), 3000)
    },
    onError: (err) => setSaveError(extractApiError(err, 'Failed to upload favicon. Please try again.')),
  })

  const faviconDeleteMutation = useMutation({
    mutationFn: settingsService.deleteFavicon,
    onSuccess: () => refreshBrandingQueries(queryClient, refreshSettings),
    onError: (err) => setSaveError(extractApiError(err, 'Failed to remove favicon. Please try again.')),
  })

  const interiorUploadMutation = useMutation({
    mutationFn: settingsService.uploadSalonInteriorImage,
    onSuccess: async () => {
      await refreshBrandingQueries(queryClient, refreshSettings)
      await queryClient.invalidateQueries({ queryKey: ['public-settings'] })
      setSaveSuccess(true)
      setSaveError(null)
      setTimeout(() => setSaveSuccess(false), 3000)
    },
    onError: (err) => setSaveError(extractApiError(err, 'Failed to upload salon image. Please try again.')),
  })

  const interiorDeleteMutation = useMutation({
    mutationFn: settingsService.deleteSalonInteriorImage,
    onSuccess: async () => {
      await refreshBrandingQueries(queryClient, refreshSettings)
      await queryClient.invalidateQueries({ queryKey: ['public-settings'] })
    },
    onError: (err) => setSaveError(extractApiError(err, 'Failed to remove salon image. Please try again.')),
  })

  const bannerUploadMutation = useMutation({
    mutationFn: ({ key, file }: { key: PageBannerKey; file: File }) =>
      settingsService.uploadPageBanner(key, file),
    onSuccess: async () => {
      await refreshBrandingQueries(queryClient, refreshSettings)
      await queryClient.invalidateQueries({ queryKey: ['public-settings'] })
      setSaveSuccess(true)
      setSaveError(null)
      setTimeout(() => setSaveSuccess(false), 3000)
    },
    onError: (err) => setSaveError(extractApiError(err, 'Failed to upload page banner. Please try again.')),
  })

  const bannerDeleteMutation = useMutation({
    mutationFn: (key: PageBannerKey) => settingsService.deletePageBanner(key),
    onSuccess: async () => {
      await refreshBrandingQueries(queryClient, refreshSettings)
      await queryClient.invalidateQueries({ queryKey: ['public-settings'] })
    },
    onError: (err) => setSaveError(extractApiError(err, 'Failed to remove page banner. Please try again.')),
  })

  const homepageTeamDirty = useMemo(() => {
    if (!homepageTeamSetting) return false
    const current = parseHomepageTeamIds(
      homepageTeamSetting.casted_value ?? homepageTeamSetting.value,
    )
    const next = homepageTeamSlots.filter(Boolean).map(Number)
    return JSON.stringify(current) !== JSON.stringify(next)
  }, [homepageTeamSetting, homepageTeamSlots])

  const dirtyUpdates = useMemo(() => {
    return settings
      .filter((s) => {
        if (IMAGE_SETTING_KEYS.has(s.key) || JSON_SETTING_KEYS.has(s.key)) return false
        const current = form[s.key]
        if (current === undefined) return false
        return toFormValue(s) !== current
      })
      .map((s) => ({
        id: s.id,
        key: s.key,
        value: form[s.key] ?? '',
        type: s.type,
      }))
  }, [settings, form])

  const previewTheme = () => {
    applyThemeFromSettings({
      primary_color: form.primary_color ?? '#7A2E3E',
      secondary_color: form.secondary_color ?? '#C9A46C',
      app_favicon: faviconPreviewUrl,
    } as AppSettings)
  }

  const hasUnsavedChanges = dirtyUpdates.length > 0 || homepageTeamDirty

  const handleSave = () => {
    if (!canManage) return

    const updates = [...dirtyUpdates]

    if (homepageTeamDirty && homepageTeamSetting) {
      const ids = homepageTeamSlots.filter(Boolean).map(Number).slice(0, 4)
      updates.push({
        id: homepageTeamSetting.id,
        key: 'homepage_team_ids',
        value: JSON.stringify(ids),
        type: 'json',
      })
    }

    if (updates.length === 0) return
    saveMutation.mutate(updates)
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'System' }, { label: 'Settings' }]} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">Settings</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Configure branding, regional defaults, tax options, and appearance.
          </p>
        </div>
        {canManage && (
          <div className="flex shrink-0 flex-wrap gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={previewTheme}
              disabled={!form.primary_color && !form.secondary_color}
            >
              <RefreshCw />
              Preview colors
            </Button>
            <Button
              size="sm"
              loading={saveMutation.isPending}
              disabled={!hasUnsavedChanges}
              onClick={handleSave}
            >
              <Save />
              Save changes
            </Button>
          </div>
        )}
      </div>

      {!canManage && (
        <div className="rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground">
          You have read-only access. Contact an administrator to change settings.
        </div>
      )}

      {saveSuccess && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
          Settings saved successfully.
        </div>
      )}
      {saveError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {saveError}
        </div>
      )}

      {settings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No settings found. Run the database seeder:{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">php artisan db:seed --class=SettingsSeeder</code>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                <div>
                  <h2 className="text-base font-semibold">Logo & Favicon</h2>
                  <p className="text-xs text-muted-foreground">
                    Shown in the ERP sidebar, login screen, and public website header.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <BrandingUpload
                title="Application Logo"
                description="Upload a horizontal logo with transparent or white background."
                previewUrl={logoPreviewUrl}
                fallback={<Logo variant="icon" iconClassName="h-12 w-12" />}
                previewClassName="h-24 w-44 rounded-lg"
                previewFit="contain"
                canManage={canManage}
                isUploading={logoUploadMutation.isPending}
                isDeleting={logoDeleteMutation.isPending}
                onUpload={(file) => logoUploadMutation.mutate(file)}
                onDelete={() => logoDeleteMutation.mutate()}
              />
              <BrandingUpload
                title="Favicon"
                description="Square icon shown in the browser tab."
                previewUrl={faviconPreviewUrl}
                fallback={<Globe className="h-9 w-9 text-muted-foreground" />}
                previewClassName="h-20 w-20 rounded-lg"
                previewFit="contain"
                canManage={canManage}
                isUploading={faviconUploadMutation.isPending}
                isDeleting={faviconDeleteMutation.isPending}
                onUpload={(file) => faviconUploadMutation.mutate(file)}
                onDelete={() => faviconDeleteMutation.mutate()}
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                <div>
                  <h2 className="text-base font-semibold">Website Images</h2>
                  <p className="text-xs text-muted-foreground">
                    Interior and homepage imagery for the public marketing site.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <BrandingUpload
                title="Salon Interior Image"
                description="Displayed in the homepage about section."
                previewUrl={interiorPreviewUrl}
                fallback={<ImageIcon className="h-10 w-10 text-muted-foreground" />}
                previewClassName="h-36 w-full max-w-md rounded-lg"
                previewFit="cover"
                variant="banner"
                canManage={canManage}
                isUploading={interiorUploadMutation.isPending}
                isDeleting={interiorDeleteMutation.isPending}
                onUpload={(file) => interiorUploadMutation.mutate(file)}
                onDelete={() => interiorDeleteMutation.mutate()}
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="h-4 w-4 text-primary" />
                <div>
                  <h2 className="text-base font-semibold">Page Banners</h2>
                  <p className="text-xs text-muted-foreground">
                    Header banner images for each page on the public website.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {PAGE_BANNERS.map((banner) => (
                <BrandingUpload
                  key={banner.key}
                  title={`${banner.title} Page`}
                  description={banner.description}
                  previewUrl={bannerPreviewUrls[banner.key] ?? null}
                  fallback={<ImageIcon className="h-8 w-8 text-muted-foreground" />}
                  previewClassName="h-28 w-full rounded-lg"
                  previewFit="cover"
                  variant="banner"
                  canManage={canManage}
                  isUploading={bannerUploadMutation.isPending && bannerUploadMutation.variables?.key === banner.key}
                  isDeleting={bannerDeleteMutation.isPending && bannerDeleteMutation.variables === banner.key}
                  onUpload={(file) => bannerUploadMutation.mutate({ key: banner.key, file })}
                  onDelete={() => bannerDeleteMutation.mutate(banner.key)}
                />
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <div>
                  <h2 className="text-base font-semibold">Homepage Team</h2>
                  <p className="text-xs text-muted-foreground">
                    Choose up to 4 team members for the Meet the Artists section on the homepage.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((slot) => (
                <Select
                  key={slot}
                  label={`Team member ${slot + 1}`}
                  value={homepageTeamSlots[slot] ?? ''}
                  disabled={!canManage}
                  placeholder="— Not shown —"
                  options={homepageStaffOptions}
                  onChange={(e) => {
                    const value = e.target.value
                    setHomepageTeamSlots((prev) => {
                      const next = [...prev]
                      next[slot] = value
                      return next
                    })
                  }}
                />
              ))}
            </CardContent>
          </Card>

          {SETTING_GROUPS.map((group) => {
            const groupSettings = group.keys
              .map((key) => byKey.get(key))
              .filter((s): s is SettingRecord => Boolean(s))

            if (groupSettings.length === 0) return null

            return (
              <Card key={group.id} className={group.id === 'website' ? 'lg:col-span-2' : undefined}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    {group.id === 'appearance' ? (
                      <Palette className="h-4 w-4 text-primary" />
                    ) : (
                      <Settings2 className="h-4 w-4 text-primary" />
                    )}
                    <div>
                      <h2 className="text-base font-semibold">{group.label}</h2>
                      {group.description && (
                        <p className="text-xs text-muted-foreground">{group.description}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {groupSettings.map((setting) => {
                    const label = FIELD_LABELS[setting.key] ?? setting.key
                    const value = form[setting.key] ?? ''

                    if (setting.type === 'boolean') {
                      return (
                        <div key={setting.key} className="space-y-1">
                          <Checkbox
                            label={label}
                            checked={value === '1' || value === 'true'}
                            disabled={!canManage}
                            onChange={(e) =>
                              setForm((prev) => ({ ...prev, [setting.key]: e.target.checked ? '1' : '0' }))
                            }
                          />
                          {setting.description && (
                            <p className="pl-6 text-xs text-muted-foreground">{setting.description}</p>
                          )}
                        </div>
                      )
                    }

                    if (setting.key.includes('color')) {
                      return (
                        <div key={setting.key} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                          <Input
                            label={label}
                            type="color"
                            value={value || '#7A2E3E'}
                            disabled={!canManage}
                            onChange={(e) =>
                              setForm((prev) => ({ ...prev, [setting.key]: e.target.value }))
                            }
                            className="h-10 w-full cursor-pointer p-1 sm:w-14"
                          />
                          <Input
                            value={value}
                            disabled={!canManage}
                            onChange={(e) =>
                              setForm((prev) => ({ ...prev, [setting.key]: e.target.value }))
                            }
                            className="flex-1 font-mono text-xs"
                          />
                        </div>
                      )
                    }

                    if (TEXTAREA_KEYS.has(setting.key)) {
                      return (
                        <div key={setting.key} className="space-y-1">
                          <Textarea
                            label={label}
                            value={value}
                            disabled={!canManage}
                            rows={setting.key === 'map_url' ? 3 : 2}
                            placeholder={
                              setting.key === 'map_url'
                                ? 'https://www.google.com/maps/place/...'
                                : undefined
                            }
                            onChange={(e) =>
                              setForm((prev) => ({ ...prev, [setting.key]: e.target.value }))
                            }
                          />
                          {setting.description && (
                            <p className="text-xs text-muted-foreground">{setting.description}</p>
                          )}
                        </div>
                      )
                    }

                    return (
                      <div key={setting.key} className="space-y-1">
                        <Input
                          label={label}
                          type={setting.type === 'integer' ? 'number' : 'text'}
                          value={value}
                          disabled={!canManage}
                          min={setting.type === 'integer' ? 0 : undefined}
                          max={setting.type === 'integer' ? 100 : undefined}
                          step={setting.type === 'integer' ? 1 : undefined}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, [setting.key]: e.target.value }))
                          }
                        />
                        {setting.description && !['app_name'].includes(setting.key) && (
                          <p className="text-xs text-muted-foreground">{setting.description}</p>
                        )}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {canManage && hasUnsavedChanges && (
        <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {dirtyUpdates.length + (homepageTeamDirty ? 1 : 0)}
            </span>{' '}
            unsaved change
            {dirtyUpdates.length + (homepageTeamDirty ? 1 : 0) > 1 ? 's' : ''}
          </p>
          <Button size="sm" loading={saveMutation.isPending} onClick={handleSave}>
            <Save />
            Save changes
          </Button>
        </div>
      )}
    </div>
  )
}
