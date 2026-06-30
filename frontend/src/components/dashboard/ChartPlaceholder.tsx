import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { BarChart3 } from 'lucide-react'

interface ChartPlaceholderProps {
  title: string
  description?: string
  height?: string
}

export function ChartPlaceholder({ title, description, height = 'h-64' }: ChartPlaceholderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div
          className={`flex ${height} flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30`}
        >
          <BarChart3 className="mb-3 h-12 w-12 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">Chart placeholder</p>
          <p className="mt-1 text-xs text-muted-foreground/70">Data visualization coming soon</p>
        </div>
      </CardContent>
    </Card>
  )
}
