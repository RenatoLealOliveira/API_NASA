"use client";

import { useState, useEffect } from 'react';

export default function ApodCard({ data }) {
    const [translatedDescription, setTranslatedDescription] = useState(null);
    const [translatedTitle, setTranslatedTitle] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [translationError, setTranslationError] = useState(null);

    // Format date to pt-BR
    const formattedDate = new Date(data.date).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Auto-translate effect
    useEffect(() => {
        if (!data) return;

        // Reset translations on new data
        setTranslatedDescription(null);
        setTranslatedTitle(null);

        const autoTranslate = async () => {
            setIsTranslating(true);
            try {
                // Translate Title and Explanation in parallel
                const [descRes, titleRes] = await Promise.all([
                    fetch('/api/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: data.explanation }),
                    }),
                    fetch('/api/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: data.title }),
                    })
                ]);

                if (!descRes.ok || !titleRes.ok) throw new Error('Falha na tradução');

                const descResult = await descRes.json();
                const titleResult = await titleRes.json();

                setTranslatedDescription(descResult.translatedText);
                setTranslatedTitle(titleResult.translatedText);

            } catch (err) {
                console.error("Auto-translate failed:", err);
                setTranslationError(true);
            } finally {
                setIsTranslating(false);
            }
        };

        autoTranslate();
    }, [data]);

    if (!data) return null;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 max-w-4xl mx-auto my-8 border border-slate-100 dark:border-slate-700">

            {/* Media Display */}
            <div className="relative group w-full bg-slate-100 dark:bg-slate-900">
                {data.media_type === 'image' ? (
                    <img
                        src={data.url}
                        alt={data.title}
                        className="w-full h-auto object-cover max-h-[600px]"
                    />
                ) : (
                    <div className="aspect-video w-full">
                        <iframe
                            src={data.url}
                            className="w-full h-full"
                            allowFullScreen
                            title="Vídeo APOD"
                        />
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
                    <div>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full capitalize">
                            {formattedDate}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-2">
                            {translatedTitle || data.title}
                        </h2>
                    </div>

                    {data.hdurl && (
                        <a
                            href={data.hdurl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors shadow-sm"
                        >
                            Ver em HD
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    )}
                </div>

                {/* Description Area */}
                <div className="relative min-h-[100px]">
                    {isTranslating && !translatedDescription && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 z-10 flex items-start pt-2 justify-center backdrop-blur-[1px]">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium animate-pulse">
                                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                                Traduzindo explicação...
                            </div>
                        </div>
                    )}

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-6 transition-opacity duration-500">
                        {translatedDescription || data.explanation}
                    </p>
                </div>

                {translatedDescription && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic mb-2 border-t border-slate-100 dark:border-slate-700 pt-2">
                        * Tradução automática via Google Translate.
                    </p>
                )}

                {data.copyright && (
                    <div className="text-sm text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-700 pt-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        <span>Foto por {data.copyright}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
