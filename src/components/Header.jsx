import { useState } from "react";
import {
  BarChart3,
  Crown,
  Bell,
  Settings,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import UserProfile from "../context/UserProfile";

const Header = ({
  auth,
  notifications,
  onOpenAuth,
  onOpenPremium,
  apiConnected,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <header className="border-b border-blue-800/30 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                StatsCalcio AI Pro
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Analisi Professionale con AI</span>
                <span className="flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      apiConnected ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  ></span>
                  {apiConnected ? "Live" : "Demo"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {auth.user ? (
              <>
                {/* Analysis Counter */}
                {!auth.isPremium && (
                  <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-blue-700/30 rounded-lg">
                    <span className="text-xs text-gray-400">Analisi oggi:</span>
                    <span className="text-sm font-bold text-blue-400">
                      {auth.getRemainingAnalyses()}/5
                    </span>
                  </div>
                )}

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 hover:bg-slate-800 rounded-lg transition-all"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowNotifications(false)}
                      />
                      <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-blue-800/30 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">
                        <div className="sticky top-0 bg-slate-900 border-b border-blue-800/30 p-4 flex items-center justify-between">
                          <h3 className="font-bold">Notifiche</h3>
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="p-1 hover:bg-slate-800 rounded transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-400">
                            Nessuna notifica
                          </div>
                        ) : (
                          <div className="divide-y divide-blue-800/20">
                            {notifications.map((notif) => (
                              <div
                                key={notif.id}
                                className={`p-4 hover:bg-slate-800/50 transition-all ${
                                  !notif.read ? "bg-blue-600/10" : ""
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`p-2 rounded-lg ${
                                      notif.type === "success"
                                        ? "bg-green-600/20"
                                        : notif.type === "warning"
                                        ? "bg-yellow-600/20"
                                        : "bg-blue-600/20"
                                    }`}
                                  >
                                    {getNotificationIcon(notif.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
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
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Premium Button */}
                {!auth.isPremium && (
                  <button
                    onClick={onOpenPremium}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-sm font-medium hover:from-yellow-400 hover:to-orange-400 transition-all"
                  >
                    <Crown className="w-4 h-4" />
                    <span className="hidden md:inline">Upgrade</span>
                  </button>
                )}

                {/* User Profile */}
                <UserProfile
                  user={auth.user}
                  subscription={auth.subscription}
                  isPremium={auth.isPremium}
                  onLogout={auth.logout}
                  onOpenPremium={onOpenPremium}
                />
              </>
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
