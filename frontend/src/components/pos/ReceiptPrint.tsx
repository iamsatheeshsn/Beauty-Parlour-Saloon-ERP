import { useRef } from 'react'
import { Printer } from 'lucide-react'
import { Button } from '@/components'
import type { ReceiptData } from '@/services/saleService'
import { formatCurrency, formatDate } from '@/utils/format'

interface ReceiptPrintProps {
  data: ReceiptData
  onClose?: () => void
}

export function ReceiptPrint({ data, onClose }: ReceiptPrintProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const { sale, company, settings } = data
  const currency = settings?.currency ?? sale.currency ?? 'AED'

  const handlePrint = () => {
    const content = printRef.current
    if (!content) return
    const win = window.open('', '_blank', 'width=400,height=600')
    if (!win) return
    win.document.write(`
      <!DOCTYPE html><html><head><title>Receipt ${sale.code}</title>
      <style>
        body { font-family: monospace, sans-serif; font-size: 12px; max-width: 320px; margin: 0 auto; padding: 16px; }
        h1 { font-size: 16px; text-align: center; margin: 0 0 4px; }
        .center { text-align: center; }
        .muted { color: #666; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; margin: 12px 0; }
        td { padding: 4px 0; vertical-align: top; }
        .right { text-align: right; }
        .total { font-weight: bold; border-top: 1px dashed #999; padding-top: 8px; }
        hr { border: none; border-top: 1px dashed #ccc; margin: 8px 0; }
      </style></head><body>${content.innerHTML}</body></html>`)
    win.document.close()
    win.focus()
    win.print()
    win.close()
  }

  return (
    <div>
      <div ref={printRef} className="rounded-lg border border-border bg-white p-4 text-sm text-black">
        <h1 className="text-center text-lg font-bold">{company?.trade_name ?? company?.name ?? 'Beauty Salon'}</h1>
        {company?.address && <p className="center muted">{company.address}</p>}
        {company?.phone && <p className="center muted">{company.phone}</p>}
        {company?.trn_number && (sale.vat_amount ?? 0) > 0 && (
          <p className="center muted">TRN: {company.trn_number}</p>
        )}
        <hr />
        <p className="center font-semibold">TAX INVOICE</p>
        <p className="center muted">{sale.code}</p>
        <p className="center muted">{sale.paid_at ? formatDate(sale.paid_at) : formatDate(new Date())}</p>
        <hr />
        <p><strong>Customer:</strong> {sale.customer?.name}</p>
        <p className="muted">{sale.customer?.phone}</p>
        <table>
          <tbody>
            {sale.items?.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.description}
                  {item.points_redeemed > 0 && (
                    <span className="muted"> ({item.points_redeemed} pts)</span>
                  )}
                  {item.staff?.name && <div className="muted">Stylist: {item.staff.name}</div>}
                </td>
                <td className="right">{formatCurrency(item.line_total, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table>
          <tbody>
            <tr><td>Subtotal</td><td className="right">{formatCurrency(sale.subtotal, currency)}</td></tr>
            {sale.discount_amount > 0 && (
              <tr><td>Discount</td><td className="right">-{formatCurrency(sale.discount_amount, currency)}</td></tr>
            )}
            {(sale.vat_amount ?? 0) > 0 && (
              <tr><td>VAT</td><td className="right">{formatCurrency(sale.vat_amount, currency)}</td></tr>
            )}
            <tr className="total">
              <td>Total</td>
              <td className="right">{formatCurrency(sale.total_amount, currency)}</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <p className="font-medium">Payment</p>
        {sale.payments?.map((p) => (
          <p key={p.id} className="flex justify-between">
            <span>{p.payment_method?.name ?? 'Payment'}</span>
            <span>{formatCurrency(p.amount, currency)}</span>
          </p>
        ))}
        {sale.points_redeemed > 0 && (
          <p className="muted">Points redeemed: {sale.points_redeemed}</p>
        )}
        <hr />
        <p className="center muted">Thank you for visiting!</p>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>Close</Button>
        )}
        <Button type="button" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Receipt
        </Button>
      </div>
    </div>
  )
}
