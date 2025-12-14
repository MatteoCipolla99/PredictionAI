import { useState, useEffect } from "react";
import { Heart, Star, Bell, Trash2, Eye, TrendingUp } from "lucide-react";

const FavoritesWatchlist = ({ userId }) => {
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [activeTab, setActiveTab] = useState("favorites"); // favorites, watchlist
  const [notifications, setNotifications] = useState({});

  // Carica dati salvati
  useEffect(() => {
    const savedFavorites = localStorage.getItem(`favorites_${userId}`);
    const savedWatchlist = localStorage.getItem(`watchlist_${userId}`);
    const savedNotifications = localStorage.getItem(`notifications_${userId}`);

    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
  }, [userId]);

  // Salva quando cambia
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
      localStorage.setItem(`watchlist_${userId}`, JSON.stringify(watchlist));
      localStorage.setItem(
        `notifications_${userId}`,
        JSON.stringify(notifications)
      );
    }
  }, [favorites, watchlist, notifications, userId]);

  const toggleFavorite = (match) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === match.id);
      if (exists) {
        return prev.filter((f) => f.id !== match.id);
      } else {
        return [...prev, { ...match, addedAt: new Date().toISOString() }];
      }
    });
  };

  const toggleWatchlist = (match) => {
    setWatchlist((prev) => {
      const exists = prev.find((w) => w.id === match.id);
      if (exists) {
        return prev.filter((w) => w.id !== match.id);
      } else {
        return [...prev, { ...match, addedAt: new Date().toISOString() }];
      }
    });
  };

  const toggleNotification = (matchId) => {
    setNotifications((prev) => ({
      ...prev,
      [matchId]: !prev[matchId],
    }));
  };

  const removeFavorite = (matchId) => {
    setFavorites((prev) => prev.filter((f) => f.id !== matchId));
  };

  const removeFromWatchlist = (matchId) => {
    setWatchlist((prev) => prev.filter((w) => w.id !== matchId));
  };

  const clearAll = () => {
    if (activeTab === "favorites") {
      setFavorites([]);
    } else {
      setWatchlist([]);
    }
  };

  const isFavorite = (matchId) => {
    return favorites.some((f) => f.id === matchId);
  };

  const isInWatchlist = (matchId) => {
    return watchlist.some((w) => w.id === matchId);
  };

  const FavoriteButton = ({ match, size = "md" }) => {
    const favorite = isFavorite(match.id);
    const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(match);
        }}
        className={`p-2 rounded-lg transition-all ${
          favorite
            ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
            : "bg-slate-800/50 text-gray-400 hover:bg-slate-800"
        }`}
        title={favorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
      >
        <Heart className={`${iconSize} ${favorite ? "fill-current" : ""}`} />
      </button>
    );
  };

  const WatchlistButton = ({ match, size = "md" }) => {
    const inWatchlist = isInWatchlist(match.id);
    const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWatchlist(match);
        }}
        className={`p-2 rounded-lg transition-all ${
          inWatchlist
            ? "bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30"
            : "bg-slate-800/50 text-gray-400 hover:bg-slate-800"
        }`}
        title={
          inWatchlist ? "Rimuovi dalla watchlist" : "Aggiungi alla watchlist"
        }
      >
        <Star className={`${iconSize} ${inWatchlist ? "fill-current" : ""}`} />
      </button>
    );
  };

  const MatchCard = ({ match, type }) => {
    const hasNotification = notifications[match.id];

    return (
      <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-4 hover:border-blue-600/50 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{match.time}</span>
            <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full">
              {match.leagueName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleNotification(match.id)}
              className={`p-2 rounded-lg transition-all ${
                hasNotification
                  ? "bg-blue-600/20 text-blue-400"
                  : "bg-slate-700 text-gray-400 hover:bg-slate-600"
              }`}
              title={
                hasNotification ? "Disattiva notifiche" : "Attiva notifiche"
              }
            >
              <Bell
                className={`w-4 h-4 ${hasNotification ? "fill-current" : ""}`}
              />
            </button>
            <button
              onClick={() =>
                type === "favorite"
                  ? removeFavorite(match.id)
                  : removeFromWatchlist(match.id)
              }
              className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all"
              title="Rimuovi"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-3">
          <div className="text-center">
            <div className="font-bold text-sm mb-1">{match.home}</div>
            <div className="text-xl font-bold text-blue-400">
              {match.homeOdds}
            </div>
          </div>
          <div className="text-center flex flex-col justify-center">
            <div className="text-sm text-gray-400 mb-1">VS</div>
            <div className="text-lg font-bold text-gray-400">
              {match.drawOdds}
            </div>
          </div>
          <div className="text-center">
            <div className="font-bold text-sm mb-1">{match.away}</div>
            <div className="text-xl font-bold text-purple-400">
              {match.awayOdds}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span>
              AI:{" "}
              <span className="font-bold text-purple-400">
                {match.aiPrediction}
              </span>
            </span>
          </div>
          <span className="text-xs font-bold text-green-400">
            {match.confidence}%
          </span>
        </div>

        <div className="mt-2 text-xs text-gray-400">
          Aggiunto {new Date(match.addedAt).toLocaleDateString("it-IT")}
        </div>
      </div>
    );
  };

  const currentList = activeTab === "favorites" ? favorites : watchlist;

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "favorites"
                ? "bg-gradient-to-r from-red-600 to-pink-600"
                : "bg-slate-800/50 hover:bg-slate-800"
            }`}
          >
            <Heart className="w-5 h-5" />
            Preferiti ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab("watchlist")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "watchlist"
                ? "bg-gradient-to-r from-yellow-600 to-orange-600"
                : "bg-slate-800/50 hover:bg-slate-800"
            }`}
          >
            <Star className="w-5 h-5" />
            Watchlist ({watchlist.length})
          </button>
        </div>

        {currentList.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Svuota Tutto
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-5 h-5 text-red-400" />
            <span className="text-xs text-gray-400">Totale</span>
          </div>
          <div className="text-2xl font-bold">{favorites.length}</div>
          <div className="text-xs text-gray-400">Partite preferite</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-xs text-gray-400">Totale</span>
          </div>
          <div className="text-2xl font-bold">{watchlist.length}</div>
          <div className="text-xs text-gray-400">In watchlist</div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-gray-400">Attive</span>
          </div>
          <div className="text-2xl font-bold">
            {Object.values(notifications).filter(Boolean).length}
          </div>
          <div className="text-xs text-gray-400">Notifiche</div>
        </div>
      </div>

      {/* List */}
      {currentList.length === 0 ? (
        <div className="bg-slate-800/50 border border-blue-800/30 rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">
            {activeTab === "favorites" ? "❤️" : "⭐"}
          </div>
          <h3 className="text-xl font-bold mb-2">
            {activeTab === "favorites" ? "Nessun Preferito" : "Watchlist Vuota"}
          </h3>
          <p className="text-gray-400 text-sm">
            {activeTab === "favorites"
              ? "Aggiungi partite ai preferiti per trovarle facilmente"
              : "Aggiungi partite alla watchlist per monitorarle"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentList.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              type={activeTab === "favorites" ? "favorite" : "watchlist"}
            />
          ))}
        </div>
      )}

      {/* Export Components */}
      <div className="hidden">
        {/* Questi componenti possono essere importati ed usati altrove */}
        <FavoriteButton match={{}} />
        <WatchlistButton match={{}} />
      </div>
    </div>
  );
};

// Hook personalizzato per usare il sistema favoriti
export const useFavorites = (userId) => {
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem(`favorites_${userId}`);
    const savedWatchlist = localStorage.getItem(`watchlist_${userId}`);

    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
  }, [userId]);

  const toggleFavorite = (match) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === match.id);
      const newFavorites = exists
        ? prev.filter((f) => f.id !== match.id)
        : [...prev, { ...match, addedAt: new Date().toISOString() }];

      localStorage.setItem(`favorites_${userId}`, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const toggleWatchlist = (match) => {
    setWatchlist((prev) => {
      const exists = prev.find((w) => w.id === match.id);
      const newWatchlist = exists
        ? prev.filter((w) => w.id !== match.id)
        : [...prev, { ...match, addedAt: new Date().toISOString() }];

      localStorage.setItem(`watchlist_${userId}`, JSON.stringify(newWatchlist));
      return newWatchlist;
    });
  };

  const isFavorite = (matchId) => favorites.some((f) => f.id === matchId);
  const isInWatchlist = (matchId) => watchlist.some((w) => w.id === matchId);

  return {
    favorites,
    watchlist,
    toggleFavorite,
    toggleWatchlist,
    isFavorite,
    isInWatchlist,
  };
};

export default FavoritesWatchlist;
