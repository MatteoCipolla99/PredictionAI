import { useState } from "react";

// Endpoint backend via Proxy
const BACKEND_ENDPOINT = "/api/gemini/analyze";

export const useGenerativeAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePrediction = async (match, h2hData = null) => {
    setLoading(true);
    setError(null);

    try {
      if (!match || !match.home || !match.away)
        throw new Error("Dati partita non validi");

      const prompt = buildPrompt(match, h2hData);

      // Tenta chiamata al backend
      const response = await fetch(BACKEND_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Backend non disponibile, fallback locale");
      }

      const data = await response.json();

      // Gestione risposta backend strutturata
      const aiResult = typeof data === "string" ? JSON.parse(data) : data;

      // Se il backend risponde direttamente con il JSON di analisi (candidates[0].content...)
      // Bisognerebbe parsare come nel frontend-only version, ma assumiamo che il backend pulisca la risposta.
      // Se il backend restituisce l'oggetto raw di Gemini:
      let parsedResult = aiResult;
      if (aiResult.candidates) {
        const text = aiResult.candidates[0].content.parts[0].text;
        const cleanText = text
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();
        parsedResult = JSON.parse(cleanText);
      }

      return enrichAIResponse(parsedResult, match, h2hData);
    } catch (err) {
      console.warn("⚠️ Fallback attivato:", err.message);
      // Fallback: genera risposta simulata basata sulle quote
      return generateFallbackResponse(match, "Modalità offline/fallback");
    } finally {
      setLoading(false);
    }
  };

  const buildPrompt = (match, h2hData) => {
    let prompt = `
Sei un analista calcistico.
PARTITA: ${match.home} vs ${match.away}
QUOTE: 1(${match.homeOdds}) X(${match.drawOdds}) 2(${match.awayOdds})
CLASSIFICA PUNTI: Casa ${match.stats?.homePoints}, Ospiti ${match.stats?.awayPoints}
FORMA (0-100): Casa ${match.stats?.homeForm}, Ospiti ${match.stats?.awayForm}
`;
    if (h2hData) {
      prompt += `H2H: Casa Vinte ${h2hData.team1Wins}, Ospiti Vinte ${h2hData.team2Wins}, Pareggi ${h2hData.draws}. Media Gol ${h2hData.avgGoals}.`;
    }
    prompt += `
Analizza e rispondi SOLO in JSON:
{
  "summary": "Titolo breve",
  "tacticalAnalysis": { "home": "...", "away": "..." },
  "keyPoints": ["...", "...", "..."],
  "aiPrediction": "1" o "X" o "2",
  "confidence": numero_tra_60_90,
  "reasoning": "Motivazione"
}`;
    return prompt;
  };

  const enrichAIResponse = (aiResult, match, h2hData) => {
    const predictions = {
      risultatoEsatto: generateExactScore(aiResult.aiPrediction, h2hData),
      golTotali: h2hData?.avgGoals > 2.3 ? "Over 2.5" : "Under 2.5",
      btts: h2hData?.bttsPercentage > 50 ? "Sì" : "No",
      corner: "Over 9.5",
    };

    const valueRatings = calculateValueRatings(match, aiResult.aiPrediction);

    return {
      ...aiResult,
      venue: match.venue || "Stadio",
      realData: true,
      hasH2H: !!h2hData,
      predictions,
      valueRatings,
    };
  };

  const generateExactScore = (pred, h2h) => {
    const highScoring = h2h?.avgGoals > 2.5;
    if (pred === "1") return highScoring ? "2-1" : "1-0";
    if (pred === "2") return highScoring ? "1-2" : "0-1";
    return highScoring ? "2-2" : "1-1";
  };

  const calculateValueRatings = (match, pred) => {
    const getRat = (odds, isPred) => {
      let r = 10 - (parseFloat(odds) - 1) * 2;
      if (isPred) r += 2;
      r = Math.max(1, Math.min(10, Math.round(r)));
      return { rating: r, value: r > 7 ? "Alta" : r > 4 ? "Media" : "Bassa" };
    };
    return {
      casa: getRat(match.homeOdds, pred === "1"),
      pareggio: getRat(match.drawOdds, pred === "X"),
      trasferta: getRat(match.awayOdds, pred === "2"),
    };
  };

  const generateFallbackResponse = (match, msg) => {
    const h = parseFloat(match.homeOdds),
      a = parseFloat(match.awayOdds);
    let pred = "X",
      conf = 60;
    if (h < a && h < 2.1) {
      pred = "1";
      conf = 75;
    } else if (a < h && a < 2.1) {
      pred = "2";
      conf = 75;
    }

    return {
      summary: "Analisi Backup",
      tacticalAnalysis: { home: "Dati limitati", away: "Dati limitati" },
      keyPoints: [
        "Analisi base su quote",
        "Sistema offline",
        "Quote favorevoli",
      ],
      aiPrediction: pred,
      confidence: conf,
      reasoning: `Pronostico basato puramente sulle quote di mercato. ${msg}`,
      predictions: {
        risultatoEsatto: "1-1",
        golTotali: "Under 2.5",
        btts: "Sì",
        corner: "N/D",
      },
      valueRatings: calculateValueRatings(match, pred),
      realData: false,
    };
  };

  return { generatePrediction, loading, error };
};

export default useGenerativeAI;
