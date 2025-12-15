import { Brain, TrendingUp, Heart } from "lucide-react";
import SocialShare from "./SocialShare";
import CommentsSystem from "./CommentsSystem";

const MatchCard = ({
  match,
  onAnalyze,
  analyzing,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6 hover:border-blue-600/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-400">{match.time}</span>
          <span className="text-xs px-2 py-1 bg-slate-700/50 rounded text-gray-400">
            {match.statusLong || match.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <SocialShare
            match={match}
            analysis={{
              prediction: match.aiPrediction,
              confidence: match.confidence,
            }}
          />
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-lg transition-all ${
              isFavorite
                ? "text-red-500 bg-red-500/10"
                : "text-gray-400 hover:text-red-400"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <img
            src={match.homeLogo}
            alt={match.home}
            className="w-10 h-10 object-contain"
          />
          <span className="font-bold text-lg">{match.home}</span>
        </div>
        <div className="px-4 font-bold text-xl text-gray-500">VS</div>
        <div className="flex items-center gap-3 flex-1 justify-end">
          <span className="font-bold text-lg text-right">{match.away}</span>
          <img
            src={match.awayLogo}
            alt={match.away}
            className="w-10 h-10 object-contain"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-slate-900/50 rounded-lg p-2 text-center border border-blue-900/30">
          <div className="text-xs text-gray-400 mb-1">1</div>
          <div className="font-bold text-blue-400">{match.homeOdds || "-"}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-2 text-center border border-blue-900/30">
          <div className="text-xs text-gray-400 mb-1">X</div>
          <div className="font-bold text-gray-400">{match.drawOdds || "-"}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-2 text-center border border-blue-900/30">
          <div className="text-xs text-gray-400 mb-1">2</div>
          <div className="font-bold text-purple-400">
            {match.awayOdds || "-"}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        {match.aiPrediction ? (
          <div className="flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/30">
            <Brain className="w-4 h-4 text-purple-400" />
            <div className="text-sm">
              <span className="text-gray-400">AI: </span>
              <span className="font-bold text-white">{match.aiPrediction}</span>
              <span className="text-gray-500 text-xs ml-1">
                ({match.confidence}%)
              </span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-500">AI in attesa...</div>
        )}

        <button
          onClick={() => onAnalyze(match)}
          disabled={analyzing}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50"
        >
          {analyzing ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <TrendingUp className="w-4 h-4" />
          )}
          Analizza
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-blue-800/20">
        <CommentsSystem matchId={match.id} />
      </div>
    </div>
  );
};

export default MatchCard;
