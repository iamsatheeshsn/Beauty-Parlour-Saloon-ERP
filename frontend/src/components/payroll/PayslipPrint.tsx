import { useRef } from 'react'
import { Printer } from 'lucide-react'
import { Button } from '@/components'
import type { Payslip } from '@/services/payrollService'
import { formatCurrency, formatDate } from '@/utils/format'

interface PayslipPrintProps {
  payslip: Payslip
  companyName?: string
  onClose?: () => void
}

export function PayslipPrint({ payslip, companyName = 'Beauty Salon', onClose }: PayslipPrintProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const currency = payslip.currency ?? 'AED'

  const handlePrint = () => {
    const content = printRef.current
    if (!content) return
    const win = window.open('', '_blank', 'width=500,height=700')
    if (!win) return
    win.document.write(`
      <!DOCTYPE html><html><head><title>Payslip ${payslip.code}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; max-width: 480px; margin: 0 auto; padding: 24px; color: #111; }
        h1 { font-size: 18px; text-align: center; margin: 0 0 4px; }
        h2 { font-size: 14px; text-align: center; margin: 0 0 16px; font-weight: normal; color: #555; }
        .center { text-align: center; }
        .muted { color: #666; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; margin: 12px 0; }
        td { padding: 6px 0; vertical-align: top; }
        .right { text-align: right; }
        .deduction { color: #b91c1c; }
        .total { font-weight: bold; border-top: 2px solid #333; padding-top: 8px; font-size: 14px; }
        hr { border: none; border-top: 1px solid #ddd; margin: 12px 0; }
      </style></head><body>${content.innerHTML}</body></html>`)
    win.document.close()
    win.focus()
    win.print()
    win.close()
  }

  const earnings = payslip.items?.filter((i) => !i.is_deduction) ?? []
  const deductions = payslip.items?.filter((i) => i.is_deduction) ?? []

  return (
    <div>
      <div ref={printRef} className="rounded-lg border border-border bg-white p-6 text-sm text-black">
        <h1 className="text-center text-lg font-bold">{companyName}</h1>
        <h2 className="text-center text-muted-foreground">PAYSLIP</h2>
        <p className="center muted">{payslip.code}</p>
        <p className="center muted">
          {formatDate(payslip.period_start)} — {formatDate(payslip.period_end)}
        </p>
        <hr />
        <p><strong>Employee:</strong> {payslip.user?.name}</p>
        {payslip.user?.employee_code && <p className="muted">ID: {payslip.user.employee_code}</p>}
        {payslip.branch?.name && <p className="muted">Branch: {payslip.branch.name}</p>}
        <hr />
        <p className="font-semibold">Earnings</p>
        <table>
          <tbody>
            {earnings.length > 0 ? earnings.map((item) => (
              <tr key={item.id ?? item.description}>
                <td>{item.description}</td>
                <td className="right">{formatCurrency(item.amount, currency)}</td>
              </tr>
            )) : (
              <>
                <tr><td>Base salary</td><td className="right">{formatCurrency(payslip.base_salary, currency)}</td></tr>
                {payslip.housing_allowance > 0 && <tr><td>Housing allowance</td><td className="right">{formatCurrency(payslip.housing_allowance, currency)}</td></tr>}
                {payslip.transport_allowance > 0 && <tr><td>Transport allowance</td><td className="right">{formatCurrency(payslip.transport_allowance, currency)}</td></tr>}
                {payslip.commission_amount > 0 && <tr><td>Commission</td><td className="right">{formatCurrency(payslip.commission_amount, currency)}</td></tr>}
              </>
            )}
          </tbody>
        </table>
        {(deductions.length > 0 || payslip.leave_deduction > 0 || payslip.other_deductions > 0) && (
          <>
            <p className="font-semibold">Deductions</p>
            <table>
              <tbody>
                {deductions.map((item) => (
                  <tr key={item.id ?? item.description}>
                    <td>{item.description}</td>
                    <td className="right deduction">-{formatCurrency(item.amount, currency)}</td>
                  </tr>
                ))}
                {payslip.other_deductions > 0 && (
                  <tr><td>Other deductions</td><td className="right deduction">-{formatCurrency(payslip.other_deductions, currency)}</td></tr>
                )}
              </tbody>
            </table>
          </>
        )}
        <table>
          <tbody>
            <tr className="total">
              <td>Net Pay</td>
              <td className="right">{formatCurrency(payslip.net_pay, currency)}</td>
            </tr>
          </tbody>
        </table>
        <p className="center muted mt-4">Status: {payslip.status.toUpperCase()}</p>
        {payslip.paid_at && <p className="center muted">Paid: {formatDate(payslip.paid_at)}</p>}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        {onClose && <Button variant="outline" onClick={onClose}>Close</Button>}
        <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print Payslip</Button>
      </div>
    </div>
  )
}
