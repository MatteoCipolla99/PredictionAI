import { useState, useEffect } from "react";
import { AlertCircle, Crown } from "lucide-react";

// Simulazione hook autenticazione
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState("free");
  const [dailyAnalysisCount, setDailyAnalysisCount] = useState(0);

  const login = async (email, password) => {
    const mockUser = {
      id: Date.now(),
      email,
      name: email.split("@")[0],
      avatar: `https://ui-avatars.com/api/?name=${email}&background=3b82f6&color=fff`,
    };
    setUser(mockUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setSubscription("free");
    setDailyAnalysisCount(0);
  };

  const upgradeToPremium = () => {
    setSubscription("premium");
  };

  const incrementAnalysisCount = () => {
    setDailyAnalysisCount((prev) => prev + 1);
  };

  const canUseAnalysis = () => {
    return subscription === "premium" || dailyAnalysisCount < 5;
  };

  const getRemainingAnalyses = () => {
    return subscription === "premium"
      ? "Illimitate"
      : Math.max(0, 5 - dailyAnalysisCount);
  };

  return {
    user,
    subscription,
    dailyAnalysisCount,
    login,
    logout,
    upgradeToPremium,
    incrementAnalysisCount,
    canUseAnalysis,
    getRemainingAnalyses,
    isPremium: subscription === "premium",
  };
};

// Simulazione hook API
const useFootballAPI = () => {
  const [loading, setLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchMatches = async (leagueId) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setApiConnected(true);
      setLastUpdate(new Date());
    }, 1000);
    return { success: true, data: [] };
  };

  return { loading, apiConnected, lastUpdate, fetchMatches };
};

// Dati demo
const getDemoMatches = () => [
  {
    id: 1,
    home: "Inter",
    away: "Milan",
    time: "20:45",
    homeOdds: 2.1,
    drawOdds: 3.4,
    awayOdds: 3.6,
    aiPrediction: "Casa",
    confidence: 78,
    stats: { homeForm: 85, awayForm: 72, h2h: "60% Casa" },
    venue: "San Siro",
    homeId: 505,
    awayId: 489,
    leagueName: "Serie A",
  },
  {
    id: 2,
    home: "Juventus",
    away: "Napoli",
    time: "18:00",
    homeOdds: 2.25,
    drawOdds: 3.2,
    awayOdds: 3.3,
    aiPrediction: "X",
    confidence: 65,
    stats: { homeForm: 78, awayForm: 80, h2h: "45% Pareggi" },
    venue: "Allianz Stadium",
    homeId: 496,
    awayId: 492,
    leagueName: "Serie A",
  },
];

