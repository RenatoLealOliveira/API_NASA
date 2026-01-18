"use client";

import Link from 'next/link';
import MarsExplorer from '../components/MarsExplorer';
import Navbar from '../components/Navbar';

export default function MarsPage() {
    return (
        <main className="transition-colors duration-300 w-full pb-12">
            <Navbar title="Explorador de Marte" />

            <div className="py-12 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Arquivos dos Rovers
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                        Acesse o banco de dados de imagens cruas enviadas diretamente de Marte.
                    </p>
                </div>

                <MarsExplorer />
            </div>
        </main>
    );
}
