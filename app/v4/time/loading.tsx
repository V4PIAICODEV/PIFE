import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TimeLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-9 w-20" />
          </div>

          <Skeleton className="h-10 w-80 mb-6" />

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
