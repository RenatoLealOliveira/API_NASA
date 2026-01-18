import './globals.css'
import Footer from './components/Footer'

export const metadata = {
    title: 'NASA Tools',
    description: 'Explore the universe with NASA APIs',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="font-sans min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col">
                <div className="flex-grow">
                    {children}
                </div>
                <Footer />
            </body>
        </html>
    )
}
