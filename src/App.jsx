import { useState, useEffect } from "react";
import { AlertCircle, Search } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { useFootballAPI } from "./hooks/useFootballAPI";
import { useDemoData } from "./hooks/useDemoData";

// Components
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
import AdvancedFilters from "./components/AdvancedFilters";
import AdvancedH2H from "./components/AdvancedH2H";
import Footer from "./components/Footer";
import AuthModal from "./context/AuthModal";
import PremiumModal from "./context/PremiumModal";

const FootballStatsAI = () => {
  // State management
  const [activeTab, setActiveTab] = useState("matches");
  const [selectedLeague, setSelectedLeague] = useState("135"); // Serie A default
  const [matches, setMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [h2hData, setH2hData] = useState(null);
  const [loadingH2h, setLoadingH2h] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [savedFilters, setSavedFilters] = useState([]);

  // Hooks
  const auth = useAuth();
  const api = useFootballAPI();
  const {
    getDemoMatches,
    getDemoLiveMatches,
    getDemoH2hData,
    getDemoStandings,
  } = useDemoData();

  // Initialize data
  useEffect(() => {
    loadInitialData();
    const liveInterval = setInterval(fetchLiveMatches, 30000); // Update every 30s
    return () => clearInterval(liveInterval);
  }, [selectedLeague]);

  const loadInitialData = async () => {
    // Proviamo sempre a scaricare i dati reali prima.
    // Se l'API fallisce, le funzioni fetch... faranno fallback sui dati demo.
    await Promise.all([fetchMatches(), fetchStandings(), fetchLiveMatches()]);
  };

  const fetchMatches = async () => {
    const result = await api.fetchMatches(selectedLeague);
    if (result.success && result.data.length > 0) {
      setMatches(result.data);
    } else {
      console.log("API Fetch failed or empty, loading demo matches");
      setMatches(getDemoMatches());
    }
  };

  const fetchStandings = async () => {
    const result = await api.fetchStandings(selectedLeague);
    if (result.success && result.data.length > 0) {
      setStandings(result.data);
    } else {
      setStandings(getDemoStandings());
    }
  };

  const fetchLiveMatches = async () => {
    const result = await api.fetchLiveMatches();
    if (result.success) {
      setLiveMatches(result.data);
    } else {
      setLiveMatches(getDemoLiveMatches());
    }
  };

  // --- LOGICA INTELLIGENTE GRATUITA (NO OPENAI) ---
  const generateSmartAnalysis = (match, h2hData) => {
    // 1. Calcoli basati sui DATI REALI
    const hasH2H = h2hData && h2hData.totalMatches > 0;

    // Probabilità implicite dalle quote
    const probHome = match.homeOdds ? (100 / match.homeOdds).toFixed(1) : 50;
    const probAway = match.awayOdds ? (100 / match.awayOdds).toFixed(1) : 50;

    // Determiniamo il favorito dai numeri
    let prediction = "X";
    let confidence = 0;

    const homeOdds = parseFloat(match.homeOdds) || 2.5;
    const awayOdds = parseFloat(match.awayOdds) || 2.5;

    if (homeOdds < awayOdds && homeOdds < 2.0) {
      prediction = "1 (Casa)";
      confidence = Math.min(85, parseFloat(probHome));
    } else if (awayOdds < homeOdds && awayOdds < 2.0) {
      prediction = "2 (Trasferta)";
      confidence = Math.min(85, parseFloat(probAway));
    } else {
      prediction = "X o Goal";
      confidence = 60; // Partita equilibrata
    }

    // 2. Generazione Dinamica del Testo
    const keyPoints = [];

    // Analisi Forma
    if (match.stats?.homeForm > 70)
      keyPoints.push(
        `Il ${match.home} è in ottima forma (${match.stats.homeForm}%)`
      );
    if (match.stats?.awayForm < 40)
      keyPoints.push(`Il ${match.away} sta faticando in trasferta`);

    // Analisi Quote
    if (homeOdds < 1.5)
      keyPoints.push(`Quote nettamente a favore del ${match.home}`);
    if (Math.abs(homeOdds - awayOdds) < 0.5)
      keyPoints.push("Quote molto equilibrate: partita incerta");

    // Analisi H2H Reale
    if (hasH2H) {
      if (parseFloat(h2hData.team1WinPercentage) > 50) {
        keyPoints.push(
          `Storico favorevole al ${match.home} negli ultimi scontri`
        );
      } else if (parseFloat(h2hData.over25Percentage) > 60) {
        keyPoints.push(
          `Alta probabilità di molti gol (Over 2.5 al ${h2hData.over25Percentage}%)`
        );
      }
    }

    // Fallback punti chiave
    if (keyPoints.length === 0)
      keyPoints.push("Partita tattica da studiare live");

    return {
      summary: `Analisi statistica di ${match.home} vs ${match.away} basata su dati attuali.`,
      venue: match.venue || "Stadio non disponibile",
      realData: api.apiConnected,
      hasH2H,
      keyPoints: keyPoints,
      tacticalAnalysis: {
        home:
          homeOdds < 2.0
            ? "Approccio offensivo previsto per i favoriti"
            : "Difesa compatta e ripartenze",
        away:
          awayOdds < 2.0
            ? "Controllo del gioco atteso"
            : "Atteggiamento prudente in trasferta",
      },
      predictions: {
        risultatoEsatto: "Disponibile solo in Premium",
        golTotali:
          hasH2H && parseFloat(h2hData.avgGoals) > 2.5
            ? "Over 2.5 Probabile"
            : "Under 2.5 Probabile",
        btts: hasH2H
          ? `Sì (${h2hData.bttsPercentage}%)`
          : "Dati non sufficienti",
        corner: "Over 8.5 (Stima)",
      },
      valueRatings: {
        casa: {
          rating: homeOdds < 1.5 ? 9 : 6,
          value: homeOdds > 2.2 ? "Alta" : "Bassa",
        },
        pareggio: { rating: 5, value: "Media" },
        trasferta: {
          rating: awayOdds < 1.5 ? 9 : 6,
          value: awayOdds > 2.2 ? "Alta" : "Bassa",
        },
      },
      aiPrediction: prediction, // Predizione calcolata
      confidence: Math.round(confidence),
    };
  };

  const handleAnalyze = async (match) => {
    if (!auth.canUseAnalysis()) {
      addNotification(
        "warning",
        "Limite Raggiunto",
        "Passa a Premium per analisi illimitate!"
      );
      setShowPremiumModal(true);
      return;
    }

    auth.incrementAnalysisCount();
    setSelectedMatch(match);
    setAiAnalyzing(true);
    setLoadingH2h(true);

    // Fetch H2H data REALE
    let h2hResult = null;
    if (api.apiConnected && match.homeId && match.awayId) {
      try {
        const result = await api.fetchH2H(match.homeId, match.awayId);
        if (result.success) {
          h2hResult = result.data;
          setH2hData(result.data);
        }
      } catch (e) {
        console.error("Errore fetch H2H", e);
      }
    }

    // Fallback ai dati demo se non abbiamo risultati reali (o siamo in demo)
    if (!h2hResult) {
      h2hResult = getDemoH2hData();
      setH2hData(h2hResult);
    }

    setLoadingH2h(false);

    // Simuliamo un breve ritardo per l'effetto "elaborazione"
    setTimeout(() => {
      // Usiamo la nuova funzione SMART
      const analysis = generateSmartAnalysis(match, h2hResult);
      setAiAnalysis(analysis);
      setAiAnalyzing(false);
      addNotification(
        "success",
        "Analisi Completata",
        `Analisi generata per ${match.home} vs ${match.away}`
      );
    }, 1500);
  };

  const addNotification = (type, title, message) => {
    const newNotif = {
      id: Date.now(),
      type,
      title,
      message,
      time: new Date().toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 10));
  };

  const handleApplyFilters = (filters) => {
    console.log("Applying filters:", filters);
    // Implement filter logic here
  };

  const handleSavePreset = (preset) => {
    setSavedFilters((prev) => [...prev, preset]);
    addNotification(
      "success",
      "Preset Salvato",
      `Preset "${preset.name}" salvato con successo`
    );
  };

  const filteredMatches = matches.filter(
    (match) =>
      searchTerm === "" ||
      match.home.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.away.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <Header
        auth={auth}
        notifications={notifications}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenPremium={() => setShowPremiumModal(true)}
        apiConnected={api.apiConnected}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* API Status Warning */}
        {!api.apiConnected && (
          <div className="mb-6 bg-yellow-600/20 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <div>
                <div className="font-bold text-sm">Modalità Demo Attiva</div>
                <div className="text-xs text-gray-300 mt-1">
                  Configurare API key per dati reali. Vai su{" "}
                  <a
                    href="https://rapidapi.com/api-sports/api/api-football"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 hover:underline"
                  >
                    RapidAPI
                  </a>{" "}
                  per ottenere la tua chiave.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* League Selector */}
        <LeagueSelector
          selectedLeague={selectedLeague}
          onLeagueChange={setSelectedLeague}
        />

        {/* Navigation Tabs */}
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          liveCount={liveMatches.length}
        />

        {/* Search & Filters */}
        {activeTab === "matches" && (
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca squadra..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-blue-700/30 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <AdvancedFilters
              onApplyFilters={handleApplyFilters}
              onSavePreset={handleSavePreset}
              savedPresets={savedFilters}
            />
          </div>
        )}

        {/* Content based on active tab */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {activeTab === "matches" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">
                    Partite di Oggi ({filteredMatches.length})
                  </h2>
                  {api.lastUpdate && (
                    <span className="text-xs text-gray-400">
                      Ultimo aggiornamento:{" "}
                      {api.lastUpdate.toLocaleTimeString("it-IT")}
                    </span>
                  )}
                </div>
                {filteredMatches.length === 0 ? (
                  <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-12 text-center">
                    <p className="text-gray-400">Nessuna partita trovata</p>
                  </div>
                ) : (
                  filteredMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onAnalyze={handleAnalyze}
                      analyzing={aiAnalyzing && selectedMatch?.id === match.id}
                    />
                  ))
                )}
              </>
            )}

            {activeTab === "predictions" && <PredictionsPanel />}
            {activeTab === "standings" && (
              <StandingsTable standings={standings} />
            )}
            {activeTab === "stats" && <StatisticsCharts />}
            {activeTab === "performance" && <PerformanceCharts />}
            {activeTab === "live" && <LiveMatches matches={liveMatches} />}
          </div>

          {/* Sidebar */}
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

      {/* Footer */}
      <Footer apiConnected={api.apiConnected} />

      {/* Modals */}
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
