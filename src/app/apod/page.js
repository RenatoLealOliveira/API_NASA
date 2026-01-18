"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ApodCard from '../components/ApodCard';
import Skeleton from '../components/Skeleton';
import Navbar from '../components/Navbar';

const API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';

export default function ApodPage() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [apodData, setApodData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initial theme check moved to Navbar

    useEffect(() => {
        fetchApod(date);
    }, [date]);

    const fetchApod = async (selectedDate) => {
        setLoading(true);
        setError(null);
        setApodData(null);

        const cacheKey = `apod_cache_${selectedDate}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
            setApodData(JSON.parse(cached));
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(
                `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${selectedDate}`
            );

            if (!res.ok) {
                // Feature: If 404/400 (Future Date), fallback to yesterday automatically
                if ((res.status === 404 || res.status === 400)) {
                    const today = new Date().toISOString().split('T')[0];
                    // Only fallback if we are trying to fetch "today" (or future) and it failed
                    // This prevents infinite loops if a past date is truly missing
                    if (selectedDate >= today) {
                        console.warn("Image not available yet, falling back to yesterday.");
                        const prevDate = new Date();
                        prevDate.setDate(prevDate.getDate() - 1);
                        setDate(prevDate.toISOString().split('T')[0]);
                        setLoading(false);
                        return;
                    }
                }
                throw new Error(`Erro na API: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            localStorage.setItem(cacheKey, JSON.stringify(data));
            setApodData(data);

        } catch (err) {
            setError(err.message || 'Falha ao buscar dados');
        } finally {
            // Only stop loading if we didn't trigger a retry (setDate)
            // Actually, setDate triggers re-render, so this finally block runs for the OLD render.
            // We set loading=false in the fallback block to be safe, but the re-render will set loading=true again via useEffect?
            // useEffect calls fetchApod which sets loading=true.
            // So we can leave it as is, or use a ref to track if verified.
            // Simple approach: Just setLoading(false) is fine because the next useEffect will set it true again.
            setLoading(false);
        }
    };

    const fetchRandom = async (type = 'any') => {
        setLoading(true);
        setError(null);
        setApodData(null);

        try {
            const count = type === 'any' ? 1 : 50;

            const res = await fetch(
                `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=${count}`
            );

            if (!res.ok) {
                throw new Error(`Erro na API: ${res.status} ${res.statusText}`);
            }

            const dataArray = await res.json();

            let data;
            if (type === 'any') {
                data = dataArray[0];
            } else {
                const filtered = dataArray.filter(item => item.media_type === type);

                if (filtered.length === 0) {
                    throw new Error(`Não encontrei nenhum ${type === 'video' ? 'vídeo' : 'imagem'} nas últimas tentativas. Tente de novo!`);
                }

                data = filtered[Math.floor(Math.random() * filtered.length)];
            }

            setDate(data.date);
            const cacheKey = `apod_cache_${data.date}`;
            localStorage.setItem(cacheKey, JSON.stringify(data));

            setApodData(data);

        } catch (err) {
            setError(err.message || 'Falha ao buscar aleatório');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="transition-colors duration-300 w-full">
            <Navbar title="APOD - Foto Astronômica do Dia" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                {/* Main Header */}
                <div className="max-w-4xl mx-auto mb-12 text-center">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl mb-4">
                        Foto Astronômica do Dia
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Descubra o cosmos, um dia de cada vez.
                    </p>

                    {/* Date Input & Random Controls */}
                    <div className="mt-8 flex flex-col items-center gap-4">
                        <div className="relative">
                            <input
                                type="date"
                                value={date}
                                max={new Date().toISOString().split('T')[0]}
                                min="1995-06-16"
                                onChange={(e) => setDate(e.target.value)}
                                className="block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 px-4 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>

                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            Imagens disponíveis a partir de 16 de Junho de 1995
                        </p>

                        <div className="flex gap-4 mt-2">
                            <button
                                onClick={() => fetchRandom('image')}
                                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 text-sm"
                            >
                                Imagem Aleatória
                            </button>

                            <button
                                onClick={() => fetchRandom('video')}
                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 text-sm"
                            >
                                Vídeo Aleatório
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="max-w-4xl mx-auto">
                    {loading && (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                            {/* Image Skeleton */}
                            <Skeleton className="w-full h-[500px]" />

                            {/* Content Skeleton */}
                            <div className="p-8 md:p-12 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-4 w-2/3">
                                        <Skeleton className="h-8 w-3/4" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                    <Skeleton className="h-10 w-32 rounded-full" />
                                </div>
                                <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-6 text-center border border-red-100 dark:border-red-900/50">
                            <h3 className="text-lg font-medium text-red-900 dark:text-red-200">
                                {error.includes('429') ? 'Limite de uso excedido' : 'Não foi possível carregar'}
                            </h3>
                            <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                                {error}
                            </p>
                        </div>
                    )}

                    {!loading && !error && apodData && (
                        <ApodCard data={apodData} />
                    )}
                </div>
            </div>
        </main>
    );
}
