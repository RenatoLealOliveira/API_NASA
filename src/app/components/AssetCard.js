"use client";

import Link from 'next/link';

export default function AssetCard({ item }) {
    const data = item.data[0];
    const thumbnail = item.links?.find(link => link.rel === 'preview')?.href;

    if (!data || !thumbnail) return null;

    const date = new Date(data.date_created).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <Link href={`/search/${data.nasa_id}`} className="block group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 hover:-translate-y-1">
            {/* Thumbnail */}
            <div className="aspect-video md:aspect-square w-full overflow-hidden bg-slate-200 dark:bg-slate-700 relative">
                <img
                    src={thumbnail}
                    alt={data.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs font-bold text-white uppercase tracking-wider">
                    {data.media_type}
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-2 leading-tight mb-2 min-h-[2.5em]" title={data.title}>
                    {data.title}
                </h3>
                <time className="text-xs text-slate-500 dark:text-slate-400 block mb-2">
                    {date}
                </time>

                {/* Overlay for "View details" could go here, or just making the whole card clickable for a modal later */}
            </div>
        </Link>
    );
}
