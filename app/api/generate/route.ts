import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { prompt } = body;

        // URL de Produção do seu n8n
        const N8N_URL = 'https://bi3lzzgoat.app.n8n.cloud/webhook/agent';

        const n8nResponse = await fetch(N8N_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });

        if (!n8nResponse.ok) {
            return NextResponse.json({ error: 'Falha no n8n' }, { status: 500 });
        }

        const data = await n8nResponse.json();

        // Lógica de Limpeza: Garante que a URL comece estritamente em "http"
        if (data.imageUrl && typeof data.imageUrl === 'string') {
            const startIndex = data.imageUrl.indexOf('http');
            if (startIndex !== -1) {
                data.imageUrl = data.imageUrl.substring(startIndex);
            }
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("ERRO BACKEND:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}