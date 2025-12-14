import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Award,
  BarChart3,
  Activity,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PerformanceDashboard = ({ userId }) => {
  const [timeRange, setTimeRange] = useState("month");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerformanceData();
  }, [timeRange, userId]);

  const loadPerformanceData = () => {
    const mockData = {
      overview: {
        totalBets: 156,
        wonBets: 98,
        lostBets: 47,
        winRate: 67.6,
        roi: 24.3,
        totalStaked: 1560,
        totalReturn: 1939,
        profit: 379,
        currentStreak: 5,
      },
      byLeague: [
        { name: "Serie A", bets: 45, won: 32, roi: 28.5, profit: 128 },
        { name: "Premier", bets: 38, won: 24, roi: 18.2, profit: 69 },
        { name: "La Liga", bets: 29, won: 18, roi: 22.1, profit: 64 },
        { name: "Bundesliga", bets: 25, won: 15, roi: 15.8, profit: 40 },
        { name: "Ligue 1", bets: 19, won: 9, roi: -8.4, profit: -16 },
      ],
      byMarket: [
        { name: "1X2", bets: 68, won: 45, roi: 22.1 },
        { name: "Over/Under", bets: 42, won: 31, roi: 31.2 },
        { name: "BTTS", bets: 28, won: 15, roi: 8.9 },
        { name: "Handicap", bets: 18, won: 7, roi: -12.3 },
      ],
      equityCurve: [
        { date: "01/11", equity: 1000, roi: 0 },
        { date: "05/11", equity: 1045, roi: 4.5 },
        { date: "10/11", equity: 1098, roi: 9.8 },
        { date: "15/11", equity: 1134, roi: 13.4 },
        { date: "20/11", equity: 1089, roi: 8.9 },
        { date: "25/11", equity: 1156, roi: 15.6 },
        { date: "30/11", equity: 1223, roi: 22.3 },
        { date: "05/12", equity: 1289, roi: 28.9 },
        { date: "10/12", equity: 1345, roi: 34.5 },
        { date: "14/12", equity: 1379, roi: 37.9 },
      ],
      monthlyPerformance: [
        { month: "Ago", profit: 45, bets: 32, roi: 14.1 },
        { month: "Set", profit: 89, bets: 41, roi: 21.7 },
        { month: "Ott", profit: 123, bets: 38, roi: 32.4 },
        { month: "Nov", profit: 76, bets: 35, roi: 21.7 },
        { month: "Dic", profit: 46, bets: 10, roi: 46.0 },
      ],
      oddsDistribution: [
        { range: "1.0-1.5", count: 12, won: 10, roi: 8.3 },
        { range: "1.5-2.0", count: 45, won: 32, roi: 18.9 },
        { range: "2.0-3.0", count: 68, won: 42, roi: 28.7 },
        { range: "3.0-5.0", count: 24, won: 12, roi: 22.1 },
        { range: "5.0+", count: 7, won: 2, roi: -42.9 },
      ],
      performanceByDay: [
        { day: "Lun", bets: 18, won: 11, roi: 15.6 },
        { day: "Mar", bets: 22, won: 16, roi: 31.8 },
        { day: "Mer", bets: 25, won: 14, roi: 8.4 },
        { day: "Gio", bets: 20, won: 15, roi: 35.0 },
        { day: "Ven", bets: 19, won: 11, roi: 12.1 },
        { day: "Sab", bets: 28, won: 18, roi: 25.0 },
        { day: "Dom", bets: 24, won: 13, roi: 14.6 },
      ],
    };

    setStats(mockData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { overview } = stats;

  const StatCard = ({
    icon: Icon,
    label,
    value,
    change,
    format = "number",
    color = "blue",
  }) => {
    const isPositive = change >= 0;
    const colorClasses = {
      blue: "from-blue-900/30 to-cyan-900/30 border-blue-500/30",
      green: "from-green-900/30 to-emerald-900/30 border-green-500/30",
      purple: "from-purple-900/30 to-pink-900/30 border-purple-500/30",
      yellow: "from-yellow-900/30 to-orange-900/30 border-yellow-500/30",
    };

    return (
      <div
        className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4`}
      >
        <div className="flex items-center justify-between mb-2">
          <Icon className="w-5 h-5" />
          {change !== undefined && (
            <div
              className={`flex items-center gap-1 text-xs ${
                isPositive ? "text-green-400" : "text-red-400"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className="text-2xl font-bold mb-1">
          {format === "currency" && "€"}
          {format === "percentage" ? `${value}%` : value}
        </div>
        <div className="text-xs text-gray-400">{label}</div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold">Performance Dashboard</h2>
        </div>
        <div className="flex gap-2">
          {["week", "month", "quarter", "year", "all"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? "bg-blue-600"
                  : "bg-slate-800/50 hover:bg-slate-800"
              }`}
            >
              {range === "week"
                ? "7gg"
                : range === "month"
                ? "30gg"
                : range === "quarter"
                ? "3m"
                : range === "year"
                ? "1a"
                : "Tutto"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <StatCard
          icon={Target}
          label="Scommesse"
          value={overview.totalBets}
          change={12.5}
          color="blue"
        />
        <StatCard
          icon={Award}
          label="Vinte"
          value={overview.wonBets}
          change={8.3}
          color="green"
        />
        <StatCard
          icon={TrendingUp}
          label="Win Rate"
          value={overview.winRate}
          format="percentage"
          change={2.1}
          color="purple"
        />
        <StatCard
          icon={DollarSign}
          label="ROI"
          value={overview.roi}
          format="percentage"
          change={5.2}
          color="yellow"
        />
        <StatCard
          icon={DollarSign}
          label="Stake Totale"
          value={overview.totalStaked}
          format="currency"
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          label="Ritorno"
          value={overview.totalReturn}
          format="currency"
          color="green"
        />
        <StatCard
          icon={Award}
          label="Profitto"
          value={overview.profit}
          format="currency"
          change={18.9}
          color="green"
        />
        <StatCard
          icon={Activity}
          label="Streak"
          value={`+${overview.currentStreak}`}
          color="purple"
        />
      </div>

      <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Equity Curve & ROI
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={stats.equityCurve}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis yAxisId="left" stroke="#94a3b8" />
            <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #3b82f6",
              }}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="equity"
              fill="#3b82f6"
              stroke="#3b82f6"
              fillOpacity={0.3}
              name="Equity (€)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="roi"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="ROI (%)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Performance Mensile
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #3b82f6",
                }}
              />
              <Bar dataKey="profit" fill="#10b981" name="Profitto (€)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Performance per Campionato
          </h3>
          <div className="space-y-3">
            {stats.byLeague.map((league, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{league.name}</span>
                  <span
                    className={`text-sm font-bold ${
                      league.profit >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {league.profit >= 0 ? "+" : ""}€{league.profit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>
                    {league.bets} scommesse • {league.won} vinte
                  </span>
                  <span
                    className={
                      league.roi >= 0 ? "text-green-400" : "text-red-400"
                    }
                  >
                    ROI: {league.roi}%
                  </span>
                </div>
                <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      league.roi >= 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(100, Math.abs(league.roi) * 2)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Distribuzione per Quote</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.oddsDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" />
              <XAxis dataKey="range" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #3b82f6",
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" name="Totale" />
              <Bar dataKey="won" fill="#10b981" name="Vinte" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
            {stats.oddsDistribution.map((range, idx) => (
              <div key={idx} className="text-center">
                <div
                  className={`font-bold ${
                    range.roi >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {range.roi}%
                </div>
                <div className="text-gray-400">{range.range}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-400" />
            Performance per Giorno
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.performanceByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #3b82f6",
                }}
              />
              <Bar dataKey="roi" fill="#a855f7" name="ROI (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          Key Insights
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-green-400 font-bold mb-1">
              🔥 Best Performance
            </div>
            <div className="text-sm text-gray-300">
              Quote 2.0-3.0 con ROI del {stats.oddsDistribution[2].roi}%
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-blue-400 font-bold mb-1">
              📊 Migliore Giorno
            </div>
            <div className="text-sm text-gray-300">
              Giovedì con ROI del {stats.performanceByDay[3].roi}%
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-purple-400 font-bold mb-1">
              🎯 Campionato Top
            </div>
            <div className="text-sm text-gray-300">
              Serie A con +€{stats.byLeague[0].profit} di profitto
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
