export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-80"></div>
            <div className="flex gap-3">
              <div className="h-10 bg-gray-200 rounded w-48"></div>
              <div className="h-10 bg-gray-200 rounded w-48"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-64"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
