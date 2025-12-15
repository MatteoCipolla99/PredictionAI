import { useState, useEffect, useRef } from "react";
import {
  Search,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  DownloadCloud,
  CheckCircle,
  AlertCircle,
  Filter,
} from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { useFootballAPI } from "./hooks/useFootballAPI";
import { useGenerativeAI } from "./hooks/useGenerativeAI";
import { useFavorites } from "./components/FavoritesWatchlist";

import Header from "./components/Header";
import NavigationTabs from "./components/NavigationTabs";
import { LeagueSelector } from "./components/LeagueSelector";
import MatchCard from "./components/MatchCard";
import AIAnalysisPanel from "./components/AIAnalysisPanel";
import StandingsTable from "./components/StandingsTable";
import LiveMatches from "./components/LiveMatches";
import PerformanceCharts from "./components/PerformanceCharts";
import StatisticsCharts from "./components/StatisticsCharts";
import PredictionsPanel from "./components/PredictionsPanel";
import AdvancedH2H from "./components/AdvancedH2H";
import Footer from "./components/Footer";
import AuthModal from "./context/AuthModal";
import PremiumModal from "./context/PremiumModal";
import AdvancedFilters from "./components/AdvancedFilters";
import FavoritesWatchlist from "./components/FavoritesWatchlist";
import BettingTracker from "./components/BettingTraker";
import AnalysisHistory from "./components/AnalysisHistory";
import KellyValueCalculator from "./components/KellyValueCalculator";

