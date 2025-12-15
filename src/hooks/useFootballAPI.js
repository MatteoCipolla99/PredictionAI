import { useState, useCallback } from "react";

// CONFIGURAZIONE PROXY (Il browser chiama /api, Vite chiama il server vero)
const API_CONFIG = {
  baseUrl: "/api", // <--- ORA PUNTA AL NOSTRO PROXY LOCALE
  headers: {
    // LA TUA CHIAVE:
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
    home = Math.max(1.1, 2.5 - rankDiff * 0.1);
    away = Math.min(15.0, 2.5 + rankDiff * 0.15);
  } else {
    away = Math.max(1.1, 2.5 - Math.abs(rankDiff) * 0.1);
    home = Math.min(15.0, 2.5 + Math.abs(rankDiff) * 0.15);
  }
  draw = Math.max(2.8, (home + away) / 2 + 0.5);
  return {
    home: home.toFixed(2),
    draw: draw.toFixed(2),
    away: away.toFixed(2),
  };
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
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const fetchStandings = useCallback(async (leagueId) => {
    setLoading(true);
    const code = LEAGUE_MAP[leagueId] || "SA";

    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}/competitions/${code}/standings`,
        { headers: API_CONFIG.headers }
      );

      const data = await response.json();

      if (data.errorCode) {
        console.error("API Error:", data.message);
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
        return { success: true, data: table };
      }
      return { success: false, data: [] };
    } catch (err) {
      console.error("Fetch Standings Error:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMatches = useCallback(
    async (leagueId, date = null, standings = []) => {
      setLoading(true);
      const code = LEAGUE_MAP[leagueId] || "SA";
      const targetDate = date || new Date().toISOString().split("T")[0];

      try {
        // Usiamo il proxy /api invece dell'URL completo
        const url = `${API_CONFIG.baseUrl}/competitions/${code}/matches?dateFrom=${targetDate}&dateTo=${targetDate}`;
        console.log(`Chiamata API (via Proxy): ${url}`);

        const response = await fetch(url, { headers: API_CONFIG.headers });
        const data = await response.json();

        if (data.errorCode) {
          if (data.errorCode === 429)
            return {
              success: false,
              error: "Troppe richieste (attendi 1 min)",
            };
          return { success: false, error: data.message };
        }

        if (data.matches) {
          setApiConnected(true);
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
              venue: "Stadio Standard",
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
            };
          });
          return { success: true, data: formattedMatches };
        }
        return { success: true, data: [] };
      } catch (err) {
        console.error("API Fetch Error:", err);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const mapStatus = (status) => {
    if (status === "TIMED" || status === "SCHEDULED") return "NS";
    if (status === "IN_PLAY") return "LIVE";
    if (status === "PAUSED") return "HT";
    if (status === "FINISHED") return "FT";
    return status;
  };

  const calculateFormScore = (formString) => {
    if (!formString) return 50;
    const scores = { W: 20, D: 10, L: 0 };
    let total = 0;
    const matches = formString.replace(/,/g, "").split("").slice(-5);
    matches.forEach((char) => (total += scores[char] || 10));
    return total;
  };

  const fetchLiveMatches = useCallback(async () => {
    return { success: true, data: [] };
  }, []);

  const fetchH2H = useCallback(async (team1Id, team2Id) => {
    return { success: false };
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
