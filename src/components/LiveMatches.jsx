import { Activity } from "lucide-react";

const LiveMatches = ({ matches = [] }) => {
  if (matches.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-8 text-center">
        <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">Nessuna partita live al momento</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {matches.map((match) => (
        <div
          key={match.id}
          className="bg-slate-800/50 border border-red-500/30 rounded-xl p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-red-400">
                {match.status === "HT" ? "INTERVALLO" : "LIVE"}
              </span>
            </span>
            <span className="text-sm font-bold">
              {match.status === "HT" ? "HT" : `${match.time}'`}
            </span>
          </div>

          {/* Score */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-bold text-lg mb-2">{match.home}</div>
              <div className="text-4xl font-bold text-blue-400">
                {match.homeScore}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-2xl text-gray-400">-</span>
            </div>
            <div>
              <div className="font-bold text-lg mb-2">{match.away}</div>
              <div className="text-4xl font-bold text-purple-400">
                {match.awayScore}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveMatches;
