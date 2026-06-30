import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: ReactNode
  className?: string
  footer?: ReactNode
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  footer,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 flex max-h-[min(90dvh,calc(100dvh-2rem))] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-card shadow-2xl',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            className
          )}
        >
          {(title || description) && (
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 py-4">
              <div className="min-w-0">
                {title && (
                  <Dialog.Title className="truncate text-lg font-semibold text-foreground">{title}</Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close className="shrink-0 rounded-lg p-1 hover:bg-muted">
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>
          )}
          {!title && !description && (
            <Dialog.Close className="absolute right-4 top-4 z-10 rounded-lg p-1 hover:bg-muted">
              <X className="h-5 w-5" />
            </Dialog.Close>
          )}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">{children}</div>
          {footer && (
            <div className="flex shrink-0 justify-end gap-2 border-t border-border px-6 py-4">{footer}</div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
