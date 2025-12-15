import { useState, useCallback } from "react";

// CONFIGURAZIONE PROXY
const API_CONFIG = {
  baseUrl: "/api",
  headers: {
    "X-Auth-Token": "85f4e8009ca44155a30d5ec5944ae943",
  },
};

const LEAGUE_MAP = {
  135: "SA", // Serie A
  39: "PL", // Premier League
  140: "PD", // La Liga
  78: "BL1", // Bundesliga
  61: "FL1", // Ligue 1
  2: "CL", // Champions League
};

const calculateSyntheticOdds = (homeRank, awayRank) => {
  let home = 2.5,
    draw = 3.2,
    away = 2.5;
  if (!homeRank || !awayRank)
    return { home: "2.50", draw: "3.20", away: "2.50" };

  const rankDiff = awayRank - homeRank;
  if (rankDiff > 0) {
    home = Math.max(1.1, 2.5 - rankDiff * 0.08);
    away = Math.min(15.0, 2.5 + rankDiff * 0.12);
  } else {
    away = Math.max(1.1, 2.5 - Math.abs(rankDiff) * 0.08);
    home = Math.min(15.0, 2.5 + Math.abs(rankDiff) * 0.12);
  }
  draw = Math.max(2.8, (home + away) / 2 + 0.5);
  return {
    home: home.toFixed(2),
    draw: draw.toFixed(2),
    away: away.toFixed(2),
  };
};

const calculateFormScore = (formString) => {
  if (!formString) return 50;
  const scores = { W: 20, D: 10, L: 0 };
  let total = 0;
  const matches = formString.replace(/,/g, "").split("").slice(-5);
  matches.forEach((char) => (total += scores[char] || 10));
  return total;
};

const mapStatus = (status) => {
  if (status === "TIMED" || status === "SCHEDULED") return "NS";
  if (status === "IN_PLAY") return "LIVE";
  if (status === "PAUSED") return "HT";
  if (status === "FINISHED") return "FT";
  return status;
};

