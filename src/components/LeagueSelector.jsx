import { Trophy } from "lucide-react";

const leagues = [
  { id: "135", name: "Serie A", country: "🇮🇹", flag: "IT" },
  { id: "39", name: "Premier League", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", flag: "GB" },
  { id: "140", name: "La Liga", country: "🇪🇸", flag: "ES" },
  { id: "78", name: "Bundesliga", country: "🇩🇪", flag: "DE" },
  { id: "61", name: "Ligue 1", country: "🇫🇷", flag: "FR" },
  { id: "2", name: "Champions League", country: "🏆", flag: "EU" },
  { id: "3", name: "Europa League", country: "🏆", flag: "EU" },
  { id: "94", name: "Primeira Liga", country: "🇵🇹", flag: "PT" },
];

const LeagueSelector = ({ selectedLeague, onLeagueChange }) => {
  return (
    <div className="mb-6 bg-slate-800/50 border border-blue-800/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h3 className="font-bold">Seleziona Campionato</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        {leagues.map((league) => (
          <button
            key={league.id}
            onClick={() => onLeagueChange(league.id)}
            className={`p-3 rounded-lg text-sm font-medium transition-all ${
              selectedLeague === league.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
                : "bg-slate-900/50 hover:bg-slate-800 border border-blue-800/20"
            }`}
          >
            <div className="text-2xl mb-1">{league.country}</div>
            <div className="text-xs">{league.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export { LeagueSelector, leagues };
