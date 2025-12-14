import { useState, useCallback } from "react";

const API_CONFIG = {
  baseUrl: "https://api-football-v1.p.rapidapi.com/v3",
  headers: {
    "X-RapidAPI-Key": "YOUR_API_KEY_HERE",
    "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
  },
};

export const useFootballAPI = () => {
  const [loading, setLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchMatches = useCallback(async (leagueId) => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(
        `${API_CONFIG.baseUrl}/fixtures?date=${today}&league=${leagueId}&season=2024`,
        { headers: API_CONFIG.headers }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.response && data.response.length > 0) {
          const formattedMatches = data.response.map((fixture) => ({
            id: fixture.fixture.id,
            home: fixture.teams.home.name,
            away: fixture.teams.away.name,
            homeId: fixture.teams.home.id,
            awayId: fixture.teams.away.id,
            homeLogo: fixture.teams.home.logo,
            awayLogo: fixture.teams.away.logo,
            leagueName: fixture.league.name,
            leagueId: fixture.league.id,
            time: new Date(fixture.fixture.date).toLocaleTimeString("it-IT", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            date: fixture.fixture.date,
            status: fixture.fixture.status.short,
            venue: fixture.fixture.venue.name,
            homeOdds: (Math.random() * 2 + 1.5).toFixed(2),
            drawOdds: (Math.random() * 1.5 + 2.8).toFixed(2),
            awayOdds: (Math.random() * 2 + 2).toFixed(2),
            aiPrediction: Math.random() > 0.5 ? "Casa" : "Trasferta",
            confidence: Math.floor(Math.random() * 20 + 65),
            stats: {
              homeForm: Math.floor(Math.random() * 30 + 70),
              awayForm: Math.floor(Math.random() * 30 + 70),
              h2h: ["60% Casa", "45% Pareggi", "55% Casa"][
                Math.floor(Math.random() * 3)
              ],
            },
          }));
          setApiConnected(true);
          setLastUpdate(new Date());
          return { success: true, data: formattedMatches };
        }
      }
      throw new Error("API not available");
    } catch (error) {
      console.error("Errore fetch:", error);
      setApiConnected(false);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStandings = useCallback(async (leagueId) => {
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}/standings?season=2024&league=${leagueId}`,
        { headers: API_CONFIG.headers }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.response && data.response.length > 0) {
          return {
            success: true,
            data: data.response[0].league.standings[0].slice(0, 10),
          };
        }
      }
      return { success: false };
    } catch (error) {
      console.error("Errore fetch standings:", error);
      return { success: false, error: error.message };
    }
  }, []);

  const fetchLiveMatches = useCallback(async () => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/fixtures?live=all`, {
        headers: API_CONFIG.headers,
      });
      if (response.ok) {
        const data = await response.json();
        if (data.response && data.response.length > 0) {
          const formattedLive = data.response.slice(0, 6).map((fixture) => ({
            id: fixture.fixture.id,
            home: fixture.teams.home.name,
            away: fixture.teams.away.name,
            homeScore: fixture.goals.home || 0,
            awayScore: fixture.goals.away || 0,
            time: fixture.fixture.status.elapsed || 0,
            status: fixture.fixture.status.short,
          }));
          return { success: true, data: formattedLive };
        }
      }
      return { success: false };
    } catch (error) {
      console.error("Errore fetch live:", error);
      return { success: false, error: error.message };
    }
  }, []);

  const fetchH2H = useCallback(async (team1Id, team2Id) => {
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}/fixtures/headtohead?h2h=${team1Id}-${team2Id}&last=10`,
        { headers: API_CONFIG.headers }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.response && data.response.length > 0) {
          const matches = data.response;
          const team1Wins = matches.filter(
            (m) =>
              (m.teams.home.id === team1Id && m.goals.home > m.goals.away) ||
              (m.teams.away.id === team1Id && m.goals.away > m.goals.home)
          ).length;
          const team2Wins = matches.filter(
            (m) =>
              (m.teams.home.id === team2Id && m.goals.home > m.goals.away) ||
              (m.teams.away.id === team2Id && m.goals.away > m.goals.home)
          ).length;
          const draws = matches.filter(
            (m) => m.goals.home === m.goals.away
          ).length;

          let totalGoals = 0,
            over25 = 0,
            btts = 0;
          matches.forEach((m) => {
            const total = m.goals.home + m.goals.away;
            totalGoals += total;
            if (total > 2.5) over25++;
            if (m.goals.home > 0 && m.goals.away > 0) btts++;
          });

          return {
            success: true,
            data: {
              totalMatches: matches.length,
              team1Wins,
              team2Wins,
              draws,
              team1WinPercentage: ((team1Wins / matches.length) * 100).toFixed(
                1
              ),
              team2WinPercentage: ((team2Wins / matches.length) * 100).toFixed(
                1
              ),
              drawPercentage: ((draws / matches.length) * 100).toFixed(1),
              avgGoals: (totalGoals / matches.length).toFixed(2),
              over25Percentage: ((over25 / matches.length) * 100).toFixed(1),
              bttsPercentage: ((btts / matches.length) * 100).toFixed(1),
              lastMatches: matches.slice(0, 5).map((m) => ({
                date: new Date(m.fixture.date).toLocaleDateString("it-IT"),
                homeTeam: m.teams.home.name,
                awayTeam: m.teams.away.name,
                homeScore: m.goals.home,
                awayScore: m.goals.away,
                winner:
                  m.goals.home > m.goals.away
                    ? "home"
                    : m.goals.away > m.goals.home
                    ? "away"
                    : "draw",
              })),
            },
          };
        }
      }
      return { success: false };
    } catch (error) {
      console.error("Errore fetch H2H:", error);
      return { success: false, error: error.message };
    }
  }, []);

  return {
    loading,
    apiConnected,
    lastUpdate,
    fetchMatches,
    fetchStandings,
    fetchLiveMatches,
    fetchH2H,
  };
};

export default useFootballAPI;