const FootballStatsAI = () => {
  const [activeTab, setActiveTab] = useState("matches");
  const [selectedLeague, setSelectedLeague] = useState("135"); // Serie A
  const [currentDate, setCurrentDate] = useState(new Date());
  const [matches, setMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Stati per l'Analisi AI
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [h2hData, setH2hData] = useState(null);
  const [loadingH2h, setLoadingH2h] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Ref per prevenire chiamate duplicate
  const loadingRef = useRef(false);
  const lastLoadedDateRef = useRef(null);
  const lastLoadedLeagueRef = useRef(null);

  const auth = useAuth();
  const api = useFootballAPI();
  const genAI = useGenerativeAI();

  // Hook favoriti collegato all'utente corrente
  const { toggleFavorite, isFavorite } = useFavorites(auth.user?.id || "guest");

  // Test connessione API all'avvio
  useEffect(() => {
    api.testConnection();
  }, []);

  const loadData = async () => {
    if (loadingRef.current) return;

    const dateStr = currentDate.toISOString().split("T")[0];

    if (
      lastLoadedDateRef.current === dateStr &&
      lastLoadedLeagueRef.current === selectedLeague
    ) {
      console.log("✅ Dati già caricati per questa data/lega");
      return;
    }

    loadingRef.current = true;
    setIsLoadingData(true);
    setDataLoaded(false);

    try {
      // 1. Carica classifica
      const standingsResult = await fetchStandings();

      // 2. Carica partite con classifica
      await fetchMatches(standingsResult);

      // 3. Carica live
      await fetchLiveMatches();

      lastLoadedDateRef.current = dateStr;
      lastLoadedLeagueRef.current = selectedLeague;
      setDataLoaded(true);

      addNotification(
        "success",
        "Dati Caricati",
        `${matches.length} partite trovate per ${dateStr}`
      );
    } catch (error) {
      console.error("Errore caricamento dati:", error);
      addNotification("error", "Errore", "Impossibile caricare i dati");
    } finally {
      loadingRef.current = false;
      setIsLoadingData(false);
    }
  };

  const fetchMatches = async (currentStandings = []) => {
    const dateStr = currentDate.toISOString().split("T")[0];
    const result = await api.fetchMatches(
      selectedLeague,
      dateStr,
      currentStandings
    );

    if (result.success) {
      setMatches(result.data);
    } else {
      setMatches([]);
    }
  };

  const fetchStandings = async () => {
    const result = await api.fetchStandings(selectedLeague);
    if (result.success && result.data.length > 0) {
      setStandings(result.data);
      return result.data;
    } else {
      setStandings([]);
      return [];
    }
  };

  const fetchLiveMatches = async () => {
    const result = await api.fetchLiveMatches();
    if (result.success) setLiveMatches(result.data);
    else setLiveMatches([]);
  };

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
    setDataLoaded(false);
  };

  useEffect(() => {
    setDataLoaded(false);
    setMatches([]);
    setStandings([]);
  }, [selectedLeague]);

  const handleAnalyze = async (match) => {
    if (!auth.canUseAnalysis()) {
      addNotification("warning", "Limite Raggiunto", "Passa a Premium!");
      setShowPremiumModal(true);
      return;
    }

    auth.incrementAnalysisCount();
    setSelectedMatch(match);
    setAiAnalyzing(true);
    setLoadingH2h(true);

    try {
      let h2hResult = null;
      const h2hResponse = await api.fetchH2H(match.homeId, match.awayId);
      if (h2hResponse.success) {
        h2hResult = h2hResponse.data;
      }
      setH2hData(h2hResult);
      setLoadingH2h(false);

      const aiResult = await genAI.generatePrediction(match, h2hResult);
      setAiAnalysis(aiResult);

      // Salva nello storico se l'utente è loggato
      if (auth.user) {
        const historyItem = {
          home: match.home,
          away: match.away,
          leagueName: match.leagueName,
          leagueId: selectedLeague,
          prediction: aiResult.aiPrediction,
          confidence: aiResult.confidence,
          odds: match.homeOdds, // salviamo una quota di riferimento
          stake: 10, // valore default per calcoli ROI
        };
        // Salvataggio manuale nello storage gestito da AnalysisHistory
        const key = `analysis_history_${auth.user.id}`;
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        localStorage.setItem(
          key,
          JSON.stringify([
            {
              id: Date.now(),
              timestamp: new Date().toISOString(),
              ...historyItem,
              outcome: "pending",
            },
            ...existing,
          ])
        );
      }

      addNotification(
        "success",
        "Analisi AI Completata",
        `Pronostico generato per ${match.home} vs ${match.away}`
      );
    } catch (error) {
      console.error("Errore analisi:", error);
      addNotification("error", "Errore Analisi", "Si è verificato un errore.");
      setAiAnalyzing(false);
      setLoadingH2h(false);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const addNotification = (type, title, message) => {
    setNotifications((prev) =>
      [
        {
          id: Date.now(),
          type,
          title,
          message,
          read: false,
          time: new Date().toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...prev,
      ].slice(0, 10)
    );
  };

  const applyFilters = (match) => {
    if (!activeFilters) return true;

    // Filtro testo
    if (
      searchTerm &&
      !match.home.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !match.away.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filtri avanzati
    if (activeFilters.oddsRange) {
      const matchOdds = parseFloat(match.homeOdds) || 0;
      if (
        matchOdds < activeFilters.oddsRange.min ||
        matchOdds > activeFilters.oddsRange.max
      )
        return false;
    }

    return true;
  };

  const filteredMatches = matches.filter(applyFilters);

  const formattedDate = currentDate.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white font-sans">
      <Header
        auth={auth}
        notifications={notifications}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenPremium={() => setShowPremiumModal(true)}
        apiConnected={api.apiConnected}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-blue-800/30">
          <div className="flex items-center gap-4">
            {!api.apiConnected ? (
              <div className="flex items-center gap-3 text-gray-400">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">In attesa dei dati...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-bold">
                  Football-Data.org Connesso
                </span>
              </div>
            )}
          </div>

          <button
            onClick={loadData}
            disabled={isLoadingData}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-all shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingData ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                CARICAMENTO...
              </>
            ) : (
              <>
                <DownloadCloud className="w-5 h-5" />
                SCARICA DATI
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
          <LeagueSelector
            selectedLeague={selectedLeague}
            onLeagueChange={setSelectedLeague}
          />
          <div className="flex items-center gap-4 bg-slate-800/50 p-2 rounded-xl border border-blue-800/30">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 px-2 min-w-[150px] justify-center">
              <CalendarIcon className="w-4 h-4 text-blue-400" />
              <span className="font-medium capitalize text-sm">
                {formattedDate}
              </span>
            </div>
            <button
              onClick={() => changeDate(1)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          liveCount={liveMatches.length}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {activeTab === "matches" && (
              <>
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cerca partita..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-blue-700/30 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <AdvancedFilters
                    onApplyFilters={setActiveFilters}
                    onSavePreset={(preset) =>
                      console.log("Salva preset", preset)
                    }
                  />
                </div>

                {filteredMatches.length === 0 ? (
                  <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-12 text-center">
                    <p className="text-gray-400 mb-2">
                      Nessun dato visualizzato.
                    </p>
                    <p className="text-xs text-gray-500">
                      1. Seleziona una data (es. Domenica prossima)
                      <br />
                      2. Clicca "SCARICA DATI"
                    </p>
                  </div>
                ) : (
                  filteredMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onAnalyze={handleAnalyze}
                      analyzing={aiAnalyzing && selectedMatch?.id === match.id}
                      isFavorite={isFavorite(match.id)}
                      onToggleFavorite={() => toggleFavorite(match)}
                    />
                  ))
                )}
              </>
            )}

            {activeTab === "live" && <LiveMatches matches={liveMatches} />}
            {activeTab === "standings" && (
              <StandingsTable standings={standings} />
            )}
            {activeTab === "stats" && (
              <div className="min-h-[400px]">
                {dataLoaded ? (
                  <StatisticsCharts />
                ) : (
                  <div className="p-10 text-center text-gray-500">
                    Scarica i dati prima.
                  </div>
                )}
              </div>
            )}
            {activeTab === "performance" && (
              <div className="min-h-[400px]">
                {dataLoaded ? (
                  <PerformanceCharts />
                ) : (
                  <div className="p-10 text-center text-gray-500">
                    Scarica i dati prima.
                  </div>
                )}
              </div>
            )}
            {activeTab === "predictions" && <PredictionsPanel />}
            {activeTab === "history" && (
              <AnalysisHistory userId={auth.user?.id || "guest"} />
            )}
            {activeTab === "betting" && (
              <BettingTracker userId={auth.user?.id || "guest"} />
            )}
            {activeTab === "calculator" && <KellyValueCalculator />}
            {activeTab === "favorites" && (
              <FavoritesWatchlist userId={auth.user?.id || "guest"} />
            )}
          </div>

          <div className="space-y-6">
            <AIAnalysisPanel
              analyzing={aiAnalyzing}
              analysis={aiAnalysis}
              h2hData={h2hData}
              loadingH2h={loadingH2h}
            />

            {selectedMatch && aiAnalysis && h2hData && (
              <AdvancedH2H
                team1={selectedMatch.home}
                team2={selectedMatch.away}
                team1Id={selectedMatch.homeId}
                team2Id={selectedMatch.awayId}
              />
            )}
          </div>
        </div>
      </div>
      <Footer apiConnected={api.apiConnected} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </div>
  );
};

export default FootballStatsAI;
