"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Dark Mode Initialization (Simpler handling for dashboard)
    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDarkMode(true);
        }
    };

    return (
        <main className="py-6 md:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 flex flex-col items-center w-full">

            {/* Header with Theme Toggle */}
            <div className="w-full max-w-5xl flex justify-end mb-4 md:mb-8 relative">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                    {isDarkMode ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Hero Section */}
            <div className="text-center mb-16 max-w-2xl">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                    Ferramentas NASA
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                    Explore o universo através das lentes e dados da NASA. Escolha uma das ferramentas abaixo para começar.
                </p>
            </div>

            {/* Modules Grid */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-8 max-w-5xl w-full">

                {/* APOD Module */}
                <Link href="/apod" className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5 md:p-8 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-4 md:p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 md:h-24 md:w-24 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3">Foto do Dia (APOD)</h2>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-4 md:mb-6">
                        Descubra a imagem astronômica selecionada diariamente pela NASA, com explicações traduzidas em tempo real.
                    </p>
                    <span className="inline-flex items-center text-sm md:text-base text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                        Explorar agora &rarr;
                    </span>
                </Link>

                {/* Search Module */}
                <Link href="/search" className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5 md:p-8 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-4 md:p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 md:h-24 md:w-24 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3">Biblioteca de Pesquisa</h2>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-4 md:mb-6">
                        Pesquise em milhões de fotos, vídeos e áudios históricos dos arquivos da NASA.
                    </p>
                    <span className="inline-flex items-center text-sm md:text-base text-purple-600 dark:text-purple-400 font-semibold group-hover:translate-x-1 transition-transform">
                        Pesquisar agora &rarr;
                    </span>
                </Link>

                {/* Mars Explorer Module */}
                <Link href="/mars" className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5 md:p-8 hover:border-red-500 dark:hover:border-red-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-4 md:p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 md:h-24 md:w-24 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3">
                        Explorador de Marte
                    </h2>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-4 md:mb-6">
                        Acesse as imagens brutas dos Rovers Curiosity, Opportunity e Spirit.
                    </p>
                    <span className="inline-flex items-center text-sm md:text-base text-red-600 dark:text-red-400 font-semibold group-hover:translate-x-1 transition-transform">
                        Ver imagens &rarr;
                    </span>
                </Link>

                {/* Exoplanet Archive Module (Coming Soon) */}
                <div className="group relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 md:p-8 opacity-75 cursor-not-allowed">
                    <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Em Breve
                    </div>
                    <div className="absolute top-0 right-0 p-4 md:p-6 opacity-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 md:h-24 md:w-24 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold text-slate-500 dark:text-slate-400 mb-2 md:mb-3">
                        Arquivo de Exoplanetas
                    </h2>
                    <p className="text-sm md:text-base text-slate-400 dark:text-slate-500 mb-4 md:mb-6">
                        Explore mundos além do nosso sistema solar. Dados confirmados sobre planetas alienígenas.
                    </p>
                    <span className="inline-flex items-center text-slate-400 font-semibold cursor-not-allowed">
                        Aguarde novidades...
                    </span>
                </div>

            </div>

            {/* Footer removed (Global in Layout) */}
        </main>
    );
}
