import { useState } from "react";
import {
  BarChart3,
  Search,
  Bell,
  RefreshCw,
  Wifi,
  WifiOff,
  X,
  Check,
  AlertCircle,
  User,
  Settings,
  CreditCard,
  LogOut,
  Crown,
  ChevronDown,
  Target,
  TrendingUp,
} from "lucide-react";

const Header = ({
  apiConnected,
  lastUpdate,
  loading,
  onRefresh,
  notifications,
  onMarkAsRead,
  user,
  logout,
  subscription,
  isPremium,
  getRemainingAnalyses,
  onOpenAuth,
  onOpenPremium,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const NotificationIcon = ({ type }) => {
    const icons = {
      success: <Check className="w-4 h-4" />,
      warning: <AlertCircle className="w-4 h-4" />,
      info: <Bell className="w-4 h-4" />,
      error: <AlertCircle className="w-4 h-4" />,
    };
    return icons[type] || icons.info;
  };

  return (
    <header className="border-b border-blue-800/30 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                StatsCalcio AI
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Analisi in Tempo Reale</span>
                {apiConnected ? (
                  <span className="flex items-center gap-1 text-green-400">
                    <Wifi className="w-3 h-3" />
                    Live
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-400">
                    <WifiOff className="w-3 h-3" />
                    Demo
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Last Update */}
            {lastUpdate && (
              <div className="hidden md:block text-xs text-gray-400">
                Agg: {lastUpdate.toLocaleTimeString("it-IT")}
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 hover:bg-slate-800 rounded-lg transition-all disabled:opacity-50"
              title="Aggiorna dati"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>

            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca squadra..."
                className="pl-10 pr-4 py-2 bg-slate-800/50 border border-blue-700/30 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-slate-800 rounded-lg transition-all"
                title="Notifiche"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-blue-800/30 rounded-xl shadow-xl max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-blue-800/30 flex items-center justify-between sticky top-0 bg-slate-900">
                    <h3 className="font-bold">Notifiche</h3>
                    <button onClick={() => setShowNotifications(false)}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-400 text-sm">
                      Nessuna notifica
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => onMarkAsRead(notif.id)}
                        className={`p-4 border-b border-blue-800/10 hover:bg-slate-800/50 cursor-pointer transition-all ${
                          !notif.read ? "bg-blue-900/20" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              notif.type === "success"
                                ? "bg-green-600/20 text-green-400"
                                : notif.type === "warning"
                                ? "bg-yellow-600/20 text-yellow-400"
                                : notif.type === "error"
                                ? "bg-red-600/20 text-red-400"
                                : "bg-blue-600/20 text-blue-400"
                            }`}
                          >
                            <NotificationIcon type={notif.type} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {notif.title}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {notif.message}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {notif.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* User Profile or Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg transition-all"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-blue-500"
                  />
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium flex items-center gap-2">
                      {user.name}
                      {isPremium && (
                        <Crown className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {subscription}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showProfile ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showProfile && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfile(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-blue-800/30 rounded-xl shadow-xl z-50">
                      <div className="p-4 border-b border-blue-800/30">
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-full border-2 border-blue-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium flex items-center gap-2">
                              {user.name}
                              {isPremium && (
                                <Crown className="w-4 h-4 text-yellow-400" />
                              )}
                            </div>
                            <div className="text-xs text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>

                        {isPremium ? (
                          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Crown className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-yellow-400 font-medium">
                                Account Premium
                              </span>
                            </div>
                            <div className="text-xs text-gray-400">
                              Accesso illimitato
                            </div>
                          </div>
                        ) : (
                          <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3">
                            <div className="text-sm text-blue-400 font-medium mb-1">
                              Account Free
                            </div>
                            <div className="text-xs text-gray-400 mb-2">
                              Analisi oggi: {getRemainingAnalyses()}/5
                            </div>
                            <button
                              onClick={() => {
                                setShowProfile(false);
                                onOpenPremium && onOpenPremium();
                              }}
                              className="w-full px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded text-xs font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
                            >
                              Passa a Premium
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="p-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition-all text-left">
                          <User className="w-5 h-5 text-gray-400" />
                          <span>Profilo</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition-all text-left">
                          <Settings className="w-5 h-5 text-gray-400" />
                          <span>Impostazioni</span>
                        </button>
                        {!isPremium && (
                          <button
                            onClick={() => {
                              setShowProfile(false);
                              onOpenPremium && onOpenPremium();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition-all text-left"
                          >
                            <Crown className="w-5 h-5 text-yellow-400" />
                            <span className="text-yellow-400">
                              Passa a Premium
                            </span>
                          </button>
                        )}
                        <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition-all text-left">
                          <CreditCard className="w-5 h-5 text-gray-400" />
                          <span>Fatturazione</span>
                        </button>
                      </div>

                      <div className="p-4 border-t border-blue-800/30">
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="bg-slate-800/50 rounded-lg p-2">
                            <Target className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                            <div className="font-bold text-blue-400">156</div>
                            <div className="text-gray-400">Analisi</div>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-2">
                            <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
                            <div className="font-bold text-green-400">87%</div>
                            <div className="text-gray-400">Accuratezza</div>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-2">
                            <BarChart3 className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                            <div className="font-bold text-purple-400">
                              +24%
                            </div>
                            <div className="text-gray-400">ROI</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 border-t border-blue-800/30">
                        <button
                          onClick={() => {
                            logout();
                            setShowProfile(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-600/20 text-red-400 rounded-lg transition-all text-left"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Esci</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
              >
                Accedi
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
