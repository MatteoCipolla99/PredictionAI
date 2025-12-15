import { useState } from "react";
import {
  Search,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  WifiOff,
  DownloadCloud,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { useFootballAPI } from "./hooks/useFootballAPI";
import { useDemoData } from "./hooks/useDemoData";
import { useGenerativeAI } from "./hooks/useGenerativeAI"; // <--- Importiamo l'AI

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

  // Stati per l'Analisi AI
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [h2hData, setH2hData] = useState(null);
  const [loadingH2h, setLoadingH2h] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  const auth = useAuth();
  const api = useFootballAPI();
  const genAI = useGenerativeAI(); // <--- Inizializziamo l'hook AI
  const {
    getDemoMatches,
    getDemoLiveMatches,
    getDemoH2hData,
    getDemoStandings,
  } = useDemoData();

  const loadData = async () => {
    setDataLoaded(false);
    const standingsResult = await fetchStandings();
    await fetchMatches(standingsResult);
    await fetchLiveMatches();
    setDataLoaded(true);
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
      console.log("Nessuna partita o errore API.");
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
  };

  // --- CUORE DELL'INTEGRAZIONE AI ---
  const handleAnalyze = async (match) => {
    // 1. Controllo permessi (opzionale: richiede login per usare AI)
    if (!auth.canUseAnalysis()) {
      addNotification("warning", "Limite Raggiunto", "Passa a Premium!");
      setShowPremiumModal(true);
      return;
    }

    auth.incrementAnalysisCount();
    setSelectedMatch(match);

    // Mostriamo lo stato di caricamento
    setAiAnalyzing(true);
    setLoadingH2h(true);

    // 2. Recuperiamo i dati H2H (storico scontri)
    let h2hResult = null;
    const h2hResponse = await api.fetchH2H(match.homeId, match.awayId);
    if (h2hResponse.success) h2hResult = h2hResponse.data;
    setH2hData(h2hResult);
    setLoadingH2h(false);

    // 3. CHIAMATA A GEMINI AI
    // Passiamo tutti i dati numerici e riceviamo indietro il testo generato
    const aiResult = await genAI.generatePrediction(match, h2hResult);

    // 4. Combiniamo tutto per mostrarlo a schermo
    const finalAnalysis = {
      ...aiResult, // Qui ci sono summary, tacticalAnalysis, reasoning di Gemini
      venue: match.venue || "Stadio non disponibile",
      realData: true,
      // Questi campi per ora li lasciamo statici o calcolati semplici, l'AI fa il testo
      predictions: {
        risultatoEsatto: "Vedi analisi",
        golTotali: "Over 1.5",
        btts: "Probabile",
        corner: "N/D",
      },
      valueRatings: {
        casa: { rating: 7, value: "Media" },
        pareggio: { rating: 6, value: "Media" },
        trasferta: { rating: 7, value: "Media" },
      },
    };

    setAiAnalysis(finalAnalysis);
    setAiAnalyzing(false); // Stop caricamento
    addNotification(
      "success",
      "Analisi AI Completata",
      `Pronostico generato per ${match.home}`
    );
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

  const filteredMatches = matches.filter(
    (match) =>
      searchTerm === "" ||
      match.home.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.away.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formattedDate = currentDate.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <Header
        auth={auth}
        notifications={notifications}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenPremium={() => setShowPremiumModal(true)}
        apiConnected={api.apiConnected}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Barra di Controllo API */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-blue-800/30">
          {!api.apiConnected ? (
            <div className="flex items-center gap-3 text-gray-400">
              <WifiOff className="w-5 h-5" />
              <span className="text-sm">In attesa dei dati...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-bold">
                Football-Data.org Connesso
              </span>
            </div>
          )}

          <button
            onClick={loadData}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-all shadow-lg shadow-green-900/20"
          >
            <DownloadCloud className="w-5 h-5" /> SCARICA DATI
          </button>
        </div>

        {/* Selettore Data e Lega */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
          <LeagueSelector
            selectedLeague={selectedLeague}
            onLeagueChange={setSelectedLeague}
          />
          <div className="flex items-center gap-4 bg-slate-800/50 p-2 rounded-xl border border-blue-800/30">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 hover:bg-slate-700 rounded-lg"
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
              className="p-2 hover:bg-slate-700 rounded-lg"
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
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cerca partita..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-blue-700/30 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                {filteredMatches.length === 0 ? (
                  <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-12 text-center">
                    <p className="text-gray-400 mb-2">
                      Nessun dato visualizzato.
                    </p>
                    <p className="text-xs text-gray-500">
                      1. Vai a una data futura (es. Domenica).
                      <br />
                      2. Clicca "SCARICA DATI".
                    </p>
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
          </div>

          <div className="space-y-6">
            {/* Pannello laterale che mostrerà l'analisi di Gemini */}
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
