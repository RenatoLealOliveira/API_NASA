"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Skeleton from './Skeleton';

const ROVERS = ['curiosity', 'opportunity', 'spirit', 'perseverance'];

const ROVER_INFO = {
    curiosity: { status: 'active', maxSol: '4000+', label: 'Ativo' },
    opportunity: { status: 'complete', maxSol: '5111', label: 'Finalizado' },
    spirit: { status: 'complete', maxSol: '2208', label: 'Finalizado' },
    perseverance: { status: 'active', maxSol: '1000+', label: 'Ativo' },
};

export default function MarsExplorer() {
    const [rover, setRover] = useState('curiosity');
    const [sol, setSol] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);

    // Observer for infinite scroll
    const observer = useRef();

    const lastPhotoElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Reset photos when filter changes
    useEffect(() => {
        setPhotos([]);
        setPage(1);
        setHasMore(true);
        setError(null);
    }, [rover, searchQuery, sol]);

    // Fetch Photos from NASA Image Library
    useEffect(() => {
        const fetchPhotos = async () => {
            setLoading(true);
            setError(null);
            try {
                // Construct query: Rover name + optional user search query + optional Sol
                const solQuery = sol ? `Sol ${sol}` : '';
                const q = `${rover} rover ${searchQuery} ${solQuery}`.trim();
                const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=image&page=${page}`;
                console.log("Fetching Mars Data (Library):", url);

                const res = await fetch(url);

                if (!res.ok) {
                    throw new Error(`Erro na API da NASA: ${res.status}`);
                }

                const data = await res.json();
                const items = data.collection?.items || [];

                if (items.length === 0) {
                    setHasMore(false);
                } else {
                    // Adapt NASA Image Library format to our app's format
                    const mappedPhotos = items.map(item => {
                        const data = item.data[0] || {};
                        const link = item.links?.find(l => l.rel === 'preview') || item.links?.[0];

                        return {
                            id: data.nasa_id,
                            img_src: link?.href,
                            earth_date: data.date_created?.split('T')[0],
                            sol: sol || 'N/A', // If we searched by Sol, we know the Sol. Otherwise N/A.
                            camera: data.title || 'Unknown' // Use title as description
                        };
                    }).filter(p => p.img_src); // Ensure valid image link

                    setPhotos(prev => [...prev, ...mappedPhotos]);
                }

            } catch (err) {
                console.error("Fetch error:", err);
                setError('Falha ao buscar imagens. Tente outro termo.');
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchPhotos();
        }, 800);

        return () => clearTimeout(timeoutId);

    }, [rover, searchQuery, sol, page]);

    return (
        <div className="min-h-screen pb-12">

            {/* Control Panel */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 mb-12 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="text-red-500">🚀</span> Explorador de Missões
                    </h2>
                    <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-full">
                        Fonte: NASA Image Library
                    </span>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Rover Select */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Rover / Missão</label>
                        <select
                            value={rover}
                            onChange={(e) => setRover(e.target.value)}
                            className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 capitalize cursor-pointer outline-none transition-all"
                        >
                            {ROVERS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>

                    {/* Sol Input (Optional) */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Dia (Sol)</label>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500 dark:text-slate-300">
                                {ROVER_INFO[rover]?.label}: {ROVER_INFO[rover]?.maxSol}
                            </span>
                        </div>
                        <input
                            type="number"
                            min="0"
                            value={sol}
                            onChange={(e) => setSol(e.target.value)}
                            placeholder={`Max: ~${ROVER_INFO[rover]?.maxSol}`}
                            className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>

                    {/* Search Input */}
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Filtro Extra</label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Ex: Drill, Sunset..."
                            className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-center flex items-center justify-center gap-2 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {/* Monitor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
                {photos.map((photo, index) => {
                    const isLast = photos.length === index + 1;

                    return (
                        <Link
                            href={`/search/${photo.id}`}
                            key={photo.id + index}
                        >
                            <div
                                ref={isLast ? lastPhotoElementRef : null}
                                className="group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 cursor-pointer"
                            >
                                <div className="aspect-square w-full relative overflow-hidden bg-slate-200 dark:bg-slate-700">
                                    <img
                                        src={photo.img_src}
                                        alt={photo.camera}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-white text-xs font-medium line-clamp-2">{photo.camera}</p>
                                        <p className="text-red-300 text-[10px] mt-1">Clique para ver detalhes</p>
                                    </div>
                                </div>

                                <div className="p-4 flex justify-between items-center bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                                    <div className="flex gap-2">
                                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded uppercase tracking-wider">
                                            {rover}
                                        </span>
                                        {sol && sol !== 'N/A' && (
                                            <span className="text-xs font-semibold text-white bg-red-500 px-2 py-1 rounded uppercase tracking-wider">
                                                SOL {sol}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400" title="Data na Terra">
                                        📅 {photo.earth_date}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}

                {/* Skeletons (Loading State) */}
                {loading && [...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                        <Skeleton className="aspect-square w-full" />
                        <div className="p-4 flex justify-between items-center bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Loading / Status State */}
            {/* Status (Empty State) */}
            <div className="text-center py-12">
                {!loading && photos.length === 0 && !error && (
                    <div className="text-slate-500 dark:text-slate-400">
                        <p className="text-lg font-medium">Nenhuma imagem encontrada.</p>
                        <p className="text-sm">Tente mudar o Rover ou o termo de busca.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
