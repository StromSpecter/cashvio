import { Card, CardHeader, CardContent } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="size-8 rounded-lg" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-28" />
        <Skeleton className="mt-3 h-3 w-32" />
      </CardContent>
    </Card>
  )
}

function InsightCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 pt-6">
        <Skeleton className="size-10 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-3 w-36" />
        </div>
      </CardContent>
    </Card>
  )
}

function ChartHeaderSkeleton() {
  return (
    <CardHeader className="flex flex-row items-start justify-between space-y-0">
      <div className="space-y-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-3 w-44" />
      </div>
      <Skeleton className="h-8 w-40 rounded-lg" />
    </CardHeader>
  )
}

function AccountCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-muted/60 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="mt-5 h-3 w-24" />
      <div className="mt-2 flex items-end justify-between">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="size-5" />
      </div>
    </div>
  )
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-border/50 px-4 py-3">
      <Skeleton className="size-9 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3.5 w-36 max-w-full" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="hidden h-4 w-16 sm:block" />
      <Skeleton className="hidden h-4 w-20 md:block" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="hidden size-8 rounded-md lg:block" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-40 rounded-md" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <InsightCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col lg:col-span-2">
          <ChartHeaderSkeleton />
          <CardContent className="flex flex-1 flex-col">
            <Skeleton className="h-56 w-full rounded-lg" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-36" />
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Skeleton className="size-40 rounded-full" />
            <div className="w-full space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/50 px-3 py-2"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <Skeleton className="size-2.5 shrink-0 rounded-full" />
                    <Skeleton className="h-3.5 w-24" />
                  </div>
                  <Skeleton className="h-3.5 w-14" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-lg" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-36" />
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Skeleton className="h-44 w-44 rounded-full" />
            <div className="w-full space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-16" />
                  <Skeleton className="h-3.5 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <AccountCardSkeleton key={i} />
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="size-9 rounded-md" />
        </CardHeader>
        <CardContent className="p-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}