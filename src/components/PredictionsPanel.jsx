import { Zap, Activity } from "lucide-react";

const PredictionsPanel = () => {
  const topPredictions = [
    {
      match: "Inter vs Milan",
      pred: "1X",
      prob: 78,
      value: "Alta",
      odds: 1.65,
    },
    {
      match: "Real Madrid vs Barcelona",
      pred: "Over 2.5",
      prob: 82,
      value: "Media",
      odds: 1.75,
    },
    {
      match: "Man City vs Arsenal",
      pred: "1",
      prob: 71,
      value: "Alta",
      odds: 2.1,
    },
  ];

  const stats = [
    { label: "Accuratezza", value: "87%", color: "green" },
    { label: "Predizioni", value: "342", color: "blue" },
    { label: "ROI Medio", value: "+24%", color: "purple" },
    { label: "Vittorie", value: "156", color: "yellow" },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Top Predictions */}
      <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Top Predizioni AI
        </h3>
        <div className="space-y-4">
          {topPredictions.map((p, idx) => (
            <div
              key={idx}
              className="bg-slate-900/50 border border-blue-800/20 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold">{p.match}</span>
                <span className="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded-full">
                  Value: {p.value}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <div className="text-xs text-gray-400">Predizione</div>
                  <div className="font-bold text-purple-400">{p.pred}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Probabilità</div>
                  <div className="font-bold text-green-400">{p.prob}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Quota</div>
                  <div className="font-bold text-blue-400">{p.odds}</div>
                </div>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  style={{ width: `${p.prob}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-400" />
          Statistiche Predizioni
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br from-${stat.color}-600/20 to-${stat.color}-600/20 border border-${stat.color}-500/30 rounded-lg p-4`}
            >
              <div className={`text-3xl font-bold text-${stat.color}-400`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionsPanel;
