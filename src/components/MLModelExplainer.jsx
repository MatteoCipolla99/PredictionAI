import { useState } from "react";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Info,
  Eye,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const MLModelExplainer = ({ match, prediction }) => {
  const [selectedView, setSelectedView] = useState("shap"); // shap, features, confidence

  // Simula SHAP values (in produzione verrebbero dal backend ML)
  const shapValues = {
    baseValue: 0.5, // Probabilità base (50%)
    prediction: prediction?.confidence || 0.72, // Predizione finale (72%)
    features: [
      {
        name: "Forma Casa (Ultimi 5)",
        value: 85,
        shap: 0.12,
        impact: "positive",
        importance: 0.25,
        description: "Vittorie recenti in casa aumentano la probabilità",
      },
      {
        name: "H2H Favorevole",
        value: "60% vittorie",
        shap: 0.08,
        impact: "positive",
        importance: 0.18,
        description: "Storico positivo negli scontri diretti",
      },
      {
        name: "xG Medio Casa",
        value: 2.3,
        shap: 0.06,
        impact: "positive",
        importance: 0.15,
        description: "Expected Goals elevati nelle partite casalinghe",
      },
      {
        name: "Forma Trasferta Avversario",
        value: 45,
        shap: 0.04,
        impact: "positive",
        importance: 0.12,
        description: "L'avversario fatica in trasferta",
      },
      {
        name: "Momentum Squadra",
        value: 78,
        shap: 0.03,
        impact: "positive",
        importance: 0.1,
        description: "Trend positivo nelle ultime settimane",
      },
      {
        name: "Qualità Rosa",
        value: 82,
        shap: -0.02,
        impact: "negative",
        importance: 0.08,
        description: "Rosa leggermente inferiore alle aspettative",
      },
      {
        name: "Infortuni Chiave",
        value: 2,
        shap: -0.04,
        impact: "negative",
        importance: 0.07,
        description: "Assenze importanti in formazione",
      },
      {
        name: "Stanchezza (3 match/7gg)",
        value: "Alta",
        shap: -0.05,
        impact: "negative",
        importance: 0.05,
        description: "Calendario denso nelle ultime settimane",
      },
    ].sort((a, b) => Math.abs(b.shap) - Math.abs(a.shap)),
  };

  // Calcola contributo cumulativo
  const cumulativeShap = shapValues.features.reduce((acc, feature, idx) => {
    const prevValue =
      idx === 0 ? shapValues.baseValue : acc[idx - 1].cumulative;
    return [
      ...acc,
      {
        ...feature,
        cumulative: prevValue + feature.shap,
      },
    ];
  }, []);

  // Dati per waterfall chart
  const waterfallData = [
    { name: "Base", value: shapValues.baseValue * 100, color: "#64748b" },
    ...cumulativeShap.map((f) => ({
      name: f.name,
      value: Math.abs(f.shap) * 100,
      cumulative: f.cumulative * 100,
      color: f.impact === "positive" ? "#10b981" : "#ef4444",
      impact: f.impact,
    })),
    {
      name: "Predizione",
      value: shapValues.prediction * 100,
      color: "#3b82f6",
    },
  ];

  // Feature importance data
  const importanceData = shapValues.features
    .sort((a, b) => b.importance - a.importance)
    .map((f) => ({
      name: f.name.split(" ").slice(0, 3).join(" "),
      importance: f.importance * 100,
      shap: f.shap,
    }));

  const FeatureCard = ({ feature }) => {
    const isPositive = feature.impact === "positive";
    const percentage = Math.abs(feature.shap * 100).toFixed(1);

    return (
      <div
        className={`bg-slate-800/50 border rounded-xl p-4 ${
          isPositive ? "border-green-500/30" : "border-red-500/30"
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="font-bold mb-1">{feature.name}</div>
            <div className="text-sm text-gray-400">{feature.description}</div>
          </div>
          <div
            className={`ml-3 flex items-center gap-1 ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            <span className="font-bold">
              {isPositive ? "+" : ""}
              {percentage}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-slate-900/50 rounded p-2">
            <div className="text-xs text-gray-400">Valore</div>
            <div className="font-bold text-sm">{feature.value}</div>
          </div>
          <div className="bg-slate-900/50 rounded p-2">
            <div className="text-xs text-gray-400">Importanza</div>
            <div className="font-bold text-sm">
              {(feature.importance * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Visual impact bar */}
        <div className="mt-3">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${isPositive ? "bg-green-500" : "bg-red-500"}`}
              style={{ width: `${Math.abs(feature.shap) * 100 * 5}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold">AI Model Explanation</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Probabilità Base</div>
            <div className="text-2xl font-bold text-gray-400">
              {(shapValues.baseValue * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Punto di partenza</div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Impatto Features</div>
            <div
              className={`text-2xl font-bold ${
                shapValues.prediction - shapValues.baseValue >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {(shapValues.prediction - shapValues.baseValue) * 100 >= 0
                ? "+"
                : ""}
              {((shapValues.prediction - shapValues.baseValue) * 100).toFixed(
                1
              )}
              %
            </div>
            <div className="text-xs text-gray-500 mt-1">Contributo totale</div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Predizione Finale</div>
            <div className="text-2xl font-bold text-blue-400">
              {(shapValues.prediction * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Confidence AI</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          { id: "shap", label: "SHAP Analysis", icon: BarChart3 },
          { id: "features", label: "Feature Impact", icon: TrendingUp },
          { id: "confidence", label: "Confidence Breakdown", icon: Eye },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedView(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              selectedView === tab.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600"
                : "bg-slate-800/50 hover:bg-slate-800"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* SHAP Analysis View */}
      {selectedView === "shap" && (
        <div className="space-y-6">
          {/* Waterfall Chart */}
          <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              SHAP Waterfall Chart
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={waterfallData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" />
                <XAxis type="number" stroke="#94a3b8" domain={[0, 100]} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#94a3b8"
                  width={150}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #3b82f6",
                  }}
                  formatter={(value) => `${value.toFixed(1)}%`}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 flex items-start gap-2 text-sm text-gray-400 bg-blue-600/10 border border-blue-500/30 rounded p-3">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                Il grafico mostra come ogni feature contribuisce alla predizione
                finale. Le barre verdi aumentano la probabilità, le rosse la
                diminuiscono.
              </p>
            </div>
          </div>

          {/* Feature Importance */}
          <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Feature Importance
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={importanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis
                  stroke="#94a3b8"
                  label={{
                    value: "Importanza (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #3b82f6",
                  }}
                />
                <Bar dataKey="importance" fill="#a855f7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Features View */}
      {selectedView === "features" && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {shapValues.features.map((feature, idx) => (
              <FeatureCard key={idx} feature={feature} />
            ))}
          </div>
        </div>
      )}

      {/* Confidence Breakdown View */}
      {selectedView === "confidence" && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Breakdown Confidence</h3>

            {/* Positive Factors */}
            <div className="mb-6">
              <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Fattori Positivi (
                {
                  shapValues.features.filter((f) => f.impact === "positive")
                    .length
                }
                )
              </h4>
              <div className="space-y-2">
                {shapValues.features
                  .filter((f) => f.impact === "positive")
                  .map((feature, idx) => (
                    <div
                      key={idx}
                      className="bg-green-600/10 border border-green-500/30 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{feature.name}</span>
                        <span className="text-green-400 font-bold">
                          +{(feature.shap * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {feature.description}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Negative Factors */}
            <div>
              <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Fattori Negativi (
                {
                  shapValues.features.filter((f) => f.impact === "negative")
                    .length
                }
                )
              </h4>
              <div className="space-y-2">
                {shapValues.features
                  .filter((f) => f.impact === "negative")
                  .map((feature, idx) => (
                    <div
                      key={idx}
                      className="bg-red-600/10 border border-red-500/30 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{feature.name}</span>
                        <span className="text-red-400 font-bold">
                          {(feature.shap * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {feature.description}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Model Confidence Score */}
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Model Confidence Score</h3>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-400">A+</div>
                <div className="text-sm text-gray-400 mt-1">Data Quality</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-400">92%</div>
                <div className="text-sm text-gray-400 mt-1">
                  Feature Coverage
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-400">High</div>
                <div className="text-sm text-gray-400 mt-1">
                  Model Certainty
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-3xl font-bold text-yellow-400">8/10</div>
                <div className="text-sm text-gray-400 mt-1">
                  Prediction Strength
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Educational Footer */}
      <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-4">
        <h4 className="font-bold mb-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-purple-400" />
          Cos'è SHAP?
        </h4>
        <p className="text-sm text-gray-300">
          <strong>SHAP (SHapley Additive exPlanations)</strong> è una tecnica di
          explainable AI che mostra come ogni feature contribuisce alla
          predizione finale del modello. Basato sulla teoria dei giochi, SHAP
          assegna un "valore di importanza" a ogni feature, permettendo di
          capire quali fattori hanno influenzato maggiormente la decisione
          dell'AI.
        </p>
      </div>
    </div>
  );
};

export default MLModelExplainer;
