import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-6 w-64" />
        </div>
      </div>

      <div className="p-6">
        <Card>
          <div className="border-b">
            <div className="flex gap-1 p-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-32" />
              ))}
            </div>
          </div>

          <CardContent className="p-6">
            <div className="space-y-8">
              <div>
                <Skeleton className="h-6 w-48 mb-6" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center">
                    <Skeleton className="w-32 h-32 rounded-full mb-4" />
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
