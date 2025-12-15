const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "matches", label: "Matches", icon: Target },
    { id: "betting", label: "Betting Tracker", icon: DollarSign },
    { id: "analysis", label: "AI Analysis", icon: Brain },
    { id: "stats", label: "Statistics", icon: TrendingUp },
  ];

  return (
    <div className="border-b border-primary/30 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primary to-accent"
                  : "bg-surface-light hover:bg-surface"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
