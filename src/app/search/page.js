"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from '../components/SearchBar';
import AssetCard from '../components/AssetCard';
import Navbar from '../components/Navbar';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Initial "Random" Fetch
    useEffect(() => {
        handleSearch('Galaxy');
    }, []);

    const handleSearch = async (term) => {
        if (!term) return;
        setQuery(term);
        setLoading(true);
        setSearched(true);
        setResults([]);

        try {
            const res = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(term)}&media_type=image,video`);
            const data = await res.json();

            if (data.collection && data.collection.items) {
                setResults(data.collection.items);
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="transition-colors duration-300 w-full pb-12">
            <Navbar title="NASA Image Library" />

            {/* Search Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Explore o Universo
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                        Pesquise em milhões de imagens e vídeos históricos da NASA.
                    </p>

                    <SearchBar onSearch={handleSearch} isLoading={loading} />

                    {/* Suggestion Tags */}
                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                        {['Nebula', 'Galaxy', 'Mars', 'Moon', 'James Webb', 'Earth', 'Sun', 'Black Hole'].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => handleSearch(tag)}
                                className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-sm"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Grid */}
                <div>
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {searched && results.length === 0 && (
                                <div className="text-center py-20 text-slate-500 dark:text-slate-400">
                                    <p className="text-xl">Nenhum resultado encontrado para "{query}" 🔭</p>
                                    <p className="text-sm mt-2">Tente termos em inglês (ex: 'Moon' ao invés de 'Lua') para mais resultados.</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {results.map((item) => (
                                    <AssetCard key={item.data[0].nasa_id} item={item} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
