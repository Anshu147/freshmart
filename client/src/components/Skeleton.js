export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      {/* Image placeholder */}
      <div className="aspect-square skeleton" />
      {/* Text placeholders */}
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-5 w-1/3 rounded" />
        <div className="skeleton h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Text Side */}
          <div className="space-y-5">
            <div className="skeleton h-6 w-48 rounded-full" />
            <div className="space-y-3">
              <div className="skeleton h-12 w-full rounded" />
              <div className="skeleton h-12 w-3/4 rounded" />
            </div>
            <div className="skeleton h-5 w-full max-w-md rounded" />
            <div className="skeleton h-5 w-5/6 max-w-md rounded" />
            <div className="flex gap-4 mt-6">
              <div className="skeleton h-12 w-36 rounded-lg" />
              <div className="skeleton h-12 w-36 rounded-lg" />
            </div>
            <div className="flex gap-8 mt-8">
              <div className="skeleton h-10 w-20 rounded" />
              <div className="skeleton h-10 w-20 rounded" />
              <div className="skeleton h-10 w-20 rounded" />
            </div>
          </div>
          {/* Image Side */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="skeleton w-80 h-80 xl:w-96 xl:h-96 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonRow({ count = 6 }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[260px] sm:w-[280px]">
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}

export default function Skeleton({ variant = 'card' }) {
  switch (variant) {
    case 'card':
      return <SkeletonCard />;
    case 'banner':
      return <SkeletonBanner />;
    case 'row':
      return <SkeletonRow />;
    default:
      return <SkeletonCard />;
  }
}
