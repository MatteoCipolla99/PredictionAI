import {
  X,
  Crown,
  Check,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const PremiumModal = ({ isOpen, onClose }) => {
  const { upgradeToPremium } = useAuth();

  if (!isOpen) return null;

  const features = [
    {
      icon: Zap,
      title: "Analisi AI Illimitate",
      desc: "Accesso completo alle predizioni AI",
    },
    {
      icon: Target,
      title: "Statistiche H2H",
      desc: "Scontri diretti dettagliati per ogni match",
    },
    {
      icon: TrendingUp,
      title: "Predizioni Avanzate",
      desc: "Algoritmi di ML più sofisticati",
    },
    {
      icon: BarChart3,
      title: "Grafici e Analytics",
      desc: "Dashboard complete e personalizzabili",
    },
  ];

  const plans = [
    {
      name: "Mensile",
      price: "19.99",
      period: "mese",
      popular: false,
    },
    {
      name: "Annuale",
      price: "149.99",
      period: "anno",
      popular: true,
      savings: "Risparmia 40%",
    },
  ];

  const handleUpgrade = (plan) => {
    upgradeToPremium();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-blue-800/30 rounded-2xl max-w-4xl w-full shadow-2xl my-8">
        {/* Header */}
        <div className="relative p-6 border-b border-blue-800/30 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Passa a Premium
              </h2>
              <p className="text-gray-400">
                Sblocca tutto il potenziale di StatsCalcio AI
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="p-6 grid md:grid-cols-2 gap-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 bg-slate-800/50 border border-blue-800/30 rounded-xl hover:border-blue-600/50 transition-all"
            >
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <feature.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold mb-1">{feature.title}</div>
                <div className="text-sm text-gray-400">{feature.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison */}
        <div className="p-6 border-t border-blue-800/30">
          <h3 className="text-xl font-bold mb-4 text-center">
            Free vs Premium
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-6">
              <h4 className="font-bold text-lg mb-4">Free</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>5 Analisi al giorno</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Statistiche base</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <X className="w-4 h-4" />
                  <span>H2H avanzati</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <X className="w-4 h-4" />
                  <span>Predizioni ML avanzate</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-2 border-yellow-500/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <h4 className="font-bold text-lg">Premium</h4>
                <Crown className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="font-medium">Analisi illimitate</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="font-medium">
                    Statistiche avanzate complete
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="font-medium">H2H dettagliati</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="font-medium">AI con algoritmi avanzati</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="p-6 border-t border-blue-800/30">
          <div className="grid md:grid-cols-2 gap-4">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative p-6 rounded-xl border-2 transition-all ${
                  plan.popular
                    ? "bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-yellow-500/50"
                    : "bg-slate-800/50 border-blue-800/30 hover:border-blue-600/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold">
                    PIÙ POPOLARE
                  </div>
                )}
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-400 mb-1">{plan.name}</div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">€{plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="mt-2 text-sm text-green-400 font-medium">
                      {plan.savings}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleUpgrade(plan)}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                  }`}
                >
                  Scegli {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-blue-800/30 text-center text-sm text-gray-400">
          <p>
            Cancellazione in qualsiasi momento • Supporto prioritario • Garanzia
            30 giorni
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;
