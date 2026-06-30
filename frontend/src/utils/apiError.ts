type ApiErrorBody = {
  message?: string
  errors?: Record<string, string[]>
}

export function extractApiError(err: unknown, fallback = 'Something went wrong.'): string {
  if (!err || typeof err !== 'object' || !('response' in err)) {
    return fallback
  }

  const data = (err as { response?: { data?: ApiErrorBody } }).response?.data
  if (!data) return fallback

  if (data.errors) {
    const first = Object.values(data.errors).flat().find(Boolean)
    if (first) return first
  }

  return data.message ?? fallback
}
