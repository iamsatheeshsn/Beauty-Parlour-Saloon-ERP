import { useRef, type ReactNode } from 'react'
import { Camera, Trash2 } from 'lucide-react'
import { Button } from '@/components'
import { cn } from '@/utils/cn'

interface BrandingUploadProps {
  title: string
  description: string
  previewUrl: string | null
  fallback: ReactNode
  accept?: string
  canManage: boolean
  isUploading: boolean
  isDeleting: boolean
  onUpload: (file: File) => void
  onDelete: () => void
  previewClassName?: string
  previewFit?: 'contain' | 'cover'
  variant?: 'brand' | 'banner'
}

export function BrandingUpload({
  title,
  description,
  previewUrl,
  fallback,
  accept = 'image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml,image/x-icon,.ico',
  canManage,
  isUploading,
  isDeleting,
  onUpload,
  onDelete,
  previewClassName,
  previewFit = 'contain',
  variant = 'brand',
}: BrandingUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const frameClassName =
    previewClassName ??
    (variant === 'banner'
      ? 'h-32 w-full max-w-sm rounded-lg'
      : 'h-20 w-20 rounded-lg')

  const statusLabel = previewUrl
    ? `${title} is active.`
    : `No custom ${title.toLowerCase()} uploaded.`

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-muted/20 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-1 flex-col items-start gap-3">
        <div className={cn('relative shrink-0', variant === 'banner' && 'w-full max-w-md')}>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={title}
              className={cn(
                'border border-border bg-white shadow-sm',
                previewFit === 'contain' ? 'object-contain' : 'object-cover',
                frameClassName,
              )}
            />
          ) : (
            <div
              className={cn(
                'flex items-center justify-center border border-dashed border-border bg-muted/40',
                frameClassName,
              )}
            >
              {fallback}
            </div>
          )}

          {canManage && (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition hover:bg-primary/90 disabled:opacity-50"
                title={`Upload ${title.toLowerCase()}`}
              >
                <Camera className="h-4 w-4 shrink-0" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) onUpload(file)
                  e.target.value = ''
                }}
              />
            </>
          )}
        </div>

        <div className="w-full space-y-2">
          <p className="text-sm leading-snug text-muted-foreground">{statusLabel}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            PNG, JPG, WEBP, SVG, or ICO · Max 5 MB
          </p>
          {canManage && previewUrl && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              loading={isDeleting}
              onClick={onDelete}
            >
              <Trash2 />
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
