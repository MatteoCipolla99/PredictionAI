import {
  Trophy,
  Brain,
  Users,
  BarChart3,
  LineChart,
  Activity,
} from "lucide-react";

const NavigationTabs = ({ activeTab, setActiveTab, liveCount = 0 }) => {
  const tabs = [
    { id: "matches", label: "Partite", icon: Trophy },
    { id: "predictions", label: "Predizioni AI", icon: Brain },
    { id: "standings", label: "Classifica", icon: Users },
    { id: "stats", label: "Statistiche Avanzate", icon: BarChart3 },
    { id: "performance", label: "Performance", icon: LineChart },
    { id: "live", label: `Live (${liveCount})`, icon: Activity },
  ];

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            activeTab === tab.id
              ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/50"
              : "bg-slate-800/50 hover:bg-slate-800"
          }`}
        >
          <tab.icon className="w-4 h-4" />
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default NavigationTabs;
