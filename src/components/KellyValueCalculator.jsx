import { useState } from "react";
import {
  Calculator,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Percent,
} from "lucide-react";

const KellyValueCalculator = () => {
  const [inputs, setInputs] = useState({
    bankroll: 1000,
    probability: 60,
    odds: 2.0,
    bookmakerOdds: 1.85,
    commission: 0,
  });

  const [results, setResults] = useState(null);
  const [kellyMode, setKellyMode] = useState("full"); // full, half, quarter

  const calculateKelly = () => {
    const { bankroll, probability, odds, bookmakerOdds, commission } = inputs;

    // Probabilità decimale
    const p = probability / 100;
    const q = 1 - p;

    // Odds decimali (sottrai 1 per ottenere il guadagno netto)
    const b = odds - 1;

    // Kelly Criterion Formula: (bp - q) / b
    const kellyPercentage = (b * p - q) / b;
    const kellyFull = Math.max(0, kellyPercentage * 100);

    // Varianti Kelly
    const kellyHalf = kellyFull / 2;
    const kellyQuarter = kellyFull / 4;

    // Stake basato sulla modalità
    const kellyPercent =
      kellyMode === "full"
        ? kellyFull
        : kellyMode === "half"
        ? kellyHalf
        : kellyQuarter;
    const stake = (bankroll * kellyPercent) / 100;

    // Value Bet Calculation
    const impliedProbability = (1 / odds) * 100;
    const trueOdds = 100 / probability;
    const valuePercentage = (odds / trueOdds - 1) * 100;
    const hasValue = valuePercentage > 0;

    // Expected Value (EV)
    const ev = p * (odds - 1) * stake - q * stake;
    const evPercentage = (ev / stake) * 100;

    // Guadagno/Perdita potenziali
    const potentialWin = stake * (odds - 1);
    const potentialLoss = stake;

    // ROI
    const roi = ((potentialWin * p - potentialLoss * q) / potentialLoss) * 100;

    // Probabilità di rovina (Risk of Ruin) - semplificata
    const edgePerBet = kellyPercentage;
    const numberOfBets = 100;
    const riskOfRuin = Math.pow(q / p, bankroll / stake) * 100;

    // Sharpe Ratio semplificato
    const expectedReturn = roi;
    const volatility = Math.sqrt(
      p * Math.pow(potentialWin, 2) + q * Math.pow(-potentialLoss, 2)
    );
    const sharpeRatio = expectedReturn / 100 / (volatility / stake);

    setResults({
      kelly: {
        full: kellyFull.toFixed(2),
        half: kellyHalf.toFixed(2),
        quarter: kellyQuarter.toFixed(2),
        recommended: kellyPercent.toFixed(2),
        stake: stake.toFixed(2),
      },
      value: {
        percentage: valuePercentage.toFixed(2),
        hasValue,
        impliedProbability: impliedProbability.toFixed(2),
        trueOdds: trueOdds.toFixed(2),
      },
      ev: {
        amount: ev.toFixed(2),
        percentage: evPercentage.toFixed(2),
      },
      outcomes: {
        potentialWin: potentialWin.toFixed(2),
        potentialLoss: potentialLoss.toFixed(2),
        roi: roi.toFixed(2),
      },
      risk: {
        riskOfRuin: Math.min(100, riskOfRuin).toFixed(2),
        sharpeRatio: sharpeRatio.toFixed(3),
        edgePerBet: (edgePerBet * 100).toFixed(2),
      },
    });
  };

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const getRiskLevel = (riskOfRuin) => {
    if (riskOfRuin < 5) return { label: "Basso", color: "green" };
    if (riskOfRuin < 15) return { label: "Medio", color: "yellow" };
    return { label: "Alto", color: "red" };
  };

  const getValueRating = (valuePercentage) => {
    if (valuePercentage > 15)
      return { label: "Eccellente", color: "green", icon: CheckCircle };
    if (valuePercentage > 8)
      return { label: "Buono", color: "blue", icon: CheckCircle };
    if (valuePercentage > 3)
      return { label: "Discreto", color: "yellow", icon: TrendingUp };
    if (valuePercentage > 0)
      return { label: "Marginale", color: "orange", icon: AlertTriangle };
    return { label: "Nessun Value", color: "red", icon: AlertTriangle };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Calculator className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold">
          Kelly Criterion & Value Bet Calculator
        </h2>
      </div>

      {/* Input Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Inputs */}
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              Parametri di Input
            </h3>

            <div className="space-y-4">
              {/* Bankroll */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Bankroll (€)
                </label>
                <input
                  type="number"
                  value={inputs.bankroll}
                  onChange={(e) =>
                    handleInputChange("bankroll", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-slate-900/50 border border-blue-700/30 rounded-lg focus:outline-none focus:border-blue-500 text-lg font-medium"
                />
              </div>

              {/* Probability */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Probabilità Stimata (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputs.probability}
                    onChange={(e) =>
                      handleInputChange("probability", e.target.value)
                    }
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-blue-700/30 rounded-lg focus:outline-none focus:border-blue-500 text-lg font-medium"
                  />
                  <Percent className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="range"
                  value={inputs.probability}
                  onChange={(e) =>
                    handleInputChange("probability", e.target.value)
                  }
                  min="0"
                  max="100"
                  step="0.5"
                  className="w-full mt-2 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Odds */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Quota Offerta
                </label>
                <input
                  type="number"
                  value={inputs.odds}
                  onChange={(e) => handleInputChange("odds", e.target.value)}
                  min="1.01"
                  step="0.01"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-blue-700/30 rounded-lg focus:outline-none focus:border-blue-500 text-lg font-medium"
                />
              </div>

              {/* Kelly Mode */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Modalità Kelly
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "full", label: "Full" },
                    { id: "half", label: "Half" },
                    { id: "quarter", label: "Quarter" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setKellyMode(mode.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        kellyMode === mode.id
                          ? "bg-blue-600"
                          : "bg-slate-700 hover:bg-slate-600"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {kellyMode === "full" && "Massima crescita, massimo rischio"}
                  {kellyMode === "half" &&
                    "Raccomandato: bilanciamento rischio/rendimento"}
                  {kellyMode === "quarter" &&
                    "Conservativo: rischio minimizzato"}
                </p>
              </div>
            </div>

            <button
              onClick={calculateKelly}
              className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              Calcola Kelly & Value
            </button>
          </div>

          {/* Quick Presets */}
          <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-4">
            <h4 className="font-bold text-sm mb-3">Preset Rapidi</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  setInputs({ ...inputs, probability: 55, odds: 2.0 })
                }
                className="px-3 py-2 bg-slate-700 rounded-lg text-sm hover:bg-slate-600 transition-all"
              >
                Value Basso
              </button>
              <button
                onClick={() =>
                  setInputs({ ...inputs, probability: 65, odds: 2.2 })
                }
                className="px-3 py-2 bg-slate-700 rounded-lg text-sm hover:bg-slate-600 transition-all"
              >
                Value Alto
              </button>
              <button
                onClick={() =>
                  setInputs({ ...inputs, probability: 70, odds: 1.5 })
                }
                className="px-3 py-2 bg-slate-700 rounded-lg text-sm hover:bg-slate-600 transition-all"
              >
                Favorito
              </button>
              <button
                onClick={() =>
                  setInputs({ ...inputs, probability: 30, odds: 4.5 })
                }
                className="px-3 py-2 bg-slate-700 rounded-lg text-sm hover:bg-slate-600 transition-all"
              >
                Outsider
              </button>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          {results ? (
            <>
              {/* Kelly Results */}
              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-cyan-400" />
                  Risultati Kelly Criterion
                </h3>
                <div className="space-y-3">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">
                      Stake Raccomandato ({kellyMode})
                    </div>
                    <div className="text-3xl font-bold text-cyan-400">
                      €{results.kelly.stake}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {results.kelly.recommended}% del bankroll
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-gray-400">Full Kelly</div>
                      <div className="font-bold">{results.kelly.full}%</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-gray-400">Half Kelly</div>
                      <div className="font-bold">{results.kelly.half}%</div>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <div className="text-gray-400">Quarter Kelly</div>
                      <div className="font-bold">{results.kelly.quarter}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Value Bet Results */}
              <div
                className={`bg-gradient-to-br ${
                  results.value.hasValue
                    ? "from-green-900/30 to-emerald-900/30 border-green-500/30"
                    : "from-red-900/30 to-pink-900/30 border-red-500/30"
                } border rounded-xl p-6`}
              >
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <TrendingUp
                    className={`w-5 h-5 ${
                      results.value.hasValue ? "text-green-400" : "text-red-400"
                    }`}
                  />
                  Value Bet Analysis
                </h3>

                <div className="bg-slate-900/50 rounded-lg p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">
                      Value Percentage
                    </span>
                    {(() => {
                      const rating = getValueRating(
                        parseFloat(results.value.percentage)
                      );
                      return (
                        <div
                          className={`flex items-center gap-1 text-${rating.color}-400`}
                        >
                          <rating.icon className="w-4 h-4" />
                          <span className="text-xs font-medium">
                            {rating.label}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                  <div
                    className={`text-3xl font-bold ${
                      results.value.hasValue ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {results.value.percentage > 0 ? "+" : ""}
                    {results.value.percentage}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-slate-900/50 rounded p-3">
                    <div className="text-gray-400 mb-1">Prob. Implicita</div>
                    <div className="font-bold">
                      {results.value.impliedProbability}%
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded p-3">
                    <div className="text-gray-400 mb-1">Quota Vera</div>
                    <div className="font-bold">{results.value.trueOdds}</div>
                  </div>
                </div>
              </div>

              {/* Expected Value */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                  Expected Value (EV)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">EV in €</div>
                    <div
                      className={`text-2xl font-bold ${
                        parseFloat(results.ev.amount) >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {results.ev.amount >= 0 ? "+" : ""}€{results.ev.amount}
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">EV %</div>
                    <div
                      className={`text-2xl font-bold ${
                        parseFloat(results.ev.percentage) >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {results.ev.percentage >= 0 ? "+" : ""}
                      {results.ev.percentage}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Potential Outcomes */}
              <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
                <h3 className="font-bold mb-4">Scenari Potenziali</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-400">Vittoria</div>
                      <div className="font-bold text-green-400">
                        +€{results.outcomes.potentialWin}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      {inputs.probability}%
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-600/20 border border-red-500/30 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-400">Perdita</div>
                      <div className="font-bold text-red-400">
                        -€{results.outcomes.potentialLoss}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      {100 - inputs.probability}%
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">ROI Atteso</span>
                      <span
                        className={`font-bold ${
                          parseFloat(results.outcomes.roi) >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {results.outcomes.roi >= 0 ? "+" : ""}
                        {results.outcomes.roi}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Metrics */}
              <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Metriche di Rischio
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Risk of Ruin</span>
                    {(() => {
                      const risk = getRiskLevel(
                        parseFloat(results.risk.riskOfRuin)
                      );
                      return (
                        <span className={`font-bold text-${risk.color}-400`}>
                          {results.risk.riskOfRuin}% ({risk.label})
                        </span>
                      );
                    })()}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Sharpe Ratio</span>
                    <span className="font-bold">
                      {results.risk.sharpeRatio}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Edge per Bet</span>
                    <span className="font-bold text-blue-400">
                      {results.risk.edgePerBet}%
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-12 text-center">
              <Calculator className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Calcola Kelly & Value</h3>
              <p className="text-gray-400 text-sm">
                Inserisci i parametri e clicca "Calcola" per vedere i risultati
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Educational Info */}
      <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-4">
        <h4 className="font-bold mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-blue-400" />
          Informazioni Importanti
        </h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>
            • <strong>Kelly Criterion</strong>: Formula matematica per
            ottimizzare la dimensione della scommessa
          </li>
          <li>
            • <strong>Value Bet</strong>: Quando la tua probabilità stimata è
            superiore alla probabilità implicita delle quote
          </li>
          <li>
            • <strong>Half/Quarter Kelly</strong>: Raccomandati per ridurre la
            volatilità mantenendo buona crescita
          </li>
          <li>
            • <strong>Risk of Ruin</strong>: Probabilità di perdere l'intero
            bankroll con questo sistema
          </li>
          <li>
            • Questi calcoli sono teorici e richiedono stime accurate delle
            probabilità
          </li>
        </ul>
      </div>
    </div>
  );
};

export default KellyValueCalculator;
