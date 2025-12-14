import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Header from "./components/Header";
import NavigationTabs from "./components/NavigationTabs";
import { LeagueSelector } from "./components/LeagueSelector";
import MatchCard from "./components/MatchCard";
import AIAnalysisPanel from "./components/AIAnalysisPanel";
import LiveMatches from "./components/LiveMatches";
import StandingsTable from "./components/StandingsTable";
import StatisticsCharts from "./components/StatisticsCharts";
import PerformanceCharts from "./components/PerformanceCharts";
import PredictionsPanel from "./components/PredictionsPanel";
import Footer from "./components/Footer";
import useFootballAPI from "./hooks/useFootballAPI";
import { useDemoData } from "./hooks/useDemoData";

const FootballStatsAI = () => {
  const [activeTab, setActiveTab] = useState("matches");
  const [selectedLeague, setSelectedLeague] = useState("135");
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [h2hData, setH2hData] = useState(null);
  const [loadingH2h, setLoadingH2h] = useState(false);

  const {
    loading,
    apiConnected,
    lastUpdate,
    fetchMatches: apiFetchMatches,
    fetchStandings: apiFetchStandings,
    fetchLiveMatches: apiFetchLiveMatches,
    fetchH2H: apiFetchH2H,
  } = useFootballAPI();

  const { getDemoMatches, getDemoLiveMatches } = useDemoData();

  // Notification system
  const addNotification = (type, title, message) => {
    const newNotif = {
      id: Date.now(),
      type,
      title,
      message,
      time: "Ora",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 10));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Fetch matches
  const loadMatches = async () => {
    const result = await apiFetchMatches(selectedLeague);
    if (result.success && result.data.length > 0) {
      setMatches(result.data);
      addNotification(
        "success",
        "Dati Aggiornati",
        `${result.data.length} partite caricate`
      );
    } else {
      setMatches(getDemoMatches());
      addNotification("info", "Modalità Demo", "Usando dati dimostrativi");
    }
  };

  // Fetch standings
  const loadStandings = async () => {
    const result = await apiFetchStandings(selectedLeague);
    if (result.success) {
      setStandings(result.data);
    }
  };

  // Fetch live matches
  const loadLiveMatches = async () => {
    const result = await apiFetchLiveMatches();
    if (result.success) {
      setLiveMatches(result.data);
    } else {
      setLiveMatches(getDemoLiveMatches());
    }
  };

  // AI Analysis
  const analyzeWithAI = async (match) => {
    setAiAnalyzing(true);
    setSelectedMatch(match);
    setH2hData(null);

    try {
      let h2hStats = null;
      if (match.homeId && match.awayId && apiConnected) {
        setLoadingH2h(true);
        const h2hResult = await apiFetchH2H(match.homeId, match.awayId);
        if (h2hResult.success) {
          h2hStats = h2hResult.data;
          setH2hData(h2hStats);
        }
        setLoadingH2h(false);
      }

      setTimeout(() => {
        const analysis = {
          summary: `Analisi approfondita basata su dati ${
            apiConnected ? "reali" : "demo"
          } di ${match.home} vs ${match.away}`,
          keyPoints: h2hStats
            ? [
                `Negli ultimi ${h2hStats.totalMatches} scontri diretti: ${h2hStats.team1Wins} vittorie ${match.home}, ${h2hStats.draws} pareggi, ${h2hStats.team2Wins} vittorie ${match.away}`,
                `Media gol negli scontri diretti: ${h2hStats.avgGoals} - Over 2.5 nel ${h2hStats.over25Percentage}% dei casi`,
                `Both Teams To Score verificato nel ${h2hStats.bttsPercentage}% delle partite`,
                `${match.home} ha una forma eccellente con ${match.stats.homeForm}% nelle ultime partite`,
              ]
            : [
                `${match.home} ha vinto 4 delle ultime 5 partite casalinghe`,
                `${match.away} ha subito gol in 8 delle ultime 10 trasferte`,
                "Il momentum attuale suggerisce un match ad alta intensità",
              ],
          tacticalAnalysis: {
            home: `${match.home} dovrebbe schierarsi con un modulo offensivo`,
            away: `${match.away} opterà per un approccio equilibrato`,
          },
          predictions: {
            risultatoEsatto: "2-1",
            golTotali: h2hStats
              ? `Over 2.5 (${h2hStats.over25Percentage}%)`
              : "Over 2.5 (78%)",
            corner: "Over 9.5 (65%)",
            cartellini: "Over 3.5 (72%)",
            btts: h2hStats
              ? `BTTS Sì (${h2hStats.bttsPercentage}%)`
              : "BTTS Sì (70%)",
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
          `Analisi per ${match.home} vs ${match.away}`
        );
      }, 2000);
    } catch (error) {
      console.error("Errore analisi:", error);
      setAiAnalyzing(false);
      addNotification("error", "Errore", "Impossibile completare l'analisi");
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadMatches();
    loadLiveMatches();
    loadStandings();
  };

  // Handle league change
  const handleLeagueChange = (leagueId) => {
    setSelectedLeague(leagueId);
    setMatches([]);
    setStandings([]);
  };

  // Initial load & auto-refresh
  useEffect(() => {
    loadMatches();
    loadLiveMatches();
    loadStandings();

    const interval = setInterval(loadLiveMatches, 60000);
    return () => clearInterval(interval);
  }, [selectedLeague]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <Header
        apiConnected={apiConnected}
        lastUpdate={lastUpdate}
        loading={loading}
        onRefresh={handleRefresh}
        notifications={notifications}
        onMarkAsRead={markAsRead}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* API Status Banner */}
        {!apiConnected && (
          <div className="mb-6 bg-yellow-600/20 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <div className="flex-1">
                <div className="font-bold text-sm">Modalità Demo Attiva</div>
                <div className="text-xs text-gray-300 mt-1">
                  Per utilizzare dati reali, configura la tua API key da
                  <a
                    href="https://rapidapi.com/api-sports/api/api-football"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline ml-1"
                  >
                    API-Football
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          liveCount={liveMatches.length}
        />
        <LeagueSelector
          selectedLeague={selectedLeague}
          onLeagueChange={handleLeagueChange}
        />

        {/* Matches Tab */}
        {activeTab === "matches" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  Partite di Oggi ({matches.length})
                </h2>
                {apiConnected && (
                  <span className="text-xs px-3 py-1 bg-green-600/20 text-green-400 rounded-full border border-green-500/30">
                    Dati Live API
                  </span>
                )}
              </div>
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onAnalyze={analyzeWithAI}
                />
              ))}
            </div>
            <div>
              <AIAnalysisPanel
                analyzing={aiAnalyzing}
                analysis={aiAnalysis}
                h2hData={h2hData}
                loadingH2h={loadingH2h}
              />
            </div>
          </div>
        )}

        {/* Live Tab */}
        {activeTab === "live" && <LiveMatches matches={liveMatches} />}

        {/* Standings Tab */}
        {activeTab === "standings" && <StandingsTable standings={standings} />}

        {/* Stats Tab */}
        {activeTab === "stats" && <StatisticsCharts />}

        {/* Performance Tab */}
        {activeTab === "performance" && <PerformanceCharts />}

        {/* Predictions Tab */}
        {activeTab === "predictions" && <PredictionsPanel />}
      </div>

      <Footer apiConnected={apiConnected} />
    </div>
  );
};

export default FootballStatsAI;