export const useFootballAPI = () => {
  const [loading, setLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);

  const testConnection = useCallback(async () => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/competitions`, {
        headers: API_CONFIG.headers,
      });
      if (response.ok) {
        setApiConnected(true);
        setLastUpdate(new Date());
        return { success: true };
      }
      setApiConnected(false);
      return { success: false };
    } catch (err) {
      setApiConnected(false);
      return { success: false, error: err.message };
    }
  }, []);

  const fetchStandings = useCallback(async (leagueId) => {
    setLoading(true);
    setError(null);
    const code = LEAGUE_MAP[leagueId] || "SA";

    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}/competitions/${code}/standings`,
        { headers: API_CONFIG.headers }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.errorCode) {
        console.error("API Error:", data.message);
        setError(data.message);
        return { success: false, error: data.message };
      }

      if (data.standings && data.standings.length > 0) {
        const table = data.standings[0].table.map((item) => ({
          rank: item.position,
          team: {
            id: item.team.id,
            name: item.team.shortName || item.team.name,
            logo: item.team.crest,
          },
          points: item.points,
          form: item.form ? item.form.replace(/,/g, "") : "?????",
          goalsDiff: item.goalDifference,
          all: {
            played: item.playedGames,
            win: item.won,
            draw: item.draw,
            lose: item.lost,
            goals: { for: item.goalsFor, against: item.goalsAgainst },
          },
        }));

        setApiConnected(true);
        setLastUpdate(new Date());
        return { success: true, data: table };
      }
      return { success: false, data: [] };
    } catch (err) {
      console.error("Fetch Standings Error:", err);
      setError(err.message);
      setApiConnected(false);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMatches = useCallback(
    async (leagueId, date = null, standings = []) => {
      setLoading(true);
      setError(null);
      const code = LEAGUE_MAP[leagueId] || "SA";
      const targetDate = date || new Date().toISOString().split("T")[0];

      try {
        const url = `${API_CONFIG.baseUrl}/competitions/${code}/matches?dateFrom=${targetDate}&dateTo=${targetDate}`;
        console.log(`🔄 Chiamata API (via Proxy): ${url}`);

        const response = await fetch(url, { headers: API_CONFIG.headers });

        if (!response.ok) {
          if (response.status === 429) {
            setError("Limite API raggiunto. Attendi 1 minuto.");
            return {
              success: false,
              error: "Troppe richieste (attendi 1 min)",
            };
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.errorCode) {
          setError(data.message);
          return { success: false, error: data.message };
        }

        if (data.matches) {
          setApiConnected(true);
          setLastUpdate(new Date());

          const formattedMatches = data.matches.map((match) => {
            const homeRank = standings.find(
              (s) => s.team.id === match.homeTeam.id
            );
            const awayRank = standings.find(
              (s) => s.team.id === match.awayTeam.id
            );
            const odds = calculateSyntheticOdds(homeRank?.rank, awayRank?.rank);

            return {
              id: match.id,
              home: match.homeTeam.shortName || match.homeTeam.name,
              away: match.awayTeam.shortName || match.awayTeam.name,
              homeId: match.homeTeam.id,
              awayId: match.awayTeam.id,
              homeLogo: match.homeTeam.crest,
              awayLogo: match.awayTeam.crest,
              leagueName: match.competition.name,
              leagueId: leagueId,
              time: new Date(match.utcDate).toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              status: mapStatus(match.status),
              statusLong: match.status,
              venue: match.venue || "Stadio Standard",
              homeScore: match.score.fullTime.home,
              awayScore: match.score.fullTime.away,
              homeOdds: odds.home,
              drawOdds: odds.draw,
              awayOdds: odds.away,
              stats: {
                homeForm: homeRank ? calculateFormScore(homeRank.form) : 50,
                awayForm: awayRank ? calculateFormScore(awayRank.form) : 50,
                homePoints: homeRank?.points || 0,
                awayPoints: awayRank?.points || 0,
              },
              aiPrediction: null,
              confidence: null,
            };
          });

          return { success: true, data: formattedMatches };
        }
        return { success: true, data: [] };
      } catch (err) {
        console.error("❌ API Fetch Error:", err);
        setError(err.message);
        setApiConnected(false);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchLiveMatches = useCallback(async () => {
    // Football-Data.org free tier non supporta live matches
    // Restituiamo array vuoto
    return { success: true, data: [] };
  }, []);

  const fetchH2H = useCallback(async (team1Id, team2Id) => {
    // Football-Data.org free tier ha limitazioni sugli H2H
    // Generiamo dati sintetici per demo
    setLoading(true);

    try {
      // Simula un piccolo delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Dati H2H simulati ma realistici
      const mockH2H = {
        totalMatches: 10,
        team1Wins: Math.floor(Math.random() * 5) + 2,
        team2Wins: Math.floor(Math.random() * 4) + 1,
        draws: 0,
      };

      mockH2H.draws =
        mockH2H.totalMatches - mockH2H.team1Wins - mockH2H.team2Wins;

      const data = {
        totalMatches: mockH2H.totalMatches,
        team1Wins: mockH2H.team1Wins,
        team2Wins: mockH2H.team2Wins,
        draws: mockH2H.draws,
        team1WinPercentage: (
          (mockH2H.team1Wins / mockH2H.totalMatches) *
          100
        ).toFixed(1),
        team2WinPercentage: (
          (mockH2H.team2Wins / mockH2H.totalMatches) *
          100
        ).toFixed(1),
        drawPercentage: ((mockH2H.draws / mockH2H.totalMatches) * 100).toFixed(
          1
        ),
        avgGoals: (2.3 + Math.random() * 0.8).toFixed(1),
        over25Percentage: (Math.random() * 30 + 50).toFixed(1),
        bttsPercentage: (Math.random() * 30 + 50).toFixed(1),
        lastMatches: [],
      };

      return { success: true, data };
    } catch (err) {
      console.error("H2H Error:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    apiConnected,
    lastUpdate,
    error,
    testConnection,
    fetchMatches,
    fetchStandings,
    fetchLiveMatches,
    fetchH2H,
  };
};

export default useFootballAPI;
