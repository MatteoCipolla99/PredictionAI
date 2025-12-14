import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Brain,
  Search,
  Trophy,
  Target,
  Zap,
  Activity,
  Bell,
  TrendingDown,
  LineChart,
  PieChart,
  Users,
  Calendar,
  AlertCircle,
  X,
  Check,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const FootballStatsAI = () => {
  const [activeTab, setActiveTab] = useState("matches");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [matches, setMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState("135"); // Default: Serie A
  const [standings, setStandings] = useState([]);
  const [h2hData, setH2hData] = useState(null);
  const [loadingH2h, setLoadingH2h] = useState(false); // Configurazione API

  const API_CONFIG = {
    // Usando API-Football (RapidAPI)
    // Per testare: https://rapidapi.com/api-sports/api/api-football
    baseUrl: "https://api-football-v1.p.rapidapi.com/v3",
    headers: {
      "X-RapidAPI-Key": "YOUR_API_KEY_HERE", // Sostituire con la tua chiave
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  }; // Campionati disponibili

  const leagues = [
    { id: "135", name: "Serie A", country: "🇮🇹", flag: "IT" },
    { id: "39", name: "Premier League", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", flag: "GB" },
    { id: "140", name: "La Liga", country: "🇪🇸", flag: "ES" },
    { id: "78", name: "Bundesliga", country: "🇩🇪", flag: "DE" },
    { id: "61", name: "Ligue 1", country: "🇫🇷", flag: "FR" },
    { id: "2", name: "Champions League", country: "🏆", flag: "EU" },
    { id: "3", name: "Europa League", country: "🏆", flag: "EU" },
    { id: "94", name: "Primeira Liga", country: "🇵🇹", flag: "PT" },
  ]; // Funzione per fetch partite in programma

  const fetchMatches = async (leagueId = selectedLeague) => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0]; // Fetch fixtures per la lega selezionata
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
            venue: fixture.fixture.venue.name, // Dati simulati per demo (in produzione usare API odds)
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
          setMatches(formattedMatches);
          setApiConnected(true);
          setLastUpdate(new Date());
          const leagueName =
            leagues.find((l) => l.id === leagueId)?.name || "campionato";
          addNotification(
            "success",
            "Dati Aggiornati",
            `${formattedMatches.length} partite caricate da ${leagueName}`
          );
        } else {
          // Se non ci sono partite oggi, usa dati demo
          loadDemoData();
          addNotification(
            "info",
            "Nessuna Partita",
            "Non ci sono partite oggi per questo campionato"
          );
        }
      } else {
        throw new Error("API non disponibile");
      }
    } catch (error) {
      console.error("Errore fetch:", error);
      setApiConnected(false);
      addNotification(
        "warning",
        "Modalità Demo",
        "Usando dati dimostrativi - Configura API key per dati reali"
      );
      loadDemoData();
    } finally {
      setLoading(false);
    }
  }; // Fetch classifica campionato

  const fetchStandings = async (leagueId = selectedLeague) => {
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}/standings?season=2024&league=${leagueId}`,
        { headers: API_CONFIG.headers }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.response && data.response.length > 0) {
          const standingsData = data.response[0].league.standings[0];
          setStandings(standingsData.slice(0, 10)); // Top 10
        }
      }
    } catch (error) {
      console.error("Errore fetch standings:", error);
    }
  }; // Fetch partite live

  const fetchLiveMatches = async () => {
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
          setLiveMatches(formattedLive);
        }
      }
    } catch (error) {
      console.error("Errore fetch live:", error); // Usa dati demo per live
      setLiveMatches([
        {
          id: 1,
          home: "PSG",
          away: "Lyon",
          homeScore: 2,
          awayScore: 1,
          time: 67,
          status: "2H",
        },
        {
          id: 2,
          home: "Bayern",
          away: "Dortmund",
          homeScore: 1,
          awayScore: 1,
          time: 82,
          status: "2H",
        },
        {
          id: 3,
          home: "Liverpool",
          away: "Chelsea",
          homeScore: 3,
          awayScore: 2,
          time: 45,
          status: "HT",
        },
      ]);
    }
  }; // Dati demo di fallback

  const loadDemoData = () => {
    const demoMatches = [
      {
        id: 1,
        home: "Inter",
        away: "Milan",
        time: "20:45",
        date: new Date().toISOString(),
        homeOdds: 2.1,
        drawOdds: 3.4,
        awayOdds: 3.6,
        aiPrediction: "Casa",
        confidence: 78,
        stats: { homeForm: 85, awayForm: 72, h2h: "60% Casa" },
        status: "NS",
        venue: "San Siro",
        homeId: 505,
        awayId: 489,
        homeLogo: "https://media.api-sports.io/football/teams/505.png",
        awayLogo: "https://media.api-sports.io/football/teams/489.png",
      },
      {
        id: 2,
        home: "Juventus",
        away: "Napoli",
        time: "18:00",
        date: new Date().toISOString(),
        homeOdds: 2.25,
        drawOdds: 3.2,
        awayOdds: 3.3,
        aiPrediction: "X",
        confidence: 65,
        stats: { homeForm: 78, awayForm: 80, h2h: "45% Pareggi" },
        status: "NS",
        venue: "Allianz Stadium",
        homeId: 496,
        awayId: 492,
        homeLogo: "https://media.api-sports.io/football/teams/496.png",
        awayLogo: "https://media.api-sports.io/football/teams/492.png",
      },
      {
        id: 3,
        home: "Roma",
        away: "Lazio",
        time: "21:00",
        date: new Date().toISOString(),
        homeOdds: 2.4,
        drawOdds: 3.3,
        awayOdds: 3.0,
        aiPrediction: "Casa",
        confidence: 71,
        stats: { homeForm: 75, awayForm: 68, h2h: "55% Casa" },
        status: "NS",
        venue: "Olimpico",
        homeId: 497,
        awayId: 487,
        homeLogo: "https://media.api-sports.io/football/teams/497.png",
        awayLogo: "https://media.api-sports.io/football/teams/487.png",
      },
    ];
    setMatches(demoMatches);
  }; // Fetch statistiche squadra da API

  const fetchTeamStats = async (teamId) => {
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}/teams/statistics?team=${teamId}&season=2024&league=${selectedLeague}`,
        { headers: API_CONFIG.headers }
      );
      if (response.ok) {
        const data = await response.json();
        return data.response;
      }
    } catch (error) {
      console.error("Errore fetch stats:", error);
    }
    return null;
  }; // Fetch H2H (Head to Head) Statistics

  const fetchH2H = async (team1Id, team2Id) => {
    setLoadingH2h(true);
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}/fixtures/headtohead?h2h=${team1Id}-${team2Id}&last=10`,
        { headers: API_CONFIG.headers }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.response && data.response.length > 0) {
          // Analizza i risultati H2H
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
          ).length; // Calcola statistiche gol
          let totalGoals = 0;
          let over25 = 0;
          let btts = 0; // Both Teams To Score
          matches.forEach((m) => {
            const total = m.goals.home + m.goals.away;
            totalGoals += total;
            if (total > 2.5) over25++;
            if (m.goals.home > 0 && m.goals.away > 0) btts++;
          });
          const h2hStats = {
            totalMatches: matches.length,
            team1Wins,
            team2Wins,
            draws,
            team1WinPercentage: ((team1Wins / matches.length) * 100).toFixed(1),
            team2WinPercentage: ((team2Wins / matches.length) * 100).toFixed(1),
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
          };
          setH2hData(h2hStats);
          return h2hStats;
        }
      }
    } catch (error) {
      console.error("Errore fetch H2H:", error); // Dati demo per H2H
      setH2hData({
        totalMatches: 10,
        team1Wins: 4,
        team2Wins: 3,
        draws: 3,
        team1WinPercentage: "40.0",
        team2WinPercentage: "30.0",
        drawPercentage: "30.0",
        avgGoals: "2.8",
        over25Percentage: "60.0",
        bttsPercentage: "70.0",
        lastMatches: [
          {
            date: "15/11/2024",
            homeTeam: "Inter",
            awayTeam: "Milan",
            homeScore: 2,
            awayScore: 1,
            winner: "home",
          },
          {
            date: "22/09/2024",
            homeTeam: "Milan",
            awayTeam: "Inter",
            homeScore: 1,
            awayScore: 1,
            winner: "draw",
          },
          {
            date: "10/05/2024",
            homeTeam: "Inter",
            awayTeam: "Milan",
            homeScore: 3,
            awayScore: 0,
            winner: "home",
          },
          {
            date: "18/02/2024",
            homeTeam: "Milan",
            awayTeam: "Inter",
            homeScore: 2,
            awayScore: 2,
            winner: "draw",
          },
          {
            date: "03/12/2023",
            homeTeam: "Inter",
            awayTeam: "Milan",
            homeScore: 1,
            awayScore: 2,
            winner: "away",
          },
        ],
      });
    } finally {
      setLoadingH2h(false);
    }
    return null;
  }; // Analisi AI con dati reali

  const analyzeWithAI = async (match) => {
    setAiAnalyzing(true);
    setSelectedMatch(match);
    setH2hData(null);
    try {
      // Fetch statistiche reali per entrambe le squadre + H2H
      let homeStats = null;
      let awayStats = null;
      let h2hStats = null;
      if (match.homeId && match.awayId && apiConnected) {
        [homeStats, awayStats, h2hStats] = await Promise.all([
          fetchTeamStats(match.homeId),
          fetchTeamStats(match.awayId),
          fetchH2H(match.homeId, match.awayId),
        ]);
      } // Simula elaborazione AI

      setTimeout(() => {
        const analysis = {
          summary: `Analisi approfondita basata su dati reali di ${match.home} vs ${match.away}`,
          keyPoints:
            homeStats && h2hStats
              ? [
                  `${match.home} ha ${homeStats.fixtures.wins.home} vittorie casalinghe su ${homeStats.fixtures.played.home} partite`,
                  `Negli ultimi ${h2hStats.totalMatches} scontri diretti: ${h2hStats.team1Wins} vittorie ${match.home}, ${h2hStats.draws} pareggi, ${h2hStats.team2Wins} vittorie ${match.away}`,
                  `Media gol negli scontri diretti: ${h2hStats.avgGoals} - Over 2.5 nel ${h2hStats.over25Percentage}% dei casi`,
                  `Both Teams To Score verificato nel ${h2hStats.bttsPercentage}% delle partite tra queste squadre`,
                ]
              : [
                  `${match.home} ha vinto 4 delle ultime 5 partite casalinghe con una media di 2.4 gol segnati`,
                  `${match.away} ha subito gol in 8 delle ultime 10 trasferte`,
                  "Gli scontri diretti degli ultimi 3 anni favoriscono la squadra di casa (60% vittorie)",
                  "Il momentum attuale suggerisce un match ad alta intensità con probabile Over 2.5 gol",
                ],
          tacticalAnalysis: {
            home: `${match.home} dovrebbe schierarsi con un modulo offensivo, puntando sul controllo del centrocampo e sugli esterni`,
            away: `${match.away} opterà probabilmente per un approccio più equilibrato, cercando di sfruttare le ripartenze`,
          },
          predictions: {
            risultatoEsatto: "2-1",
            golTotali: h2hStats
              ? `Over 2.5 (${h2hStats.over25Percentage}% probabilità)`
              : "Over 2.5 (78% probabilità)",
            corner: "Over 9.5 (65% probabilità)",
            cartellini: "Over 3.5 (72% probabilità)",
            btts: h2hStats
              ? `BTTS Sì (${h2hStats.bttsPercentage}% probabilità)`
              : "BTTS Sì (70% probabilità)",
          },
          valueRatings: {
            casa: { rating: 8.5, value: "Alta" },
            pareggio: { rating: 5.2, value: "Bassa" },
            trasferta: { rating: 4.8, value: "Media" },
          },
          venue: match.venue,
          realData: apiConnected,
          hasH2H: !!h2hStats,
        };
        setAiAnalysis(analysis);
        setAiAnalyzing(false);
        addNotification(
          "success",
          "Analisi Completata",
          `Analisi ${apiConnected ? "con dati reali" : "demo"} per ${
            match.home
          } vs ${match.away}${h2hStats ? " + H2H" : ""}`
        );
      }, 2000);
    } catch (error) {
      console.error("Errore analisi:", error);
      setAiAnalyzing(false);
      addNotification("error", "Errore", "Impossibile completare l'analisi");
    }
  }; // Carica dati all'avvio

  useEffect(() => {
    fetchMatches(selectedLeague);
    fetchLiveMatches();
    fetchStandings(selectedLeague); // Auto-refresh ogni 60 secondi per partite live
    const interval = setInterval(() => {
      fetchLiveMatches();
    }, 60000);
    return () => clearInterval(interval);
  }, [selectedLeague]); // Handler cambio campionato

  const handleLeagueChange = (leagueId) => {
    setSelectedLeague(leagueId);
    setMatches([]);
    setStandings([]);
  }; // Sistema notifiche

  const addNotification = (type, title, message) => {
    const newNotif = {
      id: Date.now(),
      type,
      title,
      message,
      time: "Ora",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 10)); // Max 10 notifiche
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }; // Dati per grafici

  const performanceData = [
    { giornata: "G1", punti: 3, gol: 2, xG: 1.8 },
    { giornata: "G2", punti: 1, gol: 1, xG: 1.5 },
    { giornata: "G3", punti: 3, gol: 3, xG: 2.3 },
    { giornata: "G4", punti: 3, gol: 2, xG: 2.1 },
    { giornata: "G5", punti: 0, gol: 0, xG: 1.2 },
    { giornata: "G6", punti: 3, gol: 4, xG: 3.2 },
    { giornata: "G7", punti: 3, gol: 2, xG: 2.5 },
  ];

  const formComparison = [
    { periodo: "Ult. 5", inter: 85, milan: 72 },
    { periodo: "Casa", inter: 90, milan: 68 },
    { periodo: "Trasferta", inter: 75, milan: 78 },
    { periodo: "vs Top 6", inter: 70, milan: 65 },
  ];

  const radarData = [
    { stat: "Attacco", inter: 88, milan: 76 },
    { stat: "Difesa", inter: 85, milan: 72 },
    { stat: "Possesso", inter: 82, milan: 78 },
    { stat: "Pressing", inter: 79, milan: 81 },
    { stat: "Transizioni", inter: 86, milan: 74 },
  ];

  const pieData = [
    { name: "Vittorie", value: 65, color: "#10b981" },
    { name: "Pareggi", value: 20, color: "#f59e0b" },
    { name: "Sconfitte", value: 15, color: "#ef4444" },
  ]; // Data for H2H Pie Chart

  const getH2hPieData = (h2h) => [
    {
      name: "Vittorie Casa",
      value: Number(h2h.team1WinPercentage),
      color: "#3b82f6",
    },
    { name: "Pareggi", value: Number(h2h.drawPercentage), color: "#94a3b8" },
    {
      name: "Vittorie Trasferta",
      value: Number(h2h.team2WinPercentage),
      color: "#a855f7",
    },
  ];

  const advancedStats = {
    xG: { value: 2.3, trend: "up", desc: "Expected Goals per partita" },
    xGA: { value: 1.1, trend: "down", desc: "Expected Goals Against" },
    possesso: { value: 58, trend: "up", desc: "Possesso palla medio" },
    passaggi: { value: 524, trend: "up", desc: "Passaggi completati" },
    tiri: { value: 15.2, trend: "up", desc: "Tiri per partita" },
    precisione: { value: 87, trend: "up", desc: "Precisione passaggi %" },
  };

  const StatCard = ({ icon: Icon, title, value, trend, desc }) => (
    <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-4 hover:border-blue-600/50 transition-all">
           {" "}
      <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 text-blue-400" />       {" "}
        {trend === "up" ? (
          <TrendingUp className="w-4 h-4 text-green-400" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-400" />
        )}
             {" "}
      </div>
            <div className="text-2xl font-bold mb-1">{value}</div>     {" "}
      <div className="text-sm text-gray-400">{title}</div>     {" "}
      <div className="text-xs text-gray-500 mt-1">{desc}</div>   {" "}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
            {/* Header */}     {" "}
      <header className="border-b border-blue-800/30 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-50">
               {" "}
        <div className="max-w-7xl mx-auto px-4 py-4">
                   {" "}
          <div className="flex items-center justify-between">
                       {" "}
            <div className="flex items-center gap-3">
                           {" "}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                                <BarChart3 className="w-8 h-8" />             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    StatsCalcio AI                {" "}
                </h1>
                               {" "}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <span>Analisi in Tempo Reale</span>         
                         {" "}
                  {apiConnected ? (
                    <span className="flex items-center gap-1 text-green-400">
                                            <Wifi className="w-3 h-3" />       
                                    Live                    {" "}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-yellow-400">
                                            <WifiOff className="w-3 h-3" />     
                                      Demo                    {" "}
                    </span>
                  )}
                                 {" "}
                </div>
                             {" "}
              </div>
                         {" "}
            </div>
                                    {" "}
            <div className="flex items-center gap-4">
                            {/* Last Update */}             {" "}
              {lastUpdate && (
                <div className="hidden md:block text-xs text-gray-400">
                                    Agg:{" "}
                  {lastUpdate.toLocaleTimeString("it-IT")}               {" "}
                </div>
              )}
                                           {/* Refresh Button */}             {" "}
              <button
                onClick={() => {
                  fetchMatches();
                  fetchLiveMatches();
                }}
                disabled={loading}
                className="p-2 hover:bg-slate-800 rounded-lg transition-all disabled:opacity-50"
              >
                               {" "}
                <RefreshCw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
                             {" "}
              </button>
                                          {" "}
              <div className="relative hidden md:block">
                               {" "}
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                               {" "}
                <input
                  type="text"
                  placeholder="Cerca squadra..."
                  className="pl-10 pr-4 py-2 bg-slate-800/50 border border-blue-700/30 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64"
                />
                             {" "}
              </div>
                                           {/* Notifications */}             {" "}
              <div className="relative">
                               {" "}
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-slate-800 rounded-lg transition-all"
                >
                                    <Bell className="w-5 h-5" />               
                   {" "}
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                                 {" "}
                </button>
                                                {" "}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-blue-800/30 rounded-xl shadow-xl max-h-96 overflow-y-auto">
                                       {" "}
                    <div className="p-4 border-b border-blue-800/30 flex items-center justify-between">
                                           {" "}
                      <h3 className="font-bold">Notifiche</h3>                 
                         {" "}
                      <button onClick={() => setShowNotifications(false)}>
                                                <X className="w-4 h-4" />       
                                     {" "}
                      </button>
                                         {" "}
                    </div>
                                       {" "}
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-400 text-sm">
                                                Nessuna notifica                
                             {" "}
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`p-4 border-b border-blue-800/10 hover:bg-slate-800/50 cursor-pointer transition-all ${
                            !notif.read ? "bg-blue-900/20" : ""
                          }`}
                        >
                                                   {" "}
                          <div className="flex items-start gap-3">
                                                       {" "}
                            <div
                              className={`p-2 rounded-lg ${
                                notif.type === "success"
                                  ? "bg-green-600/20 text-green-400"
                                  : notif.type === "warning"
                                  ? "bg-yellow-600/20 text-yellow-400"
                                  : "bg-blue-600/20 text-blue-400"
                              }`}
                            >
                                                           {" "}
                              {notif.type === "success" ? (
                                <Check className="w-4 h-4" />
                              ) : notif.type === "warning" ? (
                                <AlertCircle className="w-4 h-4" />
                              ) : (
                                <Bell className="w-4 h-4" />
                              )}
                                                         {" "}
                            </div>
                                                       {" "}
                            <div className="flex-1">
                                                           {" "}
                              <div className="font-medium text-sm">
                                {notif.title}
                              </div>
                                                           {" "}
                              <div className="text-xs text-gray-400 mt-1">
                                {notif.message}
                              </div>
                                                           {" "}
                              <div className="text-xs text-gray-500 mt-1">
                                {notif.time}
                              </div>
                                                         {" "}
                            </div>
                                                     {" "}
                          </div>
                                                 {" "}
                        </div>
                      ))
                    )}
                                     {" "}
                  </div>
                )}
                             {" "}
              </div>
                                          {" "}
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-all">
                                Premium              {" "}
              </button>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </header>
           {" "}
      <div className="max-w-7xl mx-auto px-4 py-6">
                {/* API Status Banner */}       {" "}
        {!apiConnected && (
          <div className="mb-6 bg-yellow-600/20 border border-yellow-500/30 rounded-xl p-4">
                       {" "}
            <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-400" /> 
                         {" "}
              <div className="flex-1">
                               {" "}
                <div className="font-bold text-sm">Modalità Demo Attiva</div>   
                           {" "}
                <div className="text-xs text-gray-300 mt-1">
                                    Per utilizzare dati reali, configura la tua
                  API key da                   {" "}
                  <a
                    href="https://rapidapi.com/api-sports/api/api-football"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline ml-1"
                  >
                                        API-Football                  {" "}
                  </a>
                                 {" "}
                </div>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
        )}
                {/* Navigation Tabs */}       {" "}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                   {" "}
          {[
            { id: "matches", label: "Partite", icon: Trophy },
            { id: "predictions", label: "Predizioni AI", icon: Brain },
            { id: "standings", label: "Classifica", icon: Users },
            { id: "stats", label: "Statistiche Avanzate", icon: BarChart3 },
            { id: "performance", label: "Performance", icon: LineChart },
            {
              id: "live",
              label: `Live (${liveMatches.length})`,
              icon: Activity,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/50"
                  : "bg-slate-800/50 hover:bg-slate-800"
              }`}
            >
                            <tab.icon className="w-4 h-4" />             {" "}
              {tab.label}           {" "}
            </button>
          ))}
                 {" "}
        </div>
                {/* League Selector */}       {" "}
        <div className="mb-6 bg-slate-800/50 border border-blue-800/30 rounded-xl p-4">
                   {" "}
          <div className="flex items-center gap-2 mb-3">
                        <Trophy className="w-5 h-5 text-yellow-400" />         
              <h3 className="font-bold">Seleziona Campionato</h3>         {" "}
          </div>
                   {" "}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                       {" "}
            {leagues.map((league) => (
              <button
                key={league.id}
                onClick={() => handleLeagueChange(league.id)}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  selectedLeague === league.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
                    : "bg-slate-900/50 hover:bg-slate-800 border border-blue-800/20"
                }`}
              >
                               {" "}
                <div className="text-2xl mb-1">{league.country}</div>           
                    <div className="text-xs">{league.name}</div>             {" "}
              </button>
            ))}
                     {" "}
          </div>
                 {" "}
        </div>
                {/* Loading State */}       {" "}
        {loading && (
          <div className="text-center py-12">
                       {" "}
            <RefreshCw className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
                        <p className="text-gray-400">Caricamento dati...</p>   
                 {" "}
          </div>
        )}
                {/* Matches Tab */}       {" "}
        {activeTab === "matches" && !loading && (
          <div className="grid lg:grid-cols-3 gap-6">
                       {" "}
            <div className="lg:col-span-2 space-y-4">
                           {" "}
              <div className="flex items-center justify-between mb-4">
                               {" "}
                <h2 className="text-xl font-bold flex items-center gap-2">
                                   {" "}
                  <Trophy className="w-5 h-5 text-yellow-500" />               
                    Partite di Oggi ({matches.length})                {" "}
                </h2>
                               {" "}
                {apiConnected && (
                  <span className="text-xs px-3 py-1 bg-green-600/20 text-green-400 rounded-full border border-green-500/30">
                                        Dati Live API                  {" "}
                  </span>
                )}
                             {" "}
              </div>
                                          {" "}
              {matches.length === 0 ? (
                <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-8 text-center">
                                   {" "}
                  <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />   
                               {" "}
                  <p className="text-gray-400">
                    Nessuna partita programmata per oggi
                  </p>
                                 {" "}
                </div>
              ) : (
                matches.map((match) => (
                  <div
                    key={match.id}
                    className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-4 hover:border-blue-600/50 transition-all"
                  >
                                       {" "}
                    <div className="flex items-center justify-between mb-3">
                                           {" "}
                      <div className="flex items-center gap-2">
                                               {" "}
                        <span className="text-xs text-gray-400">
                          {match.time}
                        </span>
                                               {" "}
                        {match.leagueName && (
                          <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full border border-blue-500/30">
                                                        {match.leagueName}     
                                               {" "}
                          </span>
                        )}
                                             {" "}
                      </div>
                                           {" "}
                      <button
                        onClick={() => analyzeWithAI(match)}
                        className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-xs font-medium hover:from-purple-500 hover:to-blue-500 transition-all"
                      >
                                                <Brain className="w-3 h-3" />   
                                            Analizza                      {" "}
                      </button>
                                         {" "}
                    </div>
                                       {" "}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                                           {" "}
                      <div className="text-center">
                                               {" "}
                        {match.homeLogo && (
                          <img
                            src={match.homeLogo}
                            alt={match.home}
                            className="w-8 h-8 mx-auto mb-2"
                          />
                        )}
                                               {" "}
                        <div className="font-bold text-sm mb-1">
                          {match.home}
                        </div>
                                               {" "}
                        <div className="text-2xl font-bold text-blue-400">
                          {match.homeOdds}
                        </div>
                                               {" "}
                        <div className="text-xs text-gray-400 mt-1">1</div>     
                                       {" "}
                      </div>
                                                                  {" "}
                      <div className="text-center flex flex-col justify-center">
                                               {" "}
                        <div className="text-sm text-gray-400 mb-1">VS</div>   
                                           {" "}
                        <div className="text-xl font-bold text-gray-400">
                          {match.drawOdds}
                        </div>
                                               {" "}
                        <div className="text-xs text-gray-400 mt-1">X</div>     
                                       {" "}
                      </div>
                                                                  {" "}
                      <div className="text-center">
                                               {" "}
                        {match.awayLogo && (
                          <img
                            src={match.awayLogo}
                            alt={match.away}
                            className="w-8 h-8 mx-auto mb-2"
                          />
                        )}
                                               {" "}
                        <div className="font-bold text-sm mb-1">
                          {match.away}
                        </div>
                                               {" "}
                        <div className="text-2xl font-bold text-purple-400">
                          {match.awayOdds}
                        </div>
                                               {" "}
                        <div className="text-xs text-gray-400 mt-1">2</div>     
                                       {" "}
                      </div>
                                         {" "}
                    </div>
                                       {" "}
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/20">
                                           {" "}
                      <div className="flex items-center gap-2">
                                               {" "}
                        <Brain className="w-4 h-4 text-purple-400" />           
                                   {" "}
                        <span className="text-sm font-medium">AI:</span>       
                                       {" "}
                        <span className="font-bold text-purple-400">
                          {match.aiPrediction}
                        </span>
                                             {" "}
                      </div>
                                           {" "}
                      <div className="flex items-center gap-2">
                                               {" "}
                        <Target className="w-4 h-4 text-green-400" />           
                                   {" "}
                        <span className="text-sm">
                                                   {" "}
                          <span className="font-bold text-green-400">
                            {match.confidence}%
                          </span>
                                                 {" "}
                        </span>
                                             {" "}
                      </div>
                                         {" "}
                    </div>
                                       {" "}
                    <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                                           {" "}
                      <div className="text-center p-2 bg-slate-900/50 rounded">
                                               {" "}
                        <div className="text-gray-400">Forma Casa</div>         
                                     {" "}
                        <div className="font-bold text-blue-400">
                          {match.stats.homeForm}%
                        </div>
                                             {" "}
                      </div>
                                           {" "}
                      <div className="text-center p-2 bg-slate-900/50 rounded">
                                               {" "}
                        <div className="text-gray-400">Forma Trasferta</div>   
                                           {" "}
                        <div className="font-bold text-purple-400">
                          {match.stats.awayForm}%
                        </div>
                                             {" "}
                      </div>
                                           {" "}
                      <div className="text-center p-2 bg-slate-900/50 rounded">
                                               {" "}
                        <div className="text-gray-400">H2H</div>               
                               {" "}
                        <div className="font-bold">{match.stats.h2h}</div>     
                                       {" "}
                      </div>
                                         {" "}
                    </div>
                                     {" "}
                  </div>
                ))
              )}
                         {" "}
            </div>
                        {/* AI Analysis Sidebar */}           {" "}
            <div className="space-y-6">
                           {" "}
              {aiAnalyzing ? (
                <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
                                   {" "}
                  <div className="text-center">
                                       {" "}
                    <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-pulse" />
                                       {" "}
                    <h3 className="font-bold mb-2">AI sta analizzando...</h3>   
                                   {" "}
                    <p className="text-sm text-gray-400">
                      Elaborazione dati + H2H in corso
                    </p>
                                     {" "}
                  </div>
                                 {" "}
                </div>
              ) : aiAnalysis ? (
                // Il contenitore principale che risolve l'errore di elementi adiacenti
                <div className="space-y-6">
                                    {/* 1. Main AI Analysis Card */}           
                       {" "}
                  <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6">
                                       {" "}
                    <div className="flex items-center gap-2 mb-4">
                                           {" "}
                      <Brain className="w-6 h-6 text-purple-400" />             
                              <h3 className="text-xl font-bold">Analisi AI</h3> 
                                         {" "}
                      {aiAnalysis.realData && (
                        <span className="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded-full">
                                                    Dati Reali                  
                               {" "}
                        </span>
                      )}
                                           {" "}
                      {aiAnalysis.hasH2H && (
                        <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full">
                                                    + H2H                      
                           {" "}
                        </span>
                      )}
                                         {" "}
                    </div>
                                                            {" "}
                    {aiAnalysis.venue && (
                      <div className="mb-4 text-sm text-gray-400">
                                                📍 {aiAnalysis.venue}           
                                 {" "}
                      </div>
                    )}
                                                            {" "}
                    <div className="space-y-4">
                                           {" "}
                      <div>
                                               {" "}
                        <h4 className="font-bold text-sm text-purple-400 mb-2">
                          Key Points
                        </h4>
                                               {" "}
                        <ul className="space-y-2">
                                                   {" "}
                          {aiAnalysis.keyPoints.map((point, idx) => (
                            <li
                              key={idx}
                              className="text-sm flex items-start gap-2"
                            >
                                                           {" "}
                              <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                                            <span>{point}</span>
                                                         {" "}
                            </li>
                          ))}
                                                 {" "}
                        </ul>
                                             {" "}
                      </div>
                                           {" "}
                      <div className="border-t border-blue-800/30 pt-4">
                                               {" "}
                        <h4 className="font-bold text-sm text-blue-400 mb-2">
                          Analisi Tattica
                        </h4>
                                               {" "}
                        <div className="space-y-2 text-sm">
                                                   {" "}
                          <p>
                            <span className="text-gray-400">Casa:</span>{" "}
                            {aiAnalysis.tacticalAnalysis.home}
                          </p>
                                                   {" "}
                          <p>
                            <span className="text-gray-400">Trasferta:</span>{" "}
                            {aiAnalysis.tacticalAnalysis.away}
                          </p>
                                                 {" "}
                        </div>
                                             {" "}
                      </div>
                                           {" "}
                      <div className="border-t border-blue-800/30 pt-4">
                                               {" "}
                        <h4 className="font-bold text-sm text-green-400 mb-2">
                          Predizioni
                        </h4>
                                               {" "}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                   {" "}
                          {Object.entries(aiAnalysis.predictions).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="bg-slate-900/50 p-2 rounded"
                              >
                                                             {" "}
                                <div className="text-gray-400 capitalize">
                                  {key}
                                </div>
                                                             {" "}
                                <div className="font-bold text-green-400">
                                  {value}
                                </div>
                                                           {" "}
                              </div>
                            )
                          )}
                                                 {" "}
                        </div>
                                             {" "}
                      </div>
                                           {" "}
                      <div className="border-t border-blue-800/30 pt-4">
                                               {" "}
                        <h4 className="font-bold text-sm text-yellow-400 mb-2">
                          Value Rating
                        </h4>
                                               {" "}
                        {Object.entries(aiAnalysis.valueRatings).map(
                          ([key, data]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between mb-2"
                            >
                                                         {" "}
                              <span className="text-sm capitalize">{key}</span> 
                                                       {" "}
                              <div className="flex items-center gap-2">
                                                             {" "}
                                <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                                 {" "}
                                  <div
                                    className="h-full bg-gradient-to-r from-yellow-500 to-green-500"
                                    style={{
                                      width: `${(data.rating / 10) * 100}%`,
                                    }}
                                  />
                                                               {" "}
                                </div>
                                                             {" "}
                                <span className="text-xs font-bold">
                                  {data.rating}
                                </span>
                                                           {" "}
                              </div>
                                                       {" "}
                            </div>
                          )
                        )}
                                             {" "}
                      </div>
                                         {" "}
                    </div>
                                     {" "}
                  </div>
                                   {" "}
                  {/* 2. H2H Statistics Card (Solo se i dati sono presenti) */} 
                                 {" "}
                  {h2hData && (
                    <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-xl p-6">
                                           {" "}
                      <div className="flex items-center gap-2 mb-4">
                                               {" "}
                        <Target className="w-6 h-6 text-cyan-400" />           
                                   {" "}
                        <h3 className="text-xl font-bold">Scontri Diretti</h3> 
                                             {" "}
                        <span className="text-xs text-gray-400">
                                                    (Ultimi{" "}
                          {h2hData.totalMatches})                        {" "}
                        </span>
                                             {" "}
                      </div>
                                            {/* Win/Draw/Loss Distribution */} 
                                         {" "}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                                               {" "}
                        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 text-center">
                                                   {" "}
                          <div className="text-2xl font-bold text-blue-400">
                            {h2hData.team1Wins}
                          </div>
                                                   {" "}
                          <div className="text-xs text-gray-400 mt-1">
                            Vittorie Casa
                          </div>
                                                   {" "}
                          <div className="text-xs text-blue-400 font-semibold">
                            {h2hData.team1WinPercentage}%
                          </div>
                                                 {" "}
                        </div>
                                               {" "}
                        <div className="bg-gray-600/20 border border-gray-500/30 rounded-lg p-3 text-center">
                                                   {" "}
                          <div className="text-2xl font-bold text-gray-400">
                            {h2hData.draws}
                          </div>
                                                   {" "}
                          <div className="text-xs text-gray-400 mt-1">
                            Pareggi
                          </div>
                                                   {" "}
                          <div className="text-xs text-gray-400 font-semibold">
                            {h2hData.drawPercentage}%
                          </div>
                                               {" "}
                        </div>
                                               {" "}
                        <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-3 text-center">
                                                   {" "}
                          <div className="text-2xl font-bold text-purple-400">
                            {h2hData.team2Wins}
                          </div>
                                                   {" "}
                          <div className="text-xs text-gray-400 mt-1">
                            Vittorie Trasferta
                          </div>
                                                   {" "}
                          <div className="text-xs text-purple-400 font-semibold">
                            {h2hData.team2WinPercentage}%
                          </div>
                                                 {" "}
                        </div>
                                             {" "}
                      </div>
                                            {/* H2H Pie Chart */}               
                           {" "}
                      <div className="w-full h-64 mb-4">
                                               {" "}
                        <h4 className="font-bold text-sm text-cyan-400 mb-2">
                          Distribuzione Vittorie H2H
                        </h4>
                                               {" "}
                        <ResponsiveContainer width="100%" height="90%">
                                                   {" "}
                          <RechartsPieChart>
                                                       {" "}
                            <Pie
                              data={getH2hPieData(h2hData)}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${(percent * 100).toFixed(0)}%`
                              }
                            >
                                                           {" "}
                              {getH2hPieData(h2hData).map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                                                         {" "}
                            </Pie>
                                                        <Tooltip />             
                                         {" "}
                            <Legend wrapperStyle={{ fontSize: "12px" }} />     
                                               {" "}
                          </RechartsPieChart>
                                                 {" "}
                        </ResponsiveContainer>
                                             {" "}
                      </div>
                                            {/* Goals Statistics */}           
                               {" "}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                                               {" "}
                        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                                                   {" "}
                          <div className="text-lg font-bold text-green-400">
                            {h2hData.avgGoals}
                          </div>
                                                   {" "}
                          <div className="text-xs text-gray-400">Media Gol</div>
                                                 {" "}
                        </div>
                                               {" "}
                        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                                                   {" "}
                          <div className="text-lg font-bold text-yellow-400">
                            {h2hData.over25Percentage}%
                          </div>
                                                   {" "}
                          <div className="text-xs text-gray-400">Over 2.5</div> 
                                               {" "}
                        </div>
                                               {" "}
                        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                                                   {" "}
                          <div className="text-lg font-bold text-orange-400">
                            {h2hData.bttsPercentage}%
                          </div>
                                                   {" "}
                          <div className="text-xs text-gray-400">BTTS</div>     
                                           {" "}
                        </div>
                                             {" "}
                      </div>
                                            {/* Last 5 Matches */}             
                             {" "}
                      <div>
                                               {" "}
                        <h4 className="font-bold text-sm text-cyan-400 mb-3">
                          Ultimi 5 Scontri
                        </h4>
                                               {" "}
                        <div className="space-y-2">
                                                   {" "}
                          {h2hData.lastMatches.map((match, idx) => (
                            <div
                              key={idx}
                              className="bg-slate-900/50 rounded-lg p-3"
                            >
                                                           {" "}
                              <div className="flex items-center justify-between mb-1">
                                                               {" "}
                                <span className="text-xs text-gray-400">
                                  {match.date}
                                </span>
                                                               {" "}
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    match.winner === "home"
                                      ? "bg-blue-600"
                                      : match.winner === "away"
                                      ? "bg-purple-600"
                                      : "bg-gray-600"
                                  }`}
                                >
                                                                   {" "}
                                  {match.winner === "home"
                                    ? "H"
                                    : match.winner === "away"
                                    ? "A"
                                    : "D"}
                                                                 {" "}
                                </div>
                                                             {" "}
                              </div>
                                                           {" "}
                              <div className="grid grid-cols-7 gap-2 items-center text-sm">
                                                               {" "}
                                <div className="col-span-3 text-right">
                                                                   {" "}
                                  <span
                                    className={
                                      match.winner === "home"
                                        ? "font-bold text-blue-400"
                                        : ""
                                    }
                                  >
                                                                       {" "}
                                    {match.homeTeam}                           
                                         {" "}
                                  </span>
                                                                 {" "}
                                </div>
                                                               {" "}
                                <div className="col-span-1 text-center font-bold">
                                                                   {" "}
                                  <span
                                    className={
                                      match.winner === "home"
                                        ? "text-blue-400"
                                        : "text-gray-400"
                                    }
                                  >
                                                                       {" "}
                                    {match.homeScore}                           
                                         {" "}
                                  </span>
                                                                   {" "}
                                  <span className="text-gray-600 mx-1">-</span> 
                                                                 {" "}
                                  <span
                                    className={
                                      match.winner === "away"
                                        ? "text-purple-400"
                                        : "text-gray-400"
                                    }
                                  >
                                                                       {" "}
                                    {match.awayScore}                           
                                         {" "}
                                  </span>
                                                                 {" "}
                                </div>
                                                               {" "}
                                <div className="col-span-3">
                                                                   {" "}
                                  <span
                                    className={
                                      match.winner === "away"
                                        ? "font-bold text-purple-400"
                                        : ""
                                    }
                                  >
                                                                       {" "}
                                    {match.awayTeam}                           
                                         {" "}
                                  </span>
                                                                 {" "}
                                </div>
                                                             {" "}
                              </div>
                                                         {" "}
                            </div>
                          ))}
                                                 {" "}
                        </div>
                                             {" "}
                      </div>
                                         {" "}
                    </div>
                  )}
                                 {" "}
                </div>
              ) : (
                <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
                                   {" "}
                  <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" /> 
                                 {" "}
                  <h3 className="font-bold text-center mb-2">
                    Analisi AI + H2H
                  </h3>
                                   {" "}
                  <p className="text-sm text-gray-400 text-center">
                                        Clicca "Analizza" su una partita per
                    un'analisi dettagliata con statistiche scontri diretti      
                               {" "}
                  </p>
                                 {" "}
                </div>
              )}
                         {" "}
            </div>
                     {" "}
          </div>
        )}
                {/* Live Tab */}       {" "}
        {activeTab === "live" && (
          <div className="space-y-6">
                       {" "}
            <div className="flex items-center justify-between mb-4">
                           {" "}
              <h2 className="text-2xl font-bold flex items-center gap-2">
                               {" "}
                <Activity className="w-6 h-6 text-red-400 animate-pulse" />     
                          Partite Live ({liveMatches.length})              {" "}
              </h2>
                           {" "}
              <button
                onClick={fetchLiveMatches}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all"
              >
                                <RefreshCw className="w-4 h-4" />               
                Aggiorna              {" "}
              </button>
                         {" "}
            </div>
                                    {" "}
            {liveMatches.length === 0 ? (
              <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-8 text-center">
                               {" "}
                <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />   
                           {" "}
                <p className="text-gray-400">Nessuna partita live al momento</p>
                             {" "}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                               {" "}
                {liveMatches.map((match) => (
                  <div
                    key={match.id}
                    className="bg-slate-800/50 border border-red-500/30 rounded-xl p-6"
                  >
                                       {" "}
                    <div className="flex items-center justify-between mb-4">
                                           {" "}
                      <span className="flex items-center gap-2">
                                               {" "}
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                               {" "}
                        <span className="text-sm font-bold text-red-400">
                                                   {" "}
                          {match.status === "HT" ? "INTERVALLO" : "LIVE"}       
                                         {" "}
                        </span>
                                             {" "}
                      </span>
                                           {" "}
                      <span className="text-sm font-bold">
                                               {" "}
                        {match.status === "HT" ? "HT" : `${match.time}'`}       
                                     {" "}
                      </span>
                                         {" "}
                    </div>
                                       {" "}
                    <div className="grid grid-cols-3 gap-4 text-center">
                                           {" "}
                      <div>
                                               {" "}
                        <div className="font-bold text-lg mb-2">
                          {match.home}
                        </div>
                                               {" "}
                        <div className="text-4xl font-bold text-blue-400">
                          {match.homeScore}
                        </div>
                                             {" "}
                      </div>
                                           {" "}
                      <div className="flex items-center justify-center">
                                               {" "}
                        <span className="text-2xl text-gray-400">-</span>       
                                     {" "}
                      </div>
                                           {" "}
                      <div>
                                               {" "}
                        <div className="font-bold text-lg mb-2">
                          {match.away}
                        </div>
                                               {" "}
                        <div className="text-4xl font-bold text-purple-400">
                          {match.awayScore}
                        </div>
                                             {" "}
                      </div>
                                         {" "}
                    </div>
                                     {" "}
                  </div>
                ))}
                             {" "}
              </div>
            )}
                     {" "}
          </div>
        )}
                {/* Standings Tab */}       {" "}
        {activeTab === "standings" && (
          <div className="space-y-6">
                       {" "}
            <div className="flex items-center justify-between mb-4">
                           {" "}
              <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Users className="w-6 h-6 text-blue-400" />     
                          Classifica -{" "}
                {leagues.find((l) => l.id === selectedLeague)?.name}           
                 {" "}
              </h2>
                           {" "}
              <button
                onClick={() => fetchStandings(selectedLeague)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all"
              >
                                <RefreshCw className="w-4 h-4" />               
                Aggiorna              {" "}
              </button>
                         {" "}
            </div>
                       {" "}
            {standings.length === 0 ? (
              <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-8 text-center">
                               {" "}
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />     
                         {" "}
                <p className="text-gray-400">Classifica non disponibile</p>     
                       {" "}
              </div>
            ) : (
              <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl overflow-hidden">
                               {" "}
                <div className="overflow-x-auto">
                                   {" "}
                  <table className="w-full">
                                       {" "}
                    <thead className="bg-slate-900/50">
                                           {" "}
                      <tr className="text-left text-xs text-gray-400">
                                               {" "}
                        <th className="p-4 font-semibold">#</th>               
                                <th className="p-4 font-semibold">Squadra</th> 
                                             {" "}
                        <th className="p-4 font-semibold text-center">G</th>   
                                           {" "}
                        <th className="p-4 font-semibold text-center">V</th>   
                                           {" "}
                        <th className="p-4 font-semibold text-center">P</th>   
                                           {" "}
                        <th className="p-4 font-semibold text-center">S</th>   
                                           {" "}
                        <th className="p-4 font-semibold text-center">GF</th>   
                                           {" "}
                        <th className="p-4 font-semibold text-center">GS</th>   
                                           {" "}
                        <th className="p-4 font-semibold text-center">DR</th>   
                                           {" "}
                        <th className="p-4 font-semibold text-center">Pt</th>   
                                           {" "}
                        <th className="p-4 font-semibold text-center">Forma</th>
                                             {" "}
                      </tr>
                                         {" "}
                    </thead>
                                       {" "}
                    <tbody>
                                           {" "}
                      {standings.map((team, idx) => (
                        <tr
                          key={team.team.id}
                          className={`border-t border-blue-800/20 hover:bg-slate-800/50 transition-all ${
                            idx < 4
                              ? "bg-green-900/10"
                              : idx < 6
                              ? "bg-blue-900/10"
                              : idx >= standings.length - 3
                              ? "bg-red-900/10"
                              : ""
                          }`}
                        >
                                                   {" "}
                          <td className="p-4">
                                                       {" "}
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                idx < 4
                                  ? "bg-green-600/20 text-green-400"
                                  : idx < 6
                                  ? "bg-blue-600/20 text-blue-400"
                                  : idx >= standings.length - 3
                                  ? "bg-red-600/20 text-red-400"
                                  : "bg-slate-700 text-gray-400"
                              }`}
                            >
                                                            {team.rank}         
                                               {" "}
                            </div>
                                                     {" "}
                          </td>
                                                   {" "}
                          <td className="p-4">
                                                       {" "}
                            <div className="flex items-center gap-3">
                                                           {" "}
                              <img
                                src={team.team.logo}
                                alt={team.team.name}
                                className="w-8 h-8"
                              />
                                                           {" "}
                              <span className="font-semibold">
                                {team.team.name}
                              </span>
                                                         {" "}
                            </div>
                                                     {" "}
                          </td>
                                                   {" "}
                          <td className="p-4 text-center text-gray-400">
                            {team.all.played}
                          </td>
                                                   {" "}
                          <td className="p-4 text-center text-green-400 font-semibold">
                            {team.all.win}
                          </td>
                                                   {" "}
                          <td className="p-4 text-center text-gray-400">
                            {team.all.draw}
                          </td>
                                                   {" "}
                          <td className="p-4 text-center text-red-400 font-semibold">
                            {team.all.lose}
                          </td>
                                                   {" "}
                          <td className="p-4 text-center text-gray-300">
                            {team.all.goals.for}
                          </td>
                                                   {" "}
                          <td className="p-4 text-center text-gray-300">
                            {team.all.goals.against}
                          </td>
                                                   {" "}
                          <td className="p-4 text-center">
                                                       {" "}
                            <span
                              className={
                                team.goalsDiff >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }
                            >
                                                           {" "}
                              {team.goalsDiff > 0 ? "+" : ""}
                              {team.goalsDiff}                           {" "}
                            </span>
                                                     {" "}
                          </td>
                                                   {" "}
                          <td className="p-4 text-center">
                                                       {" "}
                            <span className="text-lg font-bold text-blue-400">
                              {team.points}
                            </span>
                                                     {" "}
                          </td>
                                                   {" "}
                          <td className="p-4">
                                                       {" "}
                            <div className="flex gap-1 justify-center">
                                                           {" "}
                              {team.form
                                ?.split("")
                                .slice(-5)
                                .map((result, i) => (
                                  <div
                                    key={i}
                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                      result === "W"
                                        ? "bg-green-600 text-white"
                                        : result === "D"
                                        ? "bg-gray-600 text-white"
                                        : "bg-red-600 text-white"
                                    }`}
                                  >
                                                                      {result} 
                                                                 {" "}
                                  </div>
                                ))}
                                                         {" "}
                            </div>
                                                     {" "}
                          </td>
                                                 {" "}
                        </tr>
                      ))}
                                         {" "}
                    </tbody>
                                     {" "}
                  </table>
                                 {" "}
                </div>
                                                {" "}
                <div className="p-4 bg-slate-900/30 border-t border-blue-800/20">
                                   {" "}
                  <div className="flex flex-wrap gap-4 text-xs">
                                       {" "}
                    <div className="flex items-center gap-2">
                                           {" "}
                      <div className="w-3 h-3 rounded-full bg-green-600"></div> 
                                         {" "}
                      <span className="text-gray-400">Champions League</span>   
                                     {" "}
                    </div>
                                       {" "}
                    <div className="flex items-center gap-2">
                                           {" "}
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div> 
                                         {" "}
                      <span className="text-gray-400">Europa League</span>     
                                   {" "}
                    </div>
                                       {" "}
                    <div className="flex items-center gap-2">
                                           {" "}
                      <div className="w-3 h-3 rounded-full bg-red-600"></div>   
                                       {" "}
                      <span className="text-gray-400">Retrocessione</span>     
                                   {" "}
                    </div>
                                     {" "}
                  </div>
                                 {" "}
                </div>
                             {" "}
              </div>
            )}
                     {" "}
          </div>
        )}
                {/* Predictions Tab */}       {" "}
        {activeTab === "predictions" && (
          <div className="grid lg:grid-cols-2 gap-6">
                       {" "}
            <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
                           {" "}
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-400" />     
                          Top Predizioni AI              {" "}
              </h3>
                           {" "}
              <div className="space-y-4">
                               {" "}
                {[
                  {
                    match: "Inter vs Milan",
                    pred: "1X",
                    prob: 78,
                    value: "Alta",
                    odds: 1.65,
                  },
                  {
                    match: "Real Madrid vs Barcelona",
                    pred: "Over 2.5",
                    prob: 82,
                    value: "Media",
                    odds: 1.75,
                  },
                  {
                    match: "Man City vs Arsenal",
                    pred: "1",
                    prob: 71,
                    value: "Alta",
                    odds: 2.1,
                  },
                ].map((p, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/50 border border-blue-800/20 rounded-lg p-4"
                  >
                                       {" "}
                    <div className="flex items-center justify-between mb-3">
                                           {" "}
                      <span className="font-bold">{p.match}</span>             
                             {" "}
                      <span className="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded-full">
                                                Value: {p.value}               
                             {" "}
                      </span>
                                         {" "}
                    </div>
                                       {" "}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                                           {" "}
                      <div>
                                               {" "}
                        <div className="text-xs text-gray-400">Predizione</div> 
                                             {" "}
                        <div className="font-bold text-purple-400">
                          {p.pred}
                        </div>
                                             {" "}
                      </div>
                                           {" "}
                      <div>
                                               {" "}
                        <div className="text-xs text-gray-400">Probabilità</div>
                                               {" "}
                        <div className="font-bold text-green-400">
                          {p.prob}%
                        </div>
                                             {" "}
                      </div>
                                           {" "}
                      <div>
                                               {" "}
                        <div className="text-xs text-gray-400">Quota</div>     
                                         {" "}
                        <div className="font-bold text-blue-400">{p.odds}</div> 
                                           {" "}
                      </div>
                                         {" "}
                    </div>
                                       {" "}
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                           {" "}
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${p.prob}%` }}
                      />
                                         {" "}
                    </div>
                                     {" "}
                  </div>
                ))}
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
                           {" "}
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-red-400" />   
                            Statistiche Predizioni              {" "}
              </h3>
                           {" "}
              <div className="grid grid-cols-2 gap-4">
                               {" "}
                <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-4">
                                   {" "}
                  <div className="text-3xl font-bold text-green-400">87%</div> 
                                 {" "}
                  <div className="text-sm text-gray-300">Accuratezza</div>     
                           {" "}
                </div>
                               {" "}
                <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-4">
                                   {" "}
                  <div className="text-3xl font-bold text-blue-400">342</div>   
                               {" "}
                  <div className="text-sm text-gray-300">Predizioni</div>       
                         {" "}
                </div>
                               {" "}
                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-4">
                                   {" "}
                  <div className="text-3xl font-bold text-purple-400">+24%</div>
                                   {" "}
                  <div className="text-sm text-gray-300">ROI Medio</div>       
                         {" "}
                </div>
                               {" "}
                <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg p-4">
                                   {" "}
                  <div className="text-3xl font-bold text-yellow-400">156</div> 
                                 {" "}
                  <div className="text-sm text-gray-300">Vittorie</div>         
                       {" "}
                </div>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
        )}
                {/* Stats Tab */}       {" "}
        {activeTab === "stats" && (
          <div className="space-y-6">
                       {" "}
            <h2 className="text-2xl font-bold flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-blue-400" />     
                      Statistiche Avanzate            {" "}
            </h2>
                                    {" "}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                           {" "}
              {Object.entries(advancedStats).map(([key, stat]) => (
                <StatCard
                  key={key}
                  icon={Target}
                  title={key.toUpperCase()}
                  {...stat}
                />
              ))}
                         {" "}
            </div>
                       {" "}
            <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
                           {" "}
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-purple-400" />
                                Confronto Multi-dimensionale (Radar Chart)      
                       {" "}
              </h3>
                           {" "}
              <ResponsiveContainer width="100%" height={400}>
                               {" "}
                <RadarChart data={radarData}>
                                    <PolarGrid stroke="#1e40af" />             
                      <PolarAngleAxis dataKey="stat" stroke="#94a3b8" />
                                    <PolarRadiusAxis stroke="#94a3b8" />       
                           {" "}
                  <Radar
                    name="Inter"
                    dataKey="inter"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                                   {" "}
                  <Radar
                    name="Milan"
                    dataKey="milan"
                    dataKey="milan"
                    stroke="#a855f7"
                    fill="#a855f7"
                    fillOpacity={0.6}
                  />
                                    <Legend />               {" "}
                </RadarChart>
                             {" "}
              </ResponsiveContainer>
                         {" "}
            </div>
                       {" "}
            <div className="grid lg:grid-cols-2 gap-6">
                           {" "}
              <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
                               {" "}
                <h3 className="text-xl font-bold mb-4">
                  Distribuzione Risultati Totale (Pie Chart)
                </h3>
                               {" "}
                <ResponsiveContainer width="100%" height={300}>
                                   {" "}
                  <RechartsPieChart>
                                       {" "}
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                                           {" "}
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                                         {" "}
                    </Pie>
                                        <Tooltip />                 {" "}
                  </RechartsPieChart>
                                 {" "}
                </ResponsiveContainer>
                             {" "}
              </div>
                           {" "}
              <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
                               {" "}
                <h3 className="text-xl font-bold mb-4">
                  Confronto Forma (Bar Chart)
                </h3>
                               {" "}
                <ResponsiveContainer width="100%" height={300}>
                                   {" "}
                  <BarChart data={formComparison}>
                                       {" "}
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" />   
                                    <XAxis dataKey="periodo" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" />             
                         {" "}
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #3b82f6",
                      }}
                    />
                                        <Legend />
                                        <Bar dataKey="inter" fill="#3b82f6" />
                                        <Bar dataKey="milan" fill="#a855f7" /> 
                                   {" "}
                  </BarChart>
                                 {" "}
                </ResponsiveContainer>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
        )}
                {/* Performance Tab */}       {" "}
        {activeTab === "performance" && (
          <div className="space-y-6">
                       {" "}
            <h2 className="text-2xl font-bold flex items-center gap-2">
                            <LineChart className="w-6 h-6 text-green-400" />   
                        Grafici di Performance            {" "}
            </h2>
                       {" "}
            <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
                           {" "}
              <h3 className="text-xl font-bold mb-4">
                Andamento Ultimi Match (Line Chart)
              </h3>
                           {" "}
              <ResponsiveContainer width="100%" height={350}>
                               {" "}
                <RechartsLineChart data={performanceData}>
                                   {" "}
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" />     
                              <XAxis dataKey="giornata" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />                 {" "}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #3b82f6",
                    }}
                  />
                                    <Legend />                 {" "}
                  <Line
                    type="monotone"
                    dataKey="punti"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                                   {" "}
                  <Line
                    type="monotone"
                    dataKey="gol"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                                   {" "}
                  <Line
                    type="monotone"
                    dataKey="xG"
                    stroke="#a855f7"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                                 {" "}
                </RechartsLineChart>
                             {" "}
              </ResponsiveContainer>
                         {" "}
            </div>
                       {" "}
            <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
                           {" "}
              <h3 className="text-xl font-bold mb-4">
                Trend Gol vs Expected Goals (Area Chart)
              </h3>
                           {" "}
              <ResponsiveContainer width="100%" height={300}>
                               {" "}
                <AreaChart data={performanceData}>
                                   {" "}
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" />     
                              <XAxis dataKey="giornata" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />                 {" "}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #3b82f6",
                    }}
                  />
                                   {" "}
                  <Area
                    type="monotone"
                    dataKey="gol"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                                   {" "}
                  <Area
                    type="monotone"
                    dataKey="xG"
                    stackId="2"
                    stroke="#a855f7"
                    fill="#a855f7"
                    fillOpacity={0.4}
                  />
                                 {" "}
                </AreaChart>
                             {" "}
              </ResponsiveContainer>
                         {" "}
            </div>
                                 {" "}
          </div>
        )}
             {" "}
      </div>
            {/* Footer */}     {" "}
      <footer className="border-t border-blue-800/30 bg-slate-900/50 mt-12">
               {" "}
        <div className="max-w-7xl mx-auto px-4 py-8">
                   {" "}
          <div className="grid md:grid-cols-4 gap-8">
                       {" "}
            <div>
                           {" "}
              <h4 className="font-bold mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-blue-400" /> 
                              StatsCalcio AI              {" "}
              </h4>
                           {" "}
              <p className="text-sm text-gray-400">
                                Piattaforma con integrazione API reale per
                statistiche e analisi calcistiche con intelligenza artificiale.
                             {" "}
              </p>
                         {" "}
            </div>
                                    {" "}
            <div>
                            <h4 className="font-bold mb-4">Funzionalità</h4>   
                       {" "}
              <ul className="space-y-2 text-sm text-gray-400">
                                <li>• Dati live da API-Football</li>           
                    <li>• Predizioni AI in tempo reale</li>               {" "}
                <li>• Statistiche avanzate</li>               {" "}
                <li>• Notifiche personalizzate</li>             {" "}
              </ul>
                         {" "}
            </div>
                                    {" "}
            <div>
                            <h4 className="font-bold mb-4">API Integration</h4> 
                         {" "}
              <ul className="space-y-2 text-sm text-gray-400">
                                <li>• API-Football (RapidAPI)</li>             
                  <li>• Aggiornamenti real-time</li>               {" "}
                <li>• Partite live</li>               {" "}
                <li>• Statistiche squadre</li>             {" "}
              </ul>
                         {" "}
            </div>
                                    {" "}
            <div>
                            <h4 className="font-bold mb-4">Supporto</h4>       
                   {" "}
              <ul className="space-y-2 text-sm text-gray-400">
                                <li>• Documentazione API</li>               {" "}
                <li>• Setup Guide</li>                <li>• FAQ</li>           
                    <li>• Contatti</li>             {" "}
              </ul>
                         {" "}
            </div>
                     {" "}
          </div>
                              {" "}
          <div className="border-t border-blue-800/30 mt-8 pt-8 text-center text-sm text-gray-400">
                       {" "}
            <p>
              © 2024 StatsCalcio AI - Powered by API-Football & Advanced Machine
              Learning
            </p>
                       {" "}
            <p className="mt-2 text-xs">
              Le quote e statistiche sono fornite a scopo informativo. API
              Status: {apiConnected ? "🟢 Connected" : "🟡 Demo Mode"}
            </p>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </footer>
         {" "}
    </div>
  );
};

export default FootballStatsAI;
