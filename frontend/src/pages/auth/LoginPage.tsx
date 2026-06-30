import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Form, FormField } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/brand/Logo'
import { loginSchema, type LoginFormData } from '@/validators/auth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'owner@luxebeauty.ae', password: 'password' },
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    try {
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed. Please try again.'
      setError(message)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="polishe-hero-bg relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative">
          <Logo inverted />
        </div>

        <div className="relative">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-[#E8C9A0]">
            Luxury Salon Management
          </p>
          <h2 className="font-serif text-4xl font-semibold leading-tight">
            Elevate Your Beauty
            <br />
            Business in Dubai
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/85">
            Complete ERP for salons — appointments, clients, services, and payments in one
            elegant workspace. Built for Dubai with AED & 5% VAT support.
          </p>
        </div>

        <p className="relative text-sm text-white/55">
          © 2026 Luxe Beauty Lounge Dubai · Beauty Salon ERP
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-background px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to website
          </Link>
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-6 flex justify-center lg:hidden">
              <Logo />
            </div>
            <h2 className="font-serif text-3xl font-semibold text-foreground">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">Sign in to your salon dashboard</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Email Address" error={errors.email?.message} required>
              <Input
                type="email"
                placeholder="you@salon.ae"
                {...register('email')}
                error={errors.email?.message}
              />
            </FormField>

            <FormField label="Password" error={errors.password?.message} required>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  error={errors.password?.message}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>

            <Button type="submit" className="w-full shadow-md" size="lg" loading={isSubmitting}>
              Sign In
            </Button>
          </Form>

          <div className="mt-6 rounded-xl border border-border bg-card p-4 polishe-card-glow">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
              Demo Credentials
            </p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Owner:</span> owner@luxebeauty.ae
              </p>
              <p>
                <span className="font-medium text-foreground">Password:</span> password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
