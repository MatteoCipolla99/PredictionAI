import { useState } from "react";
import {
  BarChart3,
  Search,
  Bell,
  RefreshCw,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";

const Header = ({
  apiConnected,
  lastUpdate,
  loading,
  onRefresh,
  notifications,
  onMarkAsRead,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const NotificationIcon = ({ type }) => {
    const icons = {
      success: <Check className="w-4 h-4" />,
      warning: <AlertCircle className="w-4 h-4" />,
      info: <Bell className="w-4 h-4" />,
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
                placeholder="Cerca squadra..."
                className="pl-10 pr-4 py-2 bg-slate-800/50 border border-blue-700/30 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-slate-800 rounded-lg transition-all"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-blue-800/30 rounded-xl shadow-xl max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-blue-800/30 flex items-center justify-between">
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

            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-all">
              Premium
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
