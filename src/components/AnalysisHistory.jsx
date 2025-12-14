import { useState, useEffect } from "react";
import {
  History,
  Download,
  Filter,
  Calendar,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  Eye,
} from "lucide-react";

const AnalysisHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
    accuracy: 0,
    roi: 0,
  });
  const [filter, setFilter] = useState({
    dateRange: "all", // all, week, month, year
    outcome: "all", // all, correct, incorrect, pending
    league: "all",
  });
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  // Carica storico
  useEffect(() => {
    const savedHistory = localStorage.getItem(`analysis_history_${userId}`);
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setHistory(parsed);
      setFilteredHistory(parsed);
      calculateStats(parsed);
    }
  }, [userId]);

  // Salva analisi
  const saveAnalysis = (analysis) => {
    const newAnalysis = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...analysis,
      outcome: "pending", // pending, correct, incorrect
    };

    const updated = [newAnalysis, ...history];
    setHistory(updated);
    localStorage.setItem(`analysis_history_${userId}`, JSON.stringify(updated));
    applyFilters(updated);
  };

  // Aggiorna outcome
  const updateOutcome = (analysisId, outcome) => {
    const updated = history.map((a) =>
      a.id === analysisId ? { ...a, outcome } : a
    );
    setHistory(updated);
    localStorage.setItem(`analysis_history_${userId}`, JSON.stringify(updated));
    applyFilters(updated);
  };

  // Calcola statistiche
  const calculateStats = (data) => {
    const completed = data.filter((a) => a.outcome !== "pending");
    const correct = completed.filter((a) => a.outcome === "correct").length;
    const incorrect = completed.filter((a) => a.outcome === "incorrect").length;
    const accuracy =
      completed.length > 0 ? (correct / completed.length) * 100 : 0;

    // Calcolo ROI semplificato
    let totalBet = 0;
    let totalReturn = 0;
    completed.forEach((a) => {
      if (a.stake) {
        totalBet += a.stake;
        if (a.outcome === "correct" && a.odds) {
          totalReturn += a.stake * a.odds;
        }
      }
    });
    const roi = totalBet > 0 ? ((totalReturn - totalBet) / totalBet) * 100 : 0;

    setStats({
      total: data.length,
      correct,
      incorrect,
      accuracy: accuracy.toFixed(1),
      roi: roi.toFixed(1),
    });
  };

  // Applica filtri
  const applyFilters = (data = history) => {
    let filtered = [...data];

    // Filtro data
    if (filter.dateRange !== "all") {
      const now = new Date();
      const cutoff = new Date();

      switch (filter.dateRange) {
        case "week":
          cutoff.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoff.setMonth(now.getMonth() - 1);
          break;
        case "year":
          cutoff.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter((a) => new Date(a.timestamp) >= cutoff);
    }

    // Filtro outcome
    if (filter.outcome !== "all") {
      filtered = filtered.filter((a) => a.outcome === filter.outcome);
    }

    // Filtro campionato
    if (filter.league !== "all") {
      filtered = filtered.filter((a) => a.leagueId === filter.league);
    }

    setFilteredHistory(filtered);
    calculateStats(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filter]);

  // Export CSV
  const exportToCSV = () => {
    const headers = [
      "Data",
      "Casa",
      "Trasferta",
      "Campionato",
      "Predizione",
      "Confidence",
      "Quota",
      "Stake",
      "Risultato",
      "Note",
    ];

    const rows = filteredHistory.map((a) => [
      new Date(a.timestamp).toLocaleDateString("it-IT"),
      a.home,
      a.away,
      a.leagueName,
      a.prediction,
      a.confidence,
      a.odds || "",
      a.stake || "",
      a.outcome === "pending"
        ? "In attesa"
        : a.outcome === "correct"
        ? "Corretta"
        : "Errata",
      a.notes || "",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `analisi_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // Export JSON
  const exportToJSON = () => {
    const json = JSON.stringify(filteredHistory, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `analisi_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold">Storico Analisi</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={exportToJSON}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-all"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-gray-400">Totali</span>
          </div>
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-gray-400">Analisi</div>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-xs text-gray-400">Corrette</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            {stats.correct}
          </div>
          <div className="text-xs text-gray-400">Vincenti</div>
        </div>

        <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-xs text-gray-400">Errate</span>
          </div>
          <div className="text-2xl font-bold text-red-400">
            {stats.incorrect}
          </div>
          <div className="text-xs text-gray-400">Perdenti</div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-gray-400">Accuratezza</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {stats.accuracy}%
          </div>
          <div className="text-xs text-gray-400">Precision</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">💰</span>
            <span className="text-xs text-gray-400">ROI</span>
          </div>
          <div
            className={`text-2xl font-bold ${
              stats.roi >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {stats.roi}%
          </div>
          <div className="text-xs text-gray-400">Return</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold">Filtri</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Periodo</label>
            <select
              value={filter.dateRange}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, dateRange: e.target.value }))
              }
              className="w-full px-4 py-2 bg-slate-900/50 border border-blue-700/30 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">Tutto</option>
              <option value="week">Ultima Settimana</option>
              <option value="month">Ultimo Mese</option>
              <option value="year">Ultimo Anno</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Risultato
            </label>
            <select
              value={filter.outcome}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, outcome: e.target.value }))
              }
              className="w-full px-4 py-2 bg-slate-900/50 border border-blue-700/30 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">Tutti</option>
              <option value="correct">Corrette</option>
              <option value="incorrect">Errate</option>
              <option value="pending">In Attesa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Campionato
            </label>
            <select
              value={filter.league}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, league: e.target.value }))
              }
              className="w-full px-4 py-2 bg-slate-900/50 border border-blue-700/30 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">Tutti</option>
              <option value="135">Serie A</option>
              <option value="39">Premier League</option>
              <option value="140">La Liga</option>
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-12 text-center">
          <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Nessuna Analisi</h3>
          <p className="text-gray-400 text-sm">
            Le tue analisi appariranno qui
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((analysis) => (
            <div
              key={analysis.id}
              className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-4 hover:border-blue-600/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-400">
                      {new Date(analysis.timestamp).toLocaleDateString("it-IT")}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full">
                      {analysis.leagueName}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        analysis.outcome === "correct"
                          ? "bg-green-600/20 text-green-400"
                          : analysis.outcome === "incorrect"
                          ? "bg-red-600/20 text-red-400"
                          : "bg-yellow-600/20 text-yellow-400"
                      }`}
                    >
                      {analysis.outcome === "pending"
                        ? "In attesa"
                        : analysis.outcome === "correct"
                        ? "Corretta"
                        : "Errata"}
                    </span>
                  </div>
                  <div className="font-bold">
                    {analysis.home} vs {analysis.away}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Predizione:{" "}
                    <span className="text-purple-400 font-medium">
                      {analysis.prediction}
                    </span>
                    {" • "}
                    Confidence:{" "}
                    <span className="text-green-400 font-medium">
                      {analysis.confidence}%
                    </span>
                    {analysis.odds && (
                      <>
                        {" • "}
                        Quota:{" "}
                        <span className="text-blue-400 font-medium">
                          {analysis.odds}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {analysis.outcome === "pending" && (
                    <>
                      <button
                        onClick={() => updateOutcome(analysis.id, "correct")}
                        className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-all"
                        title="Segna come corretta"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateOutcome(analysis.id, "incorrect")}
                        className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all"
                        title="Segna come errata"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedAnalysis(analysis)}
                    className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all"
                    title="Dettagli"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {analysis.notes && (
                <div className="text-sm text-gray-400 bg-slate-900/50 rounded p-2 mt-2">
                  📝 {analysis.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-blue-800/30 rounded-2xl max-w-2xl w-full shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Dettagli Analisi</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Data</div>
                  <div className="font-medium">
                    {new Date(selectedAnalysis.timestamp).toLocaleString(
                      "it-IT"
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Campionato</div>
                  <div className="font-medium">
                    {selectedAnalysis.leagueName}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Match</div>
                  <div className="font-medium">
                    {selectedAnalysis.home} vs {selectedAnalysis.away}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Predizione</div>
                  <div className="font-medium text-purple-400">
                    {selectedAnalysis.prediction}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Confidence</div>
                  <div className="font-medium text-green-400">
                    {selectedAnalysis.confidence}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Risultato</div>
                  <div
                    className={`font-medium ${
                      selectedAnalysis.outcome === "correct"
                        ? "text-green-400"
                        : selectedAnalysis.outcome === "incorrect"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {selectedAnalysis.outcome === "pending"
                      ? "In attesa"
                      : selectedAnalysis.outcome === "correct"
                      ? "Corretta"
                      : "Errata"}
                  </div>
                </div>
              </div>

              {selectedAnalysis.notes && (
                <div>
                  <div className="text-sm text-gray-400 mb-1">Note</div>
                  <div className="bg-slate-800/50 rounded p-3 text-sm">
                    {selectedAnalysis.notes}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedAnalysis(null)}
              className="mt-6 w-full py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisHistory;
