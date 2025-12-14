import { Target, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const StatCard = ({ icon: Icon, title, value, trend, desc }) => (
  <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-4 hover:border-blue-600/50 transition-all">
    <div className="flex items-center justify-between mb-2">
      <Icon className="w-5 h-5 text-blue-400" />
      {trend === "up" ? (
        <TrendingUp className="w-4 h-4 text-green-400" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-400" />
      )}
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-sm text-gray-400">{title}</div>
    <div className="text-xs text-gray-500 mt-1">{desc}</div>
  </div>
);

const StatisticsCharts = () => {
  const advancedStats = {
    xG: { value: 2.3, trend: "up", desc: "Expected Goals per partita" },
    xGA: { value: 1.1, trend: "down", desc: "Expected Goals Against" },
    possesso: { value: 58, trend: "up", desc: "Possesso palla medio" },
    passaggi: { value: 524, trend: "up", desc: "Passaggi completati" },
    tiri: { value: 15.2, trend: "up", desc: "Tiri per partita" },
    precisione: { value: 87, trend: "up", desc: "Precisione passaggi %" },
  };

  const radarData = [
    { stat: "Attacco", inter: 88, milan: 76 },
    { stat: "Difesa", inter: 85, milan: 72 },
    { stat: "Possesso", inter: 82, milan: 78 },
    { stat: "Pressing", inter: 79, milan: 81 },
    { stat: "Transizioni", inter: 86, milan: 74 },
  ];

  const pieData = [
    { name: "Vittorie", value: 65, color: "#10b981" },
    { name: "Pareggi", value: 20, color: "#f59e0b" },
    { name: "Sconfitte", value: 15, color: "#ef4444" },
  ];

  const formComparison = [
    { periodo: "Ult. 5", inter: 85, milan: 72 },
    { periodo: "Casa", inter: 90, milan: 68 },
    { periodo: "Trasferta", inter: 75, milan: 78 },
    { periodo: "vs Top 6", inter: 70, milan: 65 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-blue-400" />
        Statistiche Avanzate
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(advancedStats).map(([key, stat]) => (
          <StatCard
            key={key}
            icon={Target}
            title={key.toUpperCase()}
            {...stat}
          />
        ))}
      </div>

      {/* Radar Chart */}
      <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          Confronto Multi-dimensionale
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#1e40af" />
            <PolarAngleAxis dataKey="stat" stroke="#94a3b8" />
            <PolarRadiusAxis stroke="#94a3b8" />
            <Radar
              name="Inter"
              dataKey="inter"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Radar
              name="Milan"
              dataKey="milan"
              stroke="#a855f7"
              fill="#a855f7"
              fillOpacity={0.6}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie & Bar Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Distribuzione Risultati</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Confronto Forma</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" />
              <XAxis dataKey="periodo" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #3b82f6",
                }}
              />
              <Legend />
              <Bar dataKey="inter" fill="#3b82f6" />
              <Bar dataKey="milan" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCharts;
