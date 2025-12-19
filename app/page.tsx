"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateImage = async () => {
    if (!prompt) return alert("Escreva algo primeiro!");

    setIsLoading(true);
    setImageUrl(""); // Limpa a imagem anterior ao começar

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.imageUrl) {
        // Double check: limpeza extra no front-end para URLs malformadas
        const urlFinal = data.imageUrl.includes('http')
          ? data.imageUrl.substring(data.imageUrl.indexOf('http'))
          : data.imageUrl;

        setImageUrl(urlFinal);
      } else {
        alert("O servidor não retornou uma imagem válida.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ display: 'flex', width: '100%' }}>
      <div className="left" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '100vh', padding: '40px' }}>
        <h1 style={{ fontSize: '44px', width: '400px', fontWeight: '600' }}>Crie uma imagem a partir do que você escrever</h1>
      </div>
      <div className="right" style={{ padding: '20px' }}>
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg,rgb(0, 24, 44),rgb(0, 23, 41))', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', border: '2px solid black' }}>
          <h1 style={{ fontSize: '20px', textAlign: 'center' }}>Escreva seu texto, para que a imagem seja gerada a partir dele.</h1>
          <textarea
            style={{
              padding: '15px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#fff',
              minHeight: '100px',
              border: '1px solid #444',
              outline: 'none'
            }}
            placeholder="Ex: Um astronauta andando a cavalo em Marte..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={handleGenerateImage}
            disabled={isLoading}
            style={{
              marginTop: '20px',
              padding: '15px',
              borderRadius: '10px',
              backgroundColor: isLoading ? '#444' : '#0070f3',
              color: 'white',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: '0.3s'
            }}
          >
            {isLoading ? "Processando IA..." : "Gerar Imagem"}
          </button>

          <div style={{ marginTop: '30px', width: '100%', textAlign: 'center' }}>
            <h2 style={{ fontSize: '14px', marginBottom: '10px', color: '#aaa' }}>Resultado:</h2>
            <div style={{
              width: '100%',
              aspectRatio: '1/1',
              border: '1px dashed #555',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundColor: 'rgba(0,0,0,0.3)'
            }}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Imagem Gerada"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onLoad={() => console.log("Imagem carregada com sucesso!")}
                  onError={() => alert("O link da imagem expirou ou é inválido.")}
                />
              ) : (
                <p style={{ color: '#666', fontSize: '14px' }}>
                  {isLoading ? "A IA está desenhando..." : "Sua arte aparecerá aqui"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}