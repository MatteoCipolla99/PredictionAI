import { useState, useEffect } from "react";
import {
  DollarSign,
  CheckCircle,
  XCircle,
  TrendingUp,
  Target,
} from "lucide-react";

const BettingTracker = ({ userId }) => {
  const [bets, setBets] = useState([]);
  const [showAddBet, setShowAddBet] = useState(false);
  const [newBet, setNewBet] = useState({
    match: "",
    prediction: "",
    odds: "",
    stake: "",
    status: "pending",
  });

  // Carica bets dal localStorage
  useEffect(() => {
    const savedBets = localStorage.getItem(`bets_${userId}`);
    if (savedBets) {
      setBets(JSON.parse(savedBets));
    }
  }, [userId]);

  // Salva bets nel localStorage
  useEffect(() => {
    if (bets.length > 0) {
      localStorage.setItem(`bets_${userId}`, JSON.stringify(bets));
    }
  }, [bets, userId]);

  const addBet = () => {
    if (newBet.match && newBet.prediction && newBet.odds && newBet.stake) {
      const bet = {
        id: Date.now(),
        ...newBet,
        odds: parseFloat(newBet.odds),
        stake: parseFloat(newBet.stake),
        date: new Date().toISOString(),
        potentialWin: parseFloat(newBet.stake) * parseFloat(newBet.odds),
      };
      setBets([bet, ...bets]);
      setNewBet({
        match: "",
        prediction: "",
        odds: "",
        stake: "",
        status: "pending",
      });
      setShowAddBet(false);
    }
  };

  const updateBetStatus = (id, status) => {
    setBets(bets.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const deleteBet = (id) => {
    setBets(bets.filter((b) => b.id !== id));
  };

  // Calcola statistiche
  const stats = {
    total: bets.length,
    won: bets.filter((b) => b.status === "won").length,
    lost: bets.filter((b) => b.status === "lost").length,
    pending: bets.filter((b) => b.status === "pending").length,
    totalStaked: bets.reduce((sum, b) => sum + b.stake, 0),
    totalReturn: bets
      .filter((b) => b.status === "won")
      .reduce((sum, b) => sum + b.potentialWin, 0),
  };
  stats.profit = stats.totalReturn - stats.totalStaked;
  stats.roi =
    stats.totalStaked > 0 ? (stats.profit / stats.totalStaked) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-bold">Betting Tracker</h2>
        </div>
        <button
          onClick={() => setShowAddBet(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
        >
          + Aggiungi Bet
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-4">
          <Target className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
          <div className="text-sm text-gray-400">Totale Bets</div>
        </div>
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl p-4">
          <CheckCircle className="w-5 h-5 text-green-400 mb-2" />
          <div className="text-2xl font-bold text-green-400">{stats.won}</div>
          <div className="text-sm text-gray-400">Vinte</div>
        </div>
        <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 border border-red-500/30 rounded-xl p-4">
          <XCircle className="w-5 h-5 text-red-400 mb-2" />
          <div className="text-2xl font-bold text-red-400">{stats.lost}</div>
          <div className="text-sm text-gray-400">Perse</div>
        </div>
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-4">
          <TrendingUp className="w-5 h-5 text-purple-400 mb-2" />
          <div
            className={`text-2xl font-bold ${
              stats.roi >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {stats.roi >= 0 ? "+" : ""}
            {stats.roi.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-400">ROI</div>
        </div>
      </div>

      {/* Bets List */}
      {bets.length === 0 ? (
        <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-12 text-center">
          <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Nessuna Bet</h3>
          <p className="text-gray-400 text-sm">
            Aggiungi la tua prima scommessa per iniziare il tracking
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bets.map((bet) => (
            <div
              key={bet.id}
              className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-4 hover:border-blue-600/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold">{bet.match}</div>
                  <div className="text-sm text-gray-400">
                    {new Date(bet.date).toLocaleString("it-IT", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="flex gap-2">
                  {bet.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateBetStatus(bet.id, "won")}
                        className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-all"
                        title="Segna come vinta"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateBetStatus(bet.id, "lost")}
                        className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all"
                        title="Segna come persa"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      bet.status === "won"
                        ? "bg-green-600/20 text-green-400"
                        : bet.status === "lost"
                        ? "bg-red-600/20 text-red-400"
                        : "bg-yellow-600/20 text-yellow-400"
                    }`}
                  >
                    {bet.status === "won"
                      ? "Vinta"
                      : bet.status === "lost"
                      ? "Persa"
                      : "In attesa"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 text-sm">
                <div>
                  <div className="text-gray-400 text-xs">Predizione</div>
                  <div className="font-bold text-purple-400">
                    {bet.prediction}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Quota</div>
                  <div className="font-bold">{bet.odds.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Stake</div>
                  <div className="font-bold">€{bet.stake.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Potenziale</div>
                  <div className="font-bold text-green-400">
                    €{bet.potentialWin.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Bet Modal */}
      {showAddBet && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-blue-800/30 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Aggiungi Bet</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Match (es. Inter vs Milan)"
                value={newBet.match}
                onChange={(e) =>
                  setNewBet({ ...newBet, match: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-800/50 border border-blue-700/30 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Predizione (es. 1, X, 2, Over 2.5)"
                value={newBet.prediction}
                onChange={(e) =>
                  setNewBet({ ...newBet, prediction: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-800/50 border border-blue-700/30 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Quota"
                value={newBet.odds}
                onChange={(e) => setNewBet({ ...newBet, odds: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800/50 border border-blue-700/30 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Stake (€)"
                value={newBet.stake}
                onChange={(e) =>
                  setNewBet({ ...newBet, stake: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-800/50 border border-blue-700/30 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddBet(false)}
                  className="flex-1 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all"
                >
                  Annulla
                </button>
                <button
                  onClick={addBet}
                  disabled={
                    !newBet.match ||
                    !newBet.prediction ||
                    !newBet.odds ||
                    !newBet.stake
                  }
                  className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Aggiungi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BettingTracker;
