const AddBetModal = ({ newBet, setNewBet, onAdd, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-primary/30 rounded-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">Aggiungi Bet</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Match (es. Inter vs Milan)"
            value={newBet.match}
            onChange={(e) => setNewBet({ ...newBet, match: e.target.value })}
            className="w-full px-4 py-2 bg-surface-light border border-primary/30 rounded-lg focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="Predizione (es. 1, X, 2)"
            value={newBet.prediction}
            onChange={(e) =>
              setNewBet({ ...newBet, prediction: e.target.value })
            }
            className="w-full px-4 py-2 bg-surface-light border border-primary/30 rounded-lg focus:outline-none focus:border-primary"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Quota"
            value={newBet.odds}
            onChange={(e) => setNewBet({ ...newBet, odds: e.target.value })}
            className="w-full px-4 py-2 bg-surface-light border border-primary/30 rounded-lg focus:outline-none focus:border-primary"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Stake (€)"
            value={newBet.stake}
            onChange={(e) => setNewBet({ ...newBet, stake: e.target.value })}
            className="w-full px-4 py-2 bg-surface-light border border-primary/30 rounded-lg focus:outline-none focus:border-primary"
          />
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-surface-light rounded-lg hover:bg-surface transition-all"
            >
              Annulla
            </button>
            <button
              onClick={onAdd}
              className="flex-1 py-2 bg-gradient-to-r from-primary to-accent rounded-lg hover:opacity-90 transition-all"
            >
              Aggiungi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBetModal;
