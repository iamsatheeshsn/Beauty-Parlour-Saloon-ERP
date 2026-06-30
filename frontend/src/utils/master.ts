import type { PaginatedResponse } from '@/types'

export function isPaginated<T>(data: unknown): data is PaginatedResponse<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    'meta' in data &&
    Array.isArray((data as PaginatedResponse<T>).data)
  )
}
