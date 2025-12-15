import { useState } from "react";

// ⚠️ SOLO SVILUPPO – in produzione va su backend
const GEMINI_API_KEY = "AIzaSyD9Ok1vdlK5ymTwPfoPkm08bXPAYqG4Jqs";
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export const useGenerativeAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Genera una predizione AI completa per una partita
   * @param {Object} match - Dati della partita
   * @param {Object|null} h2hData - Dati H2H (opzionale)
   * @returns {Promise<Object>} - Analisi AI completa
   */
  const generatePrediction = async (match, h2hData = null) => {
    setLoading(true);
    setError(null);

    try {
      // Costruisci il prompt con tutti i dati disponibili
      const prompt = buildPrompt(match, h2hData);

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
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
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

      // Pulisci e parsa la risposta JSON
      const cleanText = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const aiResult = JSON.parse(cleanText);

      // Valida e arricchisci la risposta
      return enrichAIResponse(aiResult, match, h2hData);
    } catch (err) {
      console.error("❌ Errore Gemini AI:", err);
      setError(err.message);

      // Ritorna una risposta di fallback
      return generateFallbackResponse(match, err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Costruisce il prompt per Gemini AI
   */
  const buildPrompt = (match, h2hData) => {
    let prompt = `
Sei un analista professionista di calcio con esperienza in predizioni sportive.

📊 PARTITA:
${match.home} vs ${match.away}

📈 STATISTICHE CASA (${match.home}):
- Punti in classifica: ${match.stats?.homePoints ?? "N/D"}
- Forma recente: ${match.stats?.homeForm ?? 50}/100
- Quota: ${match.homeOdds}

📉 STATISTICHE TRASFERTA (${match.away}):
- Punti in classifica: ${match.stats?.awayPoints ?? "N/D"}
- Forma recente: ${match.stats?.awayForm ?? 50}/100
- Quota: ${match.awayOdds}

⚖️ QUOTA PAREGGIO: ${match.drawOdds}
`;

    // Aggiungi dati H2H se disponibili
    if (h2hData && h2hData.totalMatches > 0) {
      prompt += `
🔄 SCONTRI DIRETTI (Ultimi ${h2hData.totalMatches} match):
- Vittorie ${match.home}: ${h2hData.team1Wins} (${h2hData.team1WinPercentage}%)
- Pareggi: ${h2hData.draws} (${h2hData.drawPercentage}%)
- Vittorie ${match.away}: ${h2hData.team2Wins} (${h2hData.team2WinPercentage}%)
- Media gol: ${h2hData.avgGoals}
- Over 2.5: ${h2hData.over25Percentage}%
- BTTS: ${h2hData.bttsPercentage}%
`;
    }

    prompt += `
📋 COMPITO:
Analizza TUTTI i dati forniti e genera una predizione professionale.

⚠️ IMPORTANTE: Rispondi SOLO con JSON valido, senza testo aggiuntivo prima o dopo.

FORMATO RICHIESTO (JSON):
{
  "summary": "Titolo breve dell'analisi (max 60 caratteri)",
  "tacticalAnalysis": {
    "home": "Analisi tattica squadra casa (2-3 frasi)",
    "away": "Analisi tattica squadra trasferta (2-3 frasi)"
  },
  "keyPoints": [
    "Punto chiave 1 (max 80 caratteri)",
    "Punto chiave 2 (max 80 caratteri)",
    "Punto chiave 3 (max 80 caratteri)"
  ],
  "aiPrediction": "1, X o 2 (solo una di queste opzioni)",
  "confidence": 75,
  "reasoning": "Spiegazione della predizione (3-4 frasi)"
}

REGOLE:
- confidence deve essere un numero tra 60 e 90
- aiPrediction deve essere esattamente "1", "X" o "2"
- keyPoints deve contenere esattamente 3 elementi
- summary deve essere conciso e informativo
- reasoning deve spiegare perché hai scelto quella predizione
- Considera TUTTI i dati: quote, forma, classifica, H2H
`;

    return prompt;
  };

  /**
   * Arricchisce la risposta AI con dati aggiuntivi
   */
  const enrichAIResponse = (aiResult, match, h2hData) => {
    // Calcola predizioni aggiuntive basate sui dati
    const predictions = {
      risultatoEsatto: generateExactScore(aiResult.aiPrediction, match),
      golTotali: h2hData?.avgGoals > 2.3 ? "Over 2.5" : "Under 2.5",
      btts: h2hData?.bttsPercentage > 60 ? "Sì" : "Probabile",
      corner: "N/D",
    };

    // Calcola value ratings
    const valueRatings = calculateValueRatings(match, aiResult.aiPrediction);

    return {
      summary: aiResult.summary,
      tacticalAnalysis: aiResult.tacticalAnalysis,
      keyPoints: aiResult.keyPoints,
      aiPrediction: aiResult.aiPrediction,
      confidence: aiResult.confidence,
      reasoning: aiResult.reasoning,
      venue: match.venue || "Stadio non disponibile",
      realData: true,
      hasH2H: !!h2hData,
      predictions,
      valueRatings,
    };
  };

  /**
   * Genera un punteggio esatto probabile
   */
  const generateExactScore = (prediction, match) => {
    const scores = {
      1: ["2-0", "2-1", "3-1"],
      X: ["1-1", "2-2", "0-0"],
      2: ["0-2", "1-2", "1-3"],
    };

    const possibleScores = scores[prediction] || ["1-1"];
    return possibleScores[Math.floor(Math.random() * possibleScores.length)];
  };

  /**
   * Calcola i value rating per ogni esito
   */
  const calculateValueRatings = (match, aiPrediction) => {
    const homeOdds = parseFloat(match.homeOdds) || 2.5;
    const drawOdds = parseFloat(match.drawOdds) || 3.2;
    const awayOdds = parseFloat(match.awayOdds) || 2.5;

    const calculateRating = (odds, isPredicted) => {
      let baseRating = 10 - (odds - 1) * 2;
      baseRating = Math.max(1, Math.min(10, baseRating));

      if (isPredicted) baseRating += 2;

      const value =
        baseRating >= 7 ? "Alta" : baseRating >= 5 ? "Media" : "Bassa";

      return { rating: Math.round(baseRating), value };
    };

    return {
      casa: calculateRating(homeOdds, aiPrediction === "1"),
      pareggio: calculateRating(drawOdds, aiPrediction === "X"),
      trasferta: calculateRating(awayOdds, aiPrediction === "2"),
    };
  };

  /**
   * Genera una risposta di fallback in caso di errore
   */
  const generateFallbackResponse = (match, errorMsg) => {
    const homeOdds = parseFloat(match.homeOdds) || 2.5;
    const awayOdds = parseFloat(match.awayOdds) || 2.5;

    // Predizione basica basata sulle quote
    let prediction = "X";
    if (homeOdds < awayOdds && homeOdds < 2.0) prediction = "1";
    else if (awayOdds < homeOdds && awayOdds < 2.0) prediction = "2";

    return {
      summary: "Analisi AI temporaneamente non disponibile",
      tacticalAnalysis: {
        home: "Analisi tattica non disponibile. Sistema in modalità fallback.",
        away: "Analisi tattica non disponibile. Sistema in modalità fallback.",
      },
      keyPoints: [
        "Analisi AI temporaneamente non disponibile",
        "Predizione basata su quote e statistiche base",
        `Errore: ${errorMsg}`,
      ],
      aiPrediction: prediction,
      confidence: 60,
      reasoning:
        "Predizione generata da sistema di fallback basato su analisi quote.",
      venue: match.venue || "Stadio non disponibile",
      realData: true,
      hasH2H: false,
      predictions: {
        risultatoEsatto: "1-1",
        golTotali: "Over 2.5",
        btts: "Probabile",
        corner: "N/D",
      },
      valueRatings: {
        casa: { rating: 6, value: "Media" },
        pareggio: { rating: 6, value: "Media" },
        trasferta: { rating: 6, value: "Media" },
      },
    };
  };

  return {
    generatePrediction,
    loading,
    error,
  };
};

export default useGenerativeAI;
