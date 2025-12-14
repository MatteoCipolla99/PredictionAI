import { Activity } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PerformanceCharts = () => {
  const performanceData = [
    { giornata: "G1", punti: 3, gol: 2, xG: 1.8 },
    { giornata: "G2", punti: 1, gol: 1, xG: 1.5 },
    { giornata: "G3", punti: 3, gol: 3, xG: 2.3 },
    { giornata: "G4", punti: 3, gol: 2, xG: 2.1 },
    { giornata: "G5", punti: 0, gol: 0, xG: 1.2 },
    { giornata: "G6", punti: 3, gol: 4, xG: 3.2 },
    { giornata: "G7", punti: 3, gol: 2, xG: 2.5 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Activity className="w-6 h-6 text-green-400" />
        Grafici di Performance
      </h2>

      {/* Line Chart */}
      <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Andamento Ultimi Match</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" />
            <XAxis dataKey="giornata" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #3b82f6",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="punti"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="gol"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="xG"
              stroke="#a855f7"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Area Chart */}
      <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Trend Gol vs Expected Goals</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" />
            <XAxis dataKey="giornata" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #3b82f6",
              }}
            />
            <Area
              type="monotone"
              dataKey="gol"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="xG"
              stackId="2"
              stroke="#a855f7"
              fill="#a855f7"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceCharts;
