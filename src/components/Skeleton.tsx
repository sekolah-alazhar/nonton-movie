export function SkeletonMovieCard() {
  return (
    <article className="movie-card">
      <div className="aspect-[2/3] skeleton rounded-t-xl" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 skeleton rounded" />
        <div className="h-4 w-1/2 skeleton rounded" />
        <div className="flex gap-1.5">
          <div className="h-5 w-16 skeleton rounded-full" />
          <div className="h-5 w-16 skeleton rounded-full" />
        </div>
      </div>
    </article>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonMovieCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative aspect-[16/9] rounded-2xl skeleton overflow-hidden" />
  );
}

export function SkeletonDetail() {
  return (
    <div className="grid lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <div className="aspect-[2/3] skeleton rounded-2xl" />
      </div>
      <div className="lg:col-span-3 space-y-6">
        <div className="h-10 w-3/4 skeleton rounded" />
        <div className="h-6 w-1/2 skeleton rounded" />
        <div className="h-6 w-1/3 skeleton rounded" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-12 skeleton rounded-xl" />
          <div className="h-12 skeleton rounded-xl" />
          <div className="h-12 skeleton rounded-xl" />
        </div>
        <div className="h-8 w-1/4 skeleton rounded" />
        <div className="space-y-3">
          <div className="h-4 skeleton rounded w-3/4" />
          <div className="h-4 skeleton rounded w-full" />
          <div className="h-4 skeleton rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonVideoPlayer() {
  return (
    <div className="video-container">
      <div className="absolute inset-0 skeleton" />
    </div>
  );
}

export function SkeletonCast({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="aspect-square skeleton rounded-xl" />
          <div className="h-4 w-3/4 skeleton rounded" />
          <div className="h-3 w-1/2 skeleton rounded text-dark-500" />
        </div>
      ))}
    </div>
  );
}