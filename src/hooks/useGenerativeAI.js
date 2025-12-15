import { useState } from "react";

// SOLO SVILUPPO – in produzione va su backend
const GEMINI_API_KEY = "AIzaSyD9Ok1vdlK5ymTwPfoPkm08bXPAYqG4Jqs";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const useGenerativeAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePrediction = async (match) => {
    setLoading(true);
    setError(null);

    try {
      const prompt = `
Sei un analista professionista di calcio.

Partita:
${match.home} vs ${match.away}

DATI CASA:
- Punti: ${match.stats?.homePoints ?? "N/D"}
- Forma: ${match.stats?.homeForm ?? "N/D"}/100

DATI TRASFERTA:
- Punti: ${match.stats?.awayPoints ?? "N/D"}
- Forma: ${match.stats?.awayForm ?? "N/D"}/100

Rispondi ESCLUSIVAMENTE con JSON valido, senza testo extra:

{
  "summary": "Titolo breve",
  "tacticalAnalysis": {
    "home": "Analisi casa",
    "away": "Analisi trasferta"
  },
  "keyPoints": ["Punto 1", "Punto 2"],
  "aiPrediction": "1, X o 2",
  "confidence": 80,
  "reasoning": "Motivazione"
}
`;

      const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Errore Gemini API");
      }

      const data = await response.json();

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("Risposta AI vuota");
      }

      const cleanText = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(cleanText);
    } catch (err) {
      console.error("Errore Gemini AI:", err);
      setError(err.message);

      return {
        summary: "Errore tecnico",
        tacticalAnalysis: { home: "N/D", away: "N/D" },
        keyPoints: ["Controlla la console"],
        aiPrediction: "N/D",
        confidence: 0,
        reasoning: err.message,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    generatePrediction,
    loading,
    error,
  };
};
