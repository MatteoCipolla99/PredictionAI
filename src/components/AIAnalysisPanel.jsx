import { Brain, Check, Target } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const AIAnalysisPanel = ({ analyzing, analysis, h2hData, loadingH2h }) => {
  if (analyzing) {
    return (
      <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
        <div className="text-center">
          <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-pulse" />
          <h3 className="font-bold mb-2">AI sta analizzando...</h3>
          <p className="text-sm text-gray-400">
            Elaborazione dati + H2H in corso
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
        <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="font-bold text-center mb-2">Analisi AI + H2H</h3>
        <p className="text-sm text-gray-400 text-center">
          Clicca "Analizza" su una partita per un'analisi dettagliata con
          statistiche scontri diretti
        </p>
      </div>
    );
  }

  const getH2hPieData = (h2h) => [
    {
      name: "Vittorie Casa",
      value: Number(h2h.team1WinPercentage),
      color: "#3b82f6",
    },
    { name: "Pareggi", value: Number(h2h.drawPercentage), color: "#94a3b8" },
    {
      name: "Vittorie Trasferta",
      value: Number(h2h.team2WinPercentage),
      color: "#a855f7",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Analysis */}
      <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold">Analisi AI</h3>
          {analysis.realData && (
            <span className="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded-full">
              Dati Reali
            </span>
          )}
          {analysis.hasH2H && (
            <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full">
              + H2H
            </span>
          )}
        </div>

        {analysis.venue && (
          <div className="mb-4 text-sm text-gray-400">📍 {analysis.venue}</div>
        )}

        <div className="space-y-4">
          {/* Key Points */}
          <div>
            <h4 className="font-bold text-sm text-purple-400 mb-2">
              Key Points
            </h4>
            <ul className="space-y-2">
              {analysis.keyPoints.map((point, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tactical Analysis */}
          <div className="border-t border-blue-800/30 pt-4">
            <h4 className="font-bold text-sm text-blue-400 mb-2">
              Analisi Tattica
            </h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-400">Casa:</span>{" "}
                {analysis.tacticalAnalysis.home}
              </p>
              <p>
                <span className="text-gray-400">Trasferta:</span>{" "}
                {analysis.tacticalAnalysis.away}
              </p>
            </div>
          </div>

          {/* Predictions */}
          <div className="border-t border-blue-800/30 pt-4">
            <h4 className="font-bold text-sm text-green-400 mb-2">
              Predizioni
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(analysis.predictions).map(([key, value]) => (
                <div key={key} className="bg-slate-900/50 p-2 rounded">
                  <div className="text-gray-400 capitalize">{key}</div>
                  <div className="font-bold text-green-400">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Value Rating */}
          <div className="border-t border-blue-800/30 pt-4">
            <h4 className="font-bold text-sm text-yellow-400 mb-2">
              Value Rating
            </h4>
            {Object.entries(analysis.valueRatings).map(([key, data]) => (
              <div key={key} className="flex items-center justify-between mb-2">
                <span className="text-sm capitalize">{key}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-green-500"
                      style={{ width: `${(data.rating / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold">{data.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* H2H Statistics */}
      {h2hData && (
        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-bold">Scontri Diretti</h3>
            <span className="text-xs text-gray-400">
              (Ultimi {h2hData.totalMatches})
            </span>
          </div>

          {/* Win/Draw/Loss Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {h2hData.team1Wins}
              </div>
              <div className="text-xs text-gray-400 mt-1">Vittorie Casa</div>
              <div className="text-xs text-blue-400 font-semibold">
                {h2hData.team1WinPercentage}%
              </div>
            </div>
            <div className="bg-gray-600/20 border border-gray-500/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-gray-400">
                {h2hData.draws}
              </div>
              <div className="text-xs text-gray-400 mt-1">Pareggi</div>
              <div className="text-xs text-gray-400 font-semibold">
                {h2hData.drawPercentage}%
              </div>
            </div>
            <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {h2hData.team2Wins}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Vittorie Trasferta
              </div>
              <div className="text-xs text-purple-400 font-semibold">
                {h2hData.team2WinPercentage}%
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="w-full h-64 mb-4">
            <h4 className="font-bold text-sm text-cyan-400 mb-2">
              Distribuzione Vittorie H2H
            </h4>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={getH2hPieData(h2hData)}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {getH2hPieData(h2hData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Goal Statistics */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-slate-900/50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-400">
                {h2hData.avgGoals}
              </div>
              <div className="text-xs text-gray-400">Media Gol</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-yellow-400">
                {h2hData.over25Percentage}%
              </div>
              <div className="text-xs text-gray-400">Over 2.5</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-orange-400">
                {h2hData.bttsPercentage}%
              </div>
              <div className="text-xs text-gray-400">BTTS</div>
            </div>
          </div>

          {/* Last Matches */}
          <div>
            <h4 className="font-bold text-sm text-cyan-400 mb-3">
              Ultimi 5 Scontri
            </h4>
            <div className="space-y-2">
              {h2hData.lastMatches.map((match, idx) => (
                <div key={idx} className="bg-slate-900/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">{match.date}</span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        match.winner === "home"
                          ? "bg-blue-600"
                          : match.winner === "away"
                          ? "bg-purple-600"
                          : "bg-gray-600"
                      }`}
                    >
                      {match.winner === "home"
                        ? "H"
                        : match.winner === "away"
                        ? "A"
                        : "D"}
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2 items-center text-sm">
                    <div className="col-span-3 text-right">
                      <span
                        className={
                          match.winner === "home"
                            ? "font-bold text-blue-400"
                            : ""
                        }
                      >
                        {match.homeTeam}
                      </span>
                    </div>
                    <div className="col-span-1 text-center font-bold">
                      <span
                        className={
                          match.winner === "home"
                            ? "text-blue-400"
                            : "text-gray-400"
                        }
                      >
                        {match.homeScore}
                      </span>
                      <span className="text-gray-600 mx-1">-</span>
                      <span
                        className={
                          match.winner === "away"
                            ? "text-purple-400"
                            : "text-gray-400"
                        }
                      >
                        {match.awayScore}
                      </span>
                    </div>
                    <div className="col-span-3">
                      <span
                        className={
                          match.winner === "away"
                            ? "font-bold text-purple-400"
                            : ""
                        }
                      >
                        {match.awayTeam}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysisPanel;
