import { Trophy } from "lucide-react";

// IDs corretti per API-Football (Stagione 2023/24 o 24/25)
const leagues = [
  { id: "135", name: "Serie A", country: "🇮🇹", flag: "IT" },
  { id: "39", name: "Premier League", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", flag: "GB" },
  { id: "140", name: "La Liga", country: "🇪🇸", flag: "ES" },
  { id: "78", name: "Bundesliga", country: "🇩🇪", flag: "DE" },
  { id: "61", name: "Ligue 1", country: "🇫🇷", flag: "FR" },
  { id: "2", name: "Champions League", country: "🏆", flag: "EU" },
  { id: "3", name: "Europa League", country: "🏆", flag: "EU" },
  { id: "13", name: "Copa Libertadores", country: "🌎", flag: "SA" },
];

const LeagueSelector = ({ selectedLeague, onLeagueChange }) => {
  return (
    <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-4 w-full md:w-auto">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h3 className="font-bold">Campionati</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-2">
        {leagues.map((league) => (
          <button
            key={league.id}
            onClick={() => onLeagueChange(league.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg text-sm font-medium transition-all ${
              selectedLeague === league.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg border border-transparent"
                : "bg-slate-900/50 hover:bg-slate-800 border border-blue-800/20"
            }`}
          >
            <span className="text-xl mb-1">{league.country}</span>
            <span className="text-xs text-center whitespace-nowrap">
              {league.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export { LeagueSelector, leagues };