const FootballStatsAI = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [matches, setMatches] = useState(getDemoMatches());
  const [notifications, setNotifications] = useState([]);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const auth = useAuth();
  const api = useFootballAPI();

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

  const handleAnalyze = (match) => {
    if (!auth.canUseAnalysis()) {
      addNotification(
        "warning",
        "Limite Raggiunto",
        "Hai raggiunto il limite giornaliero. Passa a Premium per analisi illimitate!"
      );
      setShowPremiumModal(true);
      return;
    }

    auth.incrementAnalysisCount();
    setAiAnalyzing(true);

    setTimeout(() => {
      const analysis = {
        summary: `Analisi di ${match.home} vs ${match.away}`,
        keyPoints: [
          `${match.home} ha una forma eccellente`,
          "Statistiche H2H favorevoli",
          "Momentum positivo",
        ],
        predictions: {
          risultatoEsatto: "2-1",
          golTotali: "Over 2.5 (78%)",
          btts: "Sì (70%)",
        },
        valueRatings: {
          casa: { rating: 8.5, value: "Alta" },
          pareggio: { rating: 5.2, value: "Bassa" },
          trasferta: { rating: 4.8, value: "Media" },
        },
      };

      setAiAnalysis(analysis);
      setAiAnalyzing(false);
      addNotification(
        "success",
        "Analisi Completata",
        `Analisi per ${match.home} vs ${match.away}`
      );
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Header Semplificato */}
      <header className="border-b border-blue-800/30 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                <span className="text-2xl">⚽</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  StatsCalcio AI Pro
                </h1>
                <div className="text-xs text-gray-400">
                  Analisi Professionale con AI
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {auth.user ? (
                <div className="flex items-center gap-3">
                  {!auth.isPremium && (
                    <div className="text-xs text-gray-400">
                      Analisi: {auth.getRemainingAnalyses()}/5
                    </div>
                  )}
                  <button
                    onClick={() => setShowPremiumModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-sm font-medium hover:from-yellow-400 hover:to-orange-400 transition-all flex items-center gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    {auth.isPremium ? "Premium" : "Upgrade"}
                  </button>
                  <img
                    src={auth.user.avatar}
                    alt={auth.user.name}
                    className="w-10 h-10 rounded-full border-2 border-blue-500"
                  />
                  <button
                    onClick={auth.logout}
                    className="px-4 py-2 bg-slate-800/50 rounded-lg text-sm hover:bg-slate-800 transition-all"
                  >
                    Esci
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
                >
                  Accedi
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {!api.apiConnected && (
          <div className="mb-6 bg-yellow-600/20 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="font-bold text-sm">Modalità Demo Attiva</div>
                <div className="text-xs text-gray-300 mt-1">
                  Configurare API key per dati reali
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Matches Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold mb-4">
              Partite di Oggi ({matches.length})
            </h2>
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-4 hover:border-blue-600/50 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400">{match.time}</span>
                  <button
                    onClick={() => handleAnalyze(match)}
                    disabled={aiAnalyzing}
                    className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-xs font-medium hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50"
                  >
                    {aiAnalyzing ? "Analizzando..." : "Analizza"}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="font-bold text-sm mb-1">{match.home}</div>
                    <div className="text-2xl font-bold text-blue-400">
                      {match.homeOdds}
                    </div>
                  </div>
                  <div className="text-center flex flex-col justify-center">
                    <div className="text-sm text-gray-400 mb-1">VS</div>
                    <div className="text-xl font-bold text-gray-400">
                      {match.drawOdds}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-sm mb-1">{match.away}</div>
                    <div className="text-2xl font-bold text-purple-400">
                      {match.awayOdds}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">AI:</span>
                    <span className="font-bold text-purple-400">
                      {match.aiPrediction}
                    </span>
                  </div>
                  <span className="text-sm">
                    <span className="font-bold text-green-400">
                      {match.confidence}%
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Analysis Panel */}
          <div>
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6">
              {aiAnalyzing ? (
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="font-bold mb-2">AI sta analizzando...</h3>
                  <p className="text-sm text-gray-400">
                    Elaborazione dati in corso
                  </p>
                </div>
              ) : aiAnalysis ? (
                <div>
                  <h3 className="text-xl font-bold mb-4">Analisi AI</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-sm text-purple-400 mb-2">
                        Key Points
                      </h4>
                      <ul className="space-y-2">
                        {aiAnalysis.keyPoints.map((point, idx) => (
                          <li
                            key={idx}
                            className="text-sm flex items-start gap-2"
                          >
                            <span className="text-green-400">✓</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-blue-800/30 pt-4">
                      <h4 className="font-bold text-sm text-green-400 mb-2">
                        Predizioni
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(aiAnalysis.predictions).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="bg-slate-900/50 p-2 rounded"
                            >
                              <div className="text-gray-400 capitalize">
                                {key}
                              </div>
                              <div className="font-bold text-green-400">
                                {value}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="border-t border-blue-800/30 pt-4">
                      <h4 className="font-bold text-sm text-yellow-400 mb-2">
                        Value Rating
                      </h4>
                      {Object.entries(aiAnalysis.valueRatings).map(
                        ([key, data]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between mb-2"
                          >
                            <span className="text-sm capitalize">{key}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-yellow-500 to-green-500"
                                  style={{
                                    width: `${(data.rating / 10) * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs font-bold">
                                {data.rating}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="font-bold mb-2">Analisi AI</h3>
                  <p className="text-sm text-gray-400">
                    Clicca "Analizza" su una partita per un'analisi dettagliata
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-blue-800/30 rounded-2xl max-w-md w-full shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Accedi</h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <button
              onClick={async () => {
                await auth.login("demo@statscalcio.ai", "password");
                setShowAuthModal(false);
                addNotification(
                  "success",
                  "Benvenuto!",
                  "Login effettuato con successo"
                );
              }}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              Login Demo
            </button>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-blue-800/30 rounded-2xl max-w-2xl w-full shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-400" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Passa a Premium
                </h2>
              </div>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
                <h4 className="font-bold text-lg mb-4">Free</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>5 Analisi al giorno</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">✕</span>
                    <span className="text-gray-500">Analisi illimitate</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-2 border-yellow-500/50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="font-bold text-lg">Premium</h4>
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="font-medium">Analisi illimitate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="font-medium">AI avanzata</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                auth.upgradeToPremium();
                setShowPremiumModal(false);
                addNotification(
                  "success",
                  "Premium Attivo!",
                  "Benvenuto in Premium"
                );
              }}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg font-medium hover:from-yellow-400 hover:to-orange-400 transition-all text-black"
            >
              Attiva Premium Ora
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FootballStatsAI;
