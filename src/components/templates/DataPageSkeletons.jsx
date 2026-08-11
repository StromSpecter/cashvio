import { Card, CardHeader, CardContent } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

function PageHeaderSkeleton({ buttons = [['h-9', 'w-24']] }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {buttons.map(([h, w], i) => (
          <Skeleton key={i} className={`${h} ${w} rounded-md`} />
        ))}
      </div>
    </div>
  )
}

function SearchBarSkeleton() {
  return (
    <div className="relative max-w-sm">
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  )
}

function TableFooterSkeleton() {
  return (
    <div className="mt-4 flex flex-col gap-3 px-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <Skeleton className="h-4 w-36" />
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="size-8 rounded-md" />
        ))}
      </div>
    </div>
  )
}

function TableHeadSkeleton() {
  return (
    <div className="flex items-center gap-8 border-b border-border px-4 py-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-3.5 w-20 first:flex-1 first:max-w-[140px]" />
      ))}
      <Skeleton className="ml-auto hidden h-3.5 w-16 lg:block" />
    </div>
  )
}

function DataTableSkeleton({ rows = 8, children }) {
  return (
    <div className="w-full">
      <TableHeadSkeleton />
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-border/50 px-4 py-3.5"
        >
          {children}
        </div>
      ))}
      <TableFooterSkeleton />
    </div>
  )
}

function BaseRowSkeleton({ leading, cells = [['flex-1', 'max-w-[120px]']], badges = 0, trailing = true }) {
  return (
    <>
      {leading}
      {cells.map(([cls, w], i) => (
        <Skeleton key={i} className={`h-3.5 ${cls} ${w || ''}`} />
      ))}
      {Array.from({ length: badges }).map((_, i) => (
        <Skeleton key={`b${i}`} className="h-5 w-14 shrink-0 rounded-full" />
      ))}
      {trailing && <Skeleton className="ml-auto size-8 shrink-0 rounded-md" />}
    </>
  )
}

function AvatarLeadSkeleton() {
  return <Skeleton className="size-9 shrink-0 rounded-full" />
}

function IconLeadSkeleton() {
  return <Skeleton className="size-7 shrink-0 rounded-md" />
}

function SummaryCardSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-44" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-44" />
      </CardContent>
    </Card>
  )
}

export function TransactionsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading transactions">
      <PageHeaderSkeleton buttons={[['h-9', 'w-24'], ['h-9', 'w-40']]} />

      <div className="flex flex-col gap-4 sm:flex-row flex-wrap sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-md" />
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Skeleton className="h-9 w-full rounded-md sm:w-56" />
          <Skeleton className="h-9 w-40 rounded-md" />
          <Skeleton className="h-9 w-40 rounded-md" />
        </div>
      </div>

      <DataTableSkeleton rows={10}>
        <BaseRowSkeleton
          leading={<AvatarLeadSkeleton />}
          cells={[
            ['flex-1', 'max-w-[150px]'],
            ['hidden md:block', 'w-24'],
            ['hidden lg:block', 'w-28'],
            ['w-20', ''],
            ['w-16', ''],
          ]}
          badges={1}
        />
      </DataTableSkeleton>
    </div>
  )
}

export function TransfersSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading transfers">
      <PageHeaderSkeleton buttons={[['h-9', 'w-36']]} />
      <SearchBarSkeleton />

      <DataTableSkeleton rows={10}>
        <BaseRowSkeleton
          leading={<IconLeadSkeleton />}
          cells={[
            ['flex-1', 'max-w-[120px]'],
            ['w-16', ''],
            ['w-16', ''],
            ['hidden md:block', 'w-24'],
            ['w-20', ''],
            ['w-16', ''],
          ]}
        />
      </DataTableSkeleton>
    </div>
  )
}

export function CashSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading cash">
      <PageHeaderSkeleton buttons={[['h-9', 'w-40']]} />

      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-56" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-lg" />
            <Skeleton className="h-9 w-40" />
          </div>
        </CardContent>
      </Card>

      <SearchBarSkeleton />

      <DataTableSkeleton rows={10}>
        <BaseRowSkeleton
          leading={<IconLeadSkeleton />}
          cells={[
            ['flex-1', 'max-w-[120px]'],
            ['w-16', ''],
            ['w-16', ''],
            ['hidden md:block', 'w-24'],
            ['w-20', ''],
          ]}
        />
      </DataTableSkeleton>
    </div>
  )
}

function WalletCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between">
          <Skeleton className="size-9 rounded-lg" />
          <Skeleton className="size-7 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-28" />
        </div>
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-7 w-28" />
      </CardContent>
    </Card>
  )
}

function CardPaginationSkeleton() {
  return (
    <div className="mt-4 flex items-center justify-between">
      <Skeleton className="h-4 w-36" />
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="size-8 rounded-md" />
        ))}
      </div>
    </div>
  )
}

export function WalletsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading wallets">
      <PageHeaderSkeleton
        buttons={[
          ['h-8', 'w-8'],
          ['h-8', 'w-8'],
          ['h-9', 'w-32'],
        ]}
      />

      <SummaryCardSkeleton />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <WalletCardSkeleton key={i} />
        ))}
      </div>

      <CardPaginationSkeleton />
    </div>
  )
}

function BankCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="relative aspect-[8/5] w-full overflow-hidden rounded-xl bg-muted/60 p-5">
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-10" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="mt-5 space-y-1.5">
            <Skeleton className="h-2.5 w-24" />
            <Skeleton className="h-3.5 w-32" />
          </div>
          <div className="mt-5 space-y-1.5">
            <Skeleton className="h-2.5 w-12" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CardsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading cards">
      <PageHeaderSkeleton
        buttons={[
          ['h-8', 'w-8'],
          ['h-8', 'w-8'],
          ['h-9', 'w-36'],
        ]}
      />

      <SummaryCardSkeleton />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <BankCardSkeleton key={i} />
        ))}
      </div>

      <CardPaginationSkeleton />
    </div>
  )
}