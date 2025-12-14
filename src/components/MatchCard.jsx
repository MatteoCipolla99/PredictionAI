import { Brain, Target, Trophy } from "lucide-react";

const MatchCard = ({ match, onAnalyze }) => {
  return (
    <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-4 hover:border-blue-600/50 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{match.time}</span>
          {match.leagueName && (
            <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full border border-blue-500/30">
              {match.leagueName}
            </span>
          )}
        </div>
        <button
          onClick={() => onAnalyze(match)}
          className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-xs font-medium hover:from-purple-500 hover:to-blue-500 transition-all"
        >
          <Brain className="w-3 h-3" />
          Analizza
        </button>
      </div>

      {/* Teams & Odds */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Home Team */}
        <div className="text-center">
          {match.homeLogo && (
            <img
              src={match.homeLogo}
              alt={match.home}
              className="w-8 h-8 mx-auto mb-2"
            />
          )}
          <div className="font-bold text-sm mb-1">{match.home}</div>
          <div className="text-2xl font-bold text-blue-400">
            {match.homeOdds}
          </div>
          <div className="text-xs text-gray-400 mt-1">1</div>
        </div>

        {/* Draw */}
        <div className="text-center flex flex-col justify-center">
          <div className="text-sm text-gray-400 mb-1">VS</div>
          <div className="text-xl font-bold text-gray-400">
            {match.drawOdds}
          </div>
          <div className="text-xs text-gray-400 mt-1">X</div>
        </div>

        {/* Away Team */}
        <div className="text-center">
          {match.awayLogo && (
            <img
              src={match.awayLogo}
              alt={match.away}
              className="w-8 h-8 mx-auto mb-2"
            />
          )}
          <div className="font-bold text-sm mb-1">{match.away}</div>
          <div className="text-2xl font-bold text-purple-400">
            {match.awayOdds}
          </div>
          <div className="text-xs text-gray-400 mt-1">2</div>
        </div>
      </div>

      {/* AI Prediction */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/20">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium">AI:</span>
          <span className="font-bold text-purple-400">
            {match.aiPrediction}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-green-400" />
          <span className="text-sm">
            <span className="font-bold text-green-400">
              {match.confidence}%
            </span>
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
        <div className="text-center p-2 bg-slate-900/50 rounded">
          <div className="text-gray-400">Forma Casa</div>
          <div className="font-bold text-blue-400">{match.stats.homeForm}%</div>
        </div>
        <div className="text-center p-2 bg-slate-900/50 rounded">
          <div className="text-gray-400">Forma Trasferta</div>
          <div className="font-bold text-purple-400">
            {match.stats.awayForm}%
          </div>
        </div>
        <div className="text-center p-2 bg-slate-900/50 rounded">
          <div className="text-gray-400">H2H</div>
          <div className="font-bold">{match.stats.h2h}</div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
