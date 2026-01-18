import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { text, target = 'pt' } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Using Google's public API (free tier, no key required for simple use)
        // client=gtx is the convention for this endpoint
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Translation service unavailable');
        }

        const data = await response.json();

        // The structure returned by this specific endpoint is an array of arrays.
        // data[0][0][0] usually contains the first translated sentence-chunk.
        // We map over data[0] to join all parts (paragrahs/sentences).
        const translatedText = data[0].map(item => item[0]).join('');

        return NextResponse.json({ translatedText });

    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
    }
}
