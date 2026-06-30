import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Breadcrumb, DataTable, PageLoader, Pagination } from '@/components'
import { activityLogService, type ActivityLogItem } from '@/services/adminService'
import { formatDate } from '@/utils/format'
import { isPaginated } from '@/utils/master'

export default function ActivityLogsPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['activity-logs', page],
    queryFn: () => activityLogService.list({ page, per_page: 20 }),
  })

  const listData = useMemo(() => {
    if (!data) return { rows: [] as ActivityLogItem[], meta: null }
    if (isPaginated<ActivityLogItem>(data)) return { rows: data.data, meta: data.meta }
    return { rows: data as ActivityLogItem[], meta: null }
  }, [data])

  const filteredRows = listData.rows

  const columns: ColumnDef<ActivityLogItem, unknown>[] = [
    {
      accessorKey: 'created_at',
      header: 'When',
      cell: ({ getValue }) => formatDate(String(getValue())),
    },
    { accessorKey: 'action_label', header: 'Action' },
    { accessorKey: 'description', header: 'Description' },
    {
      id: 'user',
      header: 'User',
      cell: ({ row }) => row.original.user?.name ?? '—',
    },
  ]

  if (isLoading && !data) return <PageLoader />

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Activity Logs' }]} />
      <div>
        <h1 className="font-serif text-3xl font-semibold">Activity Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">Audit trail of system actions</p>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load activity logs.
        </div>
      ) : (
        <>
          <DataTable columns={columns} data={filteredRows} />
          {listData.meta && listData.meta.last_page > 1 && (
            <Pagination
              currentPage={listData.meta.current_page}
              totalPages={listData.meta.last_page}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}
