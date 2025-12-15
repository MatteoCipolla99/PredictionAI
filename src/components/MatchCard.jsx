const MatchCard = ({ match }) => {
  return (
    <div className="bg-surface border border-primary/30 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">
          {match.home} vs {match.away}
        </h3>
        <div className="flex gap-2">
          <SocialShare
            match={match}
            analysis={{
              prediction: match.aiPrediction,
              confidence: match.confidence,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {match.homeOdds}
          </div>
          <div className="text-sm text-muted">Casa</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-muted">{match.drawOdds}</div>
          <div className="text-sm text-muted">X</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">{match.awayOdds}</div>
          <div className="text-sm text-muted">Trasferta</div>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">AI: {match.aiPrediction}</span>
          <span className="text-green-400 font-bold">{match.confidence}%</span>
        </div>
      </div>

      <CommentsSystem matchId={match.id} />
    </div>
  );
};

// ============================================
// 10. MAIN APP
// ============================================
const FootballStatsAI = () => {
  const [activeTab, setActiveTab] = useState("matches");
  const [matches] = useState([
    {
      id: 1,
      home: "Inter",
      away: "Milan",
      homeOdds: 2.1,
      drawOdds: 3.4,
      awayOdds: 3.6,
      aiPrediction: "Casa",
      confidence: 78,
    },
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "matches" && (
          <div className="space-y-6">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}

        {activeTab === "betting" && <BettingTracker userId="demo" />}

        {activeTab === "analysis" && (
          <div className="bg-surface border border-primary/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">AI Analysis Dashboard</h2>
            <p className="text-muted">
              Advanced ML analysis with SHAP values coming soon...
            </p>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="bg-surface border border-primary/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Statistics</h2>
            <p className="text-muted">
              Advanced statistics and performance metrics...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
