import { useState } from "react";
import { Target, TrendingUp, Activity, Award, AlertCircle } from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdvancedH2H = ({ team1, team2, team1Id, team2Id }) => {
  const [activeTab, setActiveTab] = useState("overview"); // overview, stats, form, prediction
  const [loading, setLoading] = useState(false);

  // Dati H2H simulati (in prod verrebbero dall'API)
  const h2hData = {
    totalMatches: 15,
    team1Wins: 6,
    team2Wins: 5,
    draws: 4,
    team1WinPercentage: 40,
    team2WinPercentage: 33.3,
    drawPercentage: 26.7,
    avgGoals: 2.8,
    over25Percentage: 73.3,
    bttsPercentage: 66.7,
    lastMatches: [
      {
        date: "15/11/2024",
        homeTeam: team1,
        awayTeam: team2,
        homeScore: 2,
        awayScore: 1,
        winner: "home",
        venue: "Casa",
      },
      {
        date: "22/09/2024",
        homeTeam: team2,
        awayTeam: team1,
        homeScore: 1,
        awayScore: 1,
        winner: "draw",
        venue: "Trasferta",
      },
      {
        date: "10/05/2024",
        homeTeam: team1,
        awayTeam: team2,
        homeScore: 3,
        awayScore: 0,
        winner: "home",
        venue: "Casa",
      },
      {
        date: "18/02/2024",
        homeTeam: team2,
        awayTeam: team1,
        homeScore: 2,
        awayScore: 2,
        winner: "draw",
        venue: "Trasferta",
      },
      {
        date: "03/12/2023",
        homeTeam: team1,
        awayTeam: team2,
        homeScore: 1,
        awayScore: 2,
        winner: "away",
        venue: "Casa",
      },
    ],
  };

  // Statistiche comparative radar
  const radarData = [
    { stat: "Attacco", [team1]: 88, [team2]: 76 },
    { stat: "Difesa", [team1]: 85, [team2]: 72 },
    { stat: "Possesso", [team1]: 82, [team2]: 78 },
    { stat: "Pressing", [team1]: 79, [team2]: 81 },
    { stat: "Transizioni", [team1]: 86, [team2]: 74 },
    { stat: "Duelli", [team1]: 80, [team2]: 83 },
  ];

  // Form ultimi 10 match
  const formData = [
    { match: "10", [team1]: 3, [team2]: 1 },
    { match: "9", [team1]: 3, [team2]: 3 },
    { match: "8", [team1]: 1, [team2]: 0 },
    { match: "7", [team1]: 3, [team2]: 3 },
    { match: "6", [team1]: 0, [team2]: 3 },
    { match: "5", [team1]: 3, [team2]: 1 },
    { match: "4", [team1]: 3, [team2]: 1 },
    { match: "3", [team1]: 1, [team2]: 0 },
    { match: "2", [team1]: 3, [team2]: 3 },
    { match: "1", [team1]: 3, [team2]: 1 },
  ];

  // Gol nei minuti
  const goalsTimingData = [
    { period: "0-15'", [team1]: 3, [team2]: 2 },
    { period: "16-30'", [team1]: 5, [team2]: 4 },
    { period: "31-45'", [team1]: 4, [team2]: 3 },
    { period: "46-60'", [team1]: 6, [team2]: 5 },
    { period: "61-75'", [team1]: 4, [team2]: 6 },
    { period: "76-90'", [team1]: 5, [team2]: 7 },
  ];

  const tabs = [
    { id: "overview", label: "Panoramica", icon: Target },
    { id: "stats", label: "Statistiche", icon: TrendingUp },
    { id: "form", label: "Forma", icon: Activity },
    { id: "prediction", label: "Predizione", icon: Award },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-cyan-400" />
            Confronto Diretto
          </h2>
          <span className="text-sm text-gray-400">
            Ultimi {h2hData.totalMatches} scontri
          </span>
        </div>

        {/* Teams comparison */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {h2hData.team1Wins}
            </div>
            <div className="font-bold mb-1">{team1}</div>
            <div className="text-sm text-blue-400">
              {h2hData.team1WinPercentage}%
            </div>
          </div>

          <div className="bg-gray-600/20 border border-gray-500/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-gray-400 mb-2">
              {h2hData.draws}
            </div>
            <div className="font-bold mb-1">Pareggi</div>
            <div className="text-sm text-gray-400">
              {h2hData.drawPercentage}%
            </div>
          </div>

          <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {h2hData.team2Wins}
            </div>
            <div className="font-bold mb-1">{team2}</div>
            <div className="text-sm text-purple-400">
              {h2hData.team2WinPercentage}%
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-green-400">
              {h2hData.avgGoals}
            </div>
            <div className="text-xs text-gray-400">Media Gol</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-yellow-400">
              {h2hData.over25Percentage}%
            </div>
            <div className="text-xs text-gray-400">Over 2.5</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-orange-400">
              {h2hData.bttsPercentage}%
            </div>
            <div className="text-xs text-gray-400">BTTS</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600"
                : "bg-slate-800/50 hover:bg-slate-800"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Last Matches */}
          <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Ultimi 5 Scontri
            </h3>
            <div className="space-y-3">
              {h2hData.lastMatches.map((match, idx) => (
                <div key={idx} className="bg-slate-900/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">{match.date}</span>
                    <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full">
                      {match.venue}
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-2 items-center">
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
                    <div className="col-span-1 text-center">
                      <span className="font-bold">
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

          {/* Goals Timing */}
          <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
            <h3 className="font-bold mb-4">Gol per Periodo di Gioco</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={goalsTimingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" />
                <XAxis dataKey="period" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #3b82f6",
                  }}
                />
                <Legend />
                <Bar dataKey={team1} fill="#3b82f6" />
                <Bar dataKey={team2} fill="#a855f7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <div className="space-y-6">
          {/* Radar Chart */}
          <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
            <h3 className="font-bold mb-4">Confronto Multi-dimensionale</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e40af" />
                <PolarAngleAxis dataKey="stat" stroke="#94a3b8" />
                <PolarRadiusAxis stroke="#94a3b8" />
                <Radar
                  name={team1}
                  dataKey={team1}
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Radar
                  name={team2}
                  dataKey={team2}
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {radarData.map((stat, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-4"
              >
                <h4 className="font-bold mb-3 text-sm text-gray-400">
                  {stat.stat}
                </h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{team1}</span>
                      <span className="font-bold text-blue-400">
                        {stat[team1]}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${stat[team1]}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{team2}</span>
                      <span className="font-bold text-purple-400">
                        {stat[team2]}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{ width: `${stat[team2]}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Tab */}
      {activeTab === "form" && (
        <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
          <h3 className="font-bold mb-4">Forma Ultimi 10 Match (Punti)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={formData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" />
              <XAxis
                dataKey="match"
                stroke="#94a3b8"
                label={{
                  value: "Partite",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                stroke="#94a3b8"
                label={{ value: "Punti", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #3b82f6",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={team1}
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey={team2}
                stroke="#a855f7"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="font-bold mb-2">{team1}</h4>
              <div className="text-sm space-y-1">
                <div>
                  Punti ultimi 10:{" "}
                  <span className="font-bold text-blue-400">23/30</span>
                </div>
                <div>
                  Media punti:{" "}
                  <span className="font-bold text-blue-400">2.3</span>
                </div>
                <div>
                  Vittorie: <span className="font-bold text-green-400">7</span>
                </div>
              </div>
            </div>
            <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4">
              <h4 className="font-bold mb-2">{team2}</h4>
              <div className="text-sm space-y-1">
                <div>
                  Punti ultimi 10:{" "}
                  <span className="font-bold text-purple-400">19/30</span>
                </div>
                <div>
                  Media punti:{" "}
                  <span className="font-bold text-purple-400">1.9</span>
                </div>
                <div>
                  Vittorie: <span className="font-bold text-green-400">6</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prediction Tab */}
      {activeTab === "prediction" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold">Predizione AI Avanzata</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">42%</div>
                <div className="font-medium">{team1}</div>
                <div className="text-sm text-gray-400 mt-2">Quota: 2.35</div>
              </div>

              <div className="bg-gray-600/20 border border-gray-500/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-gray-400 mb-2">24%</div>
                <div className="font-medium">Pareggio</div>
                <div className="text-sm text-gray-400 mt-2">Quota: 3.40</div>
              </div>

              <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  34%
                </div>
                <div className="font-medium">{team2}</div>
                <div className="text-sm text-gray-400 mt-2">Quota: 2.85</div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <h4 className="font-bold mb-3 text-green-400">
                Predizioni Speciali
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span>Over 2.5</span>
                  <span className="font-bold text-green-400">78%</span>
                </div>
                <div className="flex justify-between">
                  <span>BTTS</span>
                  <span className="font-bold text-green-400">72%</span>
                </div>
                <div className="flex justify-between">
                  <span>Corner Over 9.5</span>
                  <span className="font-bold text-green-400">65%</span>
                </div>
                <div className="flex justify-between">
                  <span>Cartellini Over 3.5</span>
                  <span className="font-bold text-green-400">58%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-bold text-yellow-400 mb-1">
                Value Bet Rilevato
              </div>
              <div className="text-gray-300">
                Il sistema AI suggerisce:{" "}
                <span className="font-bold text-yellow-400">1X</span> con
                probabilità del <span className="font-bold">66%</span> vs quota{" "}
                <span className="font-bold">1.85</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedH2H;
