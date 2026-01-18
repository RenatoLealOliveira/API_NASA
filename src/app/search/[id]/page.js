"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function AssetDetailsPage({ params }) {
    const { id } = params;
    const [asset, setAsset] = useState(null);
    const [mediaUrl, setMediaUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Translation state
    const [translatedTitle, setTranslatedTitle] = useState(null);
    const [translatedDesc, setTranslatedDesc] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchDetails = async () => {
            setLoading(true);
            try {
                // 1. Fetch Metadata
                const res = await fetch(`https://images-api.nasa.gov/search?nasa_id=${id}`);
                const data = await res.json();

                if (!data.collection || data.collection.items.length === 0) {
                    throw new Error('Asset not found');
                }

                const item = data.collection.items[0];
                setAsset(item);

                // 2. Fetch Media Assets (Collection) to find the actual image/video file
                // The 'href' in the item usually points to the collection json
                const collectionUrl = item.href;
                const mediaRes = await fetch(collectionUrl);
                const mediaData = await mediaRes.json();

                // Find the best quality that is viewable in browser (avoiding .tif if possible)
                // Filter for "orig" or "medium" or "large" jpg/mp4
                // A simple heuristic: find first that ends with .jpg or .mp4
                const bestMedia = mediaData.find(url => {
                    // Prefer original or large
                    return (url.endsWith('orig.jpg') || url.endsWith('medium.jpg') || url.endsWith('small.jpg') ||
                        url.endsWith('orig.mp4') || url.endsWith('medium.mp4'));
                }) || mediaData[0]; // Fallback to first

                setMediaUrl(bestMedia);

                // 3. Initiate Translation
                translateContent(item.data[0].title, item.data[0].description);

            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    const translateContent = async (title, description) => {
        if (!title && !description) return;

        setIsTranslating(true);
        try {
            const requests = [];
            if (description) {
                requests.push(
                    fetch('/api/translate', {
                        method: 'POST',
                        body: JSON.stringify({ text: description })
                    }).then(r => r.json())
                );
            } else {
                requests.push(Promise.resolve({ translatedText: null }));
            }

            if (title) {
                requests.push(
                    fetch('/api/translate', {
                        method: 'POST',
                        body: JSON.stringify({ text: title })
                    }).then(r => r.json())
                );
            } else {
                requests.push(Promise.resolve({ translatedText: null }));
            }

            const [descRes, titleRes] = await Promise.all(requests);

            if (descRes.translatedText) setTranslatedDesc(descRes.translatedText);
            if (titleRes.translatedText) setTranslatedTitle(titleRes.translatedText);

        } catch (err) {
            console.error("Translation failed", err);
        } finally {
            setIsTranslating(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !asset) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center text-slate-800 dark:text-white">
                <h1 className="text-2xl font-bold mb-4">Erro ao carregar detalhes</h1>
                <p>{error || 'Item não encontrado.'}</p>
                <Link href="/search" className="mt-4 text-blue-600 hover:underline">Voltar para busca</Link>
            </div>
        );
    }

    const data = asset.data[0];
    const isVideo = data.media_type === 'video';

    return (
        <main className="transition-colors duration-300 w-full pb-12">
            <Navbar title="Detalhes do Arquivo" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Media Stage */}
                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-8 border border-slate-800">
                    {isVideo ? (
                        <div className="aspect-video w-full">
                            <video
                                controls
                                src={mediaUrl}
                                poster={asset.links?.find(l => l.rel === 'preview')?.href}
                                className="w-full h-full"
                            >
                                Seu navegador não suporta a tag de vídeo.
                            </video>
                        </div>
                    ) : (
                        <div className="relative w-full min-h-[400px] flex items-center justify-center bg-slate-900">
                            <img
                                src={mediaUrl}
                                alt={data.title}
                                className="max-w-full max-h-[80vh] object-contain"
                            />
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                {translatedTitle || data.title}
                            </h1>
                            {isTranslating && !translatedTitle && (
                                <span className="flex items-center text-xs font-semibold text-blue-600 animate-pulse bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                                    Traduzindo...
                                </span>
                            )}
                        </div>

                        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                            <p>
                                {translatedDesc || data.description}
                            </p>
                        </div>

                        {translatedDesc && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-4 border-t border-slate-200 dark:border-slate-800 pt-2">
                                * Título e descrição traduzidos automaticamente.
                            </p>
                        )}
                    </div>

                    {/* Sidebar Metadata */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
                                Informações
                            </h3>

                            <dl className="space-y-4 text-sm">
                                <div>
                                    <dt className="text-slate-500 dark:text-slate-400 mb-1">Data de Criação</dt>
                                    <dd className="font-semibold text-slate-800 dark:text-white">
                                        {new Date(data.date_created).toLocaleDateString('pt-BR', { dateStyle: 'long' })}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500 dark:text-slate-400 mb-1">NASA ID</dt>
                                    <dd className="font-mono text-xs bg-slate-100 dark:bg-slate-900 p-1 rounded inline-block text-slate-600 dark:text-slate-300">
                                        {data.nasa_id}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500 dark:text-slate-400 mb-1">Centro</dt>
                                    <dd className="font-semibold text-slate-800 dark:text-white">
                                        {data.center}
                                    </dd>
                                </div>
                                {data.photographer && (
                                    <div>
                                        <dt className="text-slate-500 dark:text-slate-400 mb-1">Fotógrafo / Crédito</dt>
                                        <dd className="font-semibold text-slate-800 dark:text-white">
                                            {data.photographer}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
                                Palavras-chave
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {data.keywords?.map(keyword => (
                                    <span key={keyword} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-full">
                                        {keyword}
                                    </span>
                                ))}
                                {!data.keywords && <span className="text-slate-400 italic text-xs">Sem palavras-chave</span>}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
