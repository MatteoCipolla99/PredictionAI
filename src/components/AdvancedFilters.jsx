import { useState } from "react";
import {
  Filter,
  X,
  Save,
  Calendar,
  TrendingUp,
  DollarSign,
  Zap,
} from "lucide-react";

const AdvancedFilters = ({
  onApplyFilters,
  onSavePreset,
  savedPresets = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: {
      start: new Date().toISOString().split("T")[0],
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
    oddsRange: {
      min: 1.0,
      max: 10.0,
    },
    confidence: {
      min: 0,
      max: 100,
    },
    leagues: [],
    matchTypes: {
      pre: true,
      live: false,
    },
    aiPrediction: "all", // all, home, draw, away
    valueRating: "all", // all, high, medium, low
  });

  const [presetName, setPresetName] = useState("");
  const [showSavePreset, setShowSavePreset] = useState(false);

  const leagues = [
    { id: "135", name: "Serie A", flag: "🇮🇹" },
    { id: "39", name: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    { id: "140", name: "La Liga", flag: "🇪🇸" },
    { id: "78", name: "Bundesliga", flag: "🇩🇪" },
    { id: "61", name: "Ligue 1", flag: "🇫🇷" },
  ];

  const handleLeagueToggle = (leagueId) => {
    setFilters((prev) => ({
      ...prev,
      leagues: prev.leagues.includes(leagueId)
        ? prev.leagues.filter((id) => id !== leagueId)
        : [...prev.leagues, leagueId],
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters({
      dateRange: {
        start: new Date().toISOString().split("T")[0],
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      },
      oddsRange: { min: 1.0, max: 10.0 },
      confidence: { min: 0, max: 100 },
      leagues: [],
      matchTypes: { pre: true, live: false },
      aiPrediction: "all",
      valueRating: "all",
    });
  };

  const handleSavePreset = () => {
    if (presetName.trim()) {
      onSavePreset({ name: presetName, filters });
      setPresetName("");
      setShowSavePreset(false);
    }
  };

  const loadPreset = (preset) => {
    setFilters(preset.filters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.leagues.length > 0) count++;
    if (filters.oddsRange.min > 1.0 || filters.oddsRange.max < 10.0) count++;
    if (filters.confidence.min > 0 || filters.confidence.max < 100) count++;
    if (filters.aiPrediction !== "all") count++;
    if (filters.valueRating !== "all") count++;
    if (!filters.matchTypes.pre || filters.matchTypes.live) count++;
    return count;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-blue-700/30 rounded-lg hover:bg-slate-800 transition-all"
      >
        <Filter className="w-5 h-5" />
        <span className="font-medium">Filtri Avanzati</span>
        {getActiveFiltersCount() > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
            {getActiveFiltersCount()}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-blue-800/30 rounded-2xl max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-blue-800/30 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <Filter className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold">Filtri Avanzati</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Saved Presets */}
              {savedPresets.length > 0 && (
                <div className="bg-slate-800/50 border border-blue-800/20 rounded-xl p-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Save className="w-4 h-4 text-purple-400" />
                    Preset Salvati
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {savedPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => loadPreset(preset)}
                        className="px-3 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-sm hover:bg-purple-600/30 transition-all"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Date Range */}
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Periodo
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Data Inizio
                    </label>
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          dateRange: {
                            ...prev.dateRange,
                            start: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2 bg-slate-800/50 border border-blue-700/30 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Data Fine
                    </label>
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, end: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2 bg-slate-800/50 border border-blue-700/30 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Odds Range */}
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Range Quote
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-gray-400">Minimo</label>
                      <span className="text-sm font-bold text-green-400">
                        {filters.oddsRange.min.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="10.0"
                      step="0.1"
                      value={filters.oddsRange.min}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          oddsRange: {
                            ...prev.oddsRange,
                            min: parseFloat(e.target.value),
                          },
                        }))
                      }
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-gray-400">Massimo</label>
                      <span className="text-sm font-bold text-green-400">
                        {filters.oddsRange.max.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="10.0"
                      step="0.1"
                      value={filters.oddsRange.max}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          oddsRange: {
                            ...prev.oddsRange,
                            max: parseFloat(e.target.value),
                          },
                        }))
                      }
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Confidence */}
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  Confidence AI (%)
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-gray-400">Minimo</label>
                      <span className="text-sm font-bold text-purple-400">
                        {filters.confidence.min}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={filters.confidence.min}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          confidence: {
                            ...prev.confidence,
                            min: parseInt(e.target.value),
                          },
                        }))
                      }
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-gray-400">Massimo</label>
                      <span className="text-sm font-bold text-purple-400">
                        {filters.confidence.max}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={filters.confidence.max}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          confidence: {
                            ...prev.confidence,
                            max: parseInt(e.target.value),
                          },
                        }))
                      }
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Leagues */}
              <div>
                <h3 className="font-bold mb-3">Campionati</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {leagues.map((league) => (
                    <button
                      key={league.id}
                      onClick={() => handleLeagueToggle(league.id)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        filters.leagues.includes(league.id)
                          ? "bg-blue-600 border-2 border-blue-400"
                          : "bg-slate-800/50 border-2 border-blue-800/20 hover:bg-slate-800"
                      }`}
                    >
                      <div className="text-2xl mb-1">{league.flag}</div>
                      <div className="text-xs">{league.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Prediction Type */}
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Predizione AI
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["all", "home", "draw", "away"].map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, aiPrediction: type }))
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.aiPrediction === type
                          ? "bg-yellow-600 border border-yellow-400"
                          : "bg-slate-800/50 border border-blue-800/20 hover:bg-slate-800"
                      }`}
                    >
                      {type === "all"
                        ? "Tutte"
                        : type === "home"
                        ? "Casa"
                        : type === "draw"
                        ? "Pareggio"
                        : "Trasferta"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Value Rating */}
              <div>
                <h3 className="font-bold mb-3">Value Rating</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["all", "high", "medium", "low"].map((value) => (
                    <button
                      key={value}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, valueRating: value }))
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.valueRating === value
                          ? "bg-green-600 border border-green-400"
                          : "bg-slate-800/50 border border-blue-800/20 hover:bg-slate-800"
                      }`}
                    >
                      {value === "all"
                        ? "Tutti"
                        : value === "high"
                        ? "Alto"
                        : value === "medium"
                        ? "Medio"
                        : "Basso"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Match Types */}
              <div>
                <h3 className="font-bold mb-3">Tipo Partita</h3>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.matchTypes.pre}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          matchTypes: {
                            ...prev.matchTypes,
                            pre: e.target.checked,
                          },
                        }))
                      }
                      className="w-4 h-4"
                    />
                    <span>Pre-match</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.matchTypes.live}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          matchTypes: {
                            ...prev.matchTypes,
                            live: e.target.checked,
                          },
                        }))
                      }
                      className="w-4 h-4"
                    />
                    <span>Live</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-slate-900 border-t border-blue-800/30 p-6 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-slate-800/50 border border-blue-700/30 rounded-lg hover:bg-slate-800 transition-all"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowSavePreset(!showSavePreset)}
                  className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salva Preset
                </button>
              </div>
              <button
                onClick={handleApply}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
              >
                Applica Filtri
              </button>
            </div>

            {/* Save Preset Modal */}
            {showSavePreset && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-800 border border-blue-700/30 rounded-xl p-6 max-w-md w-full">
                  <h3 className="font-bold mb-4">Salva Preset</h3>
                  <input
                    type="text"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Nome preset..."
                    className="w-full px-4 py-2 bg-slate-900/50 border border-blue-700/30 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setShowSavePreset(false)}
                      className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all"
                    >
                      Annulla
                    </button>
                    <button
                      onClick={handleSavePreset}
                      className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-all"
                    >
                      Salva
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdvancedFilters;
