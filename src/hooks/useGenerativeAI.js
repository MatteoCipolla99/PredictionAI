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
      // Validazione input
      if (!match || !match.home || !match.away) {
        throw new Error("Dati partita non validi");
      }

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
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE",
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

      // Pulisci e parsa la risposta JSON
      const cleanText = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      let aiResult;
      try {
        aiResult = JSON.parse(cleanText);
      } catch (parseError) {
        console.error("Errore parsing JSON:", cleanText);
        throw new Error("Risposta AI non valida");
      }

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
    // Validazione risposta AI
    const validatedResult = {
      summary: aiResult.summary || "Analisi AI generata",
      tacticalAnalysis: {
        home: aiResult.tacticalAnalysis?.home || "Analisi non disponibile",
        away: aiResult.tacticalAnalysis?.away || "Analisi non disponibile",
      },
      keyPoints: Array.isArray(aiResult.keyPoints)
        ? aiResult.keyPoints.slice(0, 3)
        : ["Punto 1", "Punto 2", "Punto 3"],
      aiPrediction: ["1", "X", "2"].includes(aiResult.aiPrediction)
        ? aiResult.aiPrediction
        : "X",
      confidence: Math.min(90, Math.max(60, aiResult.confidence || 70)),
      reasoning:
        aiResult.reasoning || "Predizione basata su analisi statistica",
    };

    // Calcola predizioni aggiuntive basate sui dati
    const predictions = {
      risultatoEsatto: generateExactScore(
        validatedResult.aiPrediction,
        match,
        h2hData
      ),
      golTotali: h2hData?.avgGoals > 2.3 ? "Over 2.5" : "Under 2.5",
      btts:
        h2hData?.bttsPercentage > 60
          ? "Sì"
          : h2hData?.bttsPercentage > 40
          ? "Probabile"
          : "No",
      corner: "Over 9.5",
    };

    // Calcola value ratings
    const valueRatings = calculateValueRatings(
      match,
      validatedResult.aiPrediction
    );

    return {
      ...validatedResult,
      venue: match.venue || "Stadio non disponibile",
      realData: true,
      hasH2H: !!(h2hData && h2hData.totalMatches > 0),
      predictions,
      valueRatings,
    };
  };

  /**
   * Genera un punteggio esatto probabile
   */
  const generateExactScore = (prediction, match, h2hData) => {
    const avgGoals = h2hData?.avgGoals ? parseFloat(h2hData.avgGoals) : 2.5;

    const scores = {
      1: avgGoals > 2.5 ? ["2-1", "3-1", "3-0"] : ["1-0", "2-0", "2-1"],
      X: avgGoals > 2.5 ? ["2-2", "1-1", "3-3"] : ["1-1", "0-0", "2-2"],
      2: avgGoals > 2.5 ? ["1-2", "1-3", "0-3"] : ["0-1", "0-2", "1-2"],
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
      // Formula: rating base inversamente proporzionale alle quote
      let baseRating = 10 - (odds - 1) * 1.5;
      baseRating = Math.max(1, Math.min(10, baseRating));

      // Bonus se è la predizione AI
      if (isPredicted) baseRating = Math.min(10, baseRating + 2);

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
    const drawOdds = parseFloat(match.drawOdds) || 3.2;

    // Predizione basica basata sulle quote
    let prediction = "X";
    let confidence = 65;

    if (homeOdds < awayOdds && homeOdds < 2.2) {
      prediction = "1";
      confidence = 70;
    } else if (awayOdds < homeOdds && awayOdds < 2.2) {
      prediction = "2";
      confidence = 70;
    } else if (drawOdds < 3.0) {
      prediction = "X";
      confidence = 68;
    }

    return {
      summary: "Analisi generata da sistema di backup",
      tacticalAnalysis: {
        home: `${match.home} parte favorita con quote di ${homeOdds}. Sistema di backup attivo.`,
        away: `${match.away} con quote di ${awayOdds}. Analisi AI completa temporaneamente non disponibile.`,
      },
      keyPoints: [
        `Predizione basata su analisi quote: ${prediction}`,
        `Sistema in modalità fallback - ${errorMsg.slice(0, 50)}`,
        "Analisi completa disponibile a breve",
      ],
      aiPrediction: prediction,
      confidence: confidence,
      reasoning: `Predizione ${prediction} generata da sistema di backup basato su analisi quote di mercato. Confidence: ${confidence}%`,
      venue: match.venue || "Stadio non disponibile",
      realData: true,
      hasH2H: false,
      predictions: {
        risultatoEsatto:
          prediction === "1" ? "2-1" : prediction === "2" ? "1-2" : "1-1",
        golTotali: "Over 2.5",
        btts: "Probabile",
        corner: "Over 9.5",
      },
      valueRatings: calculateValueRatings(match, prediction),
    };
  };

  return {
    generatePrediction,
    loading,
    error,
  };
};

export default useGenerativeAI;
