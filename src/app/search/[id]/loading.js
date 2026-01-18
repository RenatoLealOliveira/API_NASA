
import Skeleton from '../../components/Skeleton';

export default function Loading() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pb-12">
            {/* Header Skeleton */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm h-16 flex items-center px-4 sm:px-6 lg:px-8">
                <Skeleton className="h-6 w-32" />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Media Stage Skeleton */}
                <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm mb-8 border border-slate-200 dark:border-slate-800 aspect-video w-full relative">
                    <Skeleton className="absolute inset-0 w-full h-full" />
                </div>

                {/* Details Skeleton */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <Skeleton className="h-10 w-3/4" />
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>

                    {/* Sidebar Metadata Skeleton */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
                            <Skeleton className="h-4 w-24 mb-4" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
