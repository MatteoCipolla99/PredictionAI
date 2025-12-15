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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Betting Tracker</h2>
        </div>
        <button
          onClick={() => setShowAddBet(true)}
          className="px-4 py-2 bg-gradient-to-r from-primary to-accent rounded-lg font-medium hover:opacity-90 transition-all"
        >
          Aggiungi Bet
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-primary/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <div className="text-sm text-muted">Totale Bets</div>
        </div>
        <div className="bg-surface border border-green-500/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-400">{stats.won}</div>
          <div className="text-sm text-muted">Vinte</div>
        </div>
        <div className="bg-surface border border-red-500/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-red-400">{stats.lost}</div>
          <div className="text-sm text-muted">Perse</div>
        </div>
        <div className="bg-surface border border-primary/30 rounded-xl p-4">
          <div
            className={`text-2xl font-bold ${
              stats.roi >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {stats.roi.toFixed(1)}%
          </div>
          <div className="text-sm text-muted">ROI</div>
        </div>
      </div>

      <div className="space-y-3">
        {bets.map((bet) => (
          <div
            key={bet.id}
            className="bg-surface border border-primary/30 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold">{bet.match}</div>
                <div className="text-sm text-muted">
                  {new Date(bet.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2">
                {bet.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateBetStatus(bet.id, "won")}
                      className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateBetStatus(bet.id, "lost")}
                      className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
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
                <div className="text-muted">Predizione</div>
                <div className="font-bold text-primary">{bet.prediction}</div>
              </div>
              <div>
                <div className="text-muted">Quota</div>
                <div className="font-bold">{bet.odds}</div>
              </div>
              <div>
                <div className="text-muted">Stake</div>
                <div className="font-bold">€{bet.stake}</div>
              </div>
              <div>
                <div className="text-muted">Potenziale</div>
                <div className="font-bold text-green-400">
                  €{bet.potentialWin.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddBet && (
        <AddBetModal
          newBet={newBet}
          setNewBet={setNewBet}
          onAdd={addBet}
          onClose={() => setShowAddBet(false)}
        />
      )}
    </div>
  );
};

export default BettingTracker;
