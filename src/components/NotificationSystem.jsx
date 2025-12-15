import { useState, useEffect } from "react";
import { Bell, X, AlertCircle, CheckCircle, Info } from "lucide-react";

const NotificationSystem = ({ onAddNotification }) => {
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState("default");
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    // Carica notifiche salvate
    const saved = localStorage.getItem("notifications");
    if (saved) {
      setNotifications(JSON.parse(saved));
    }

    // Controlla permessi
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    // Salva notifiche
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm === "granted") {
        addNotification(
          "success",
          "Notifiche Attivate",
          "Riceverai notifiche push per eventi importanti"
        );
      }
    }
  };

  const sendPushNotification = (title, options) => {
    if (permission === "granted" && "Notification" in window) {
      new Notification(title, {
        icon: "/vite.svg",
        badge: "/vite.svg",
        vibrate: [200, 100, 200],
        ...options,
      });
    }
  };

  const addNotification = (type, title, message) => {
    const notif = {
      id: Date.now(),
      type,
      title,
      message,
      time: new Date().toLocaleTimeString("it-IT"),
      read: false,
      timestamp: Date.now(),
    };

    setNotifications((prev) => [notif, ...prev].slice(0, 50));

    // Invia push notification
    sendPushNotification(title, {
      body: message,
      tag: type,
    });

    // Callback per notificare il parent
    if (onAddNotification) {
      onAddNotification(notif);
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    if (window.confirm("Eliminare tutte le notifiche?")) {
      setNotifications([]);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      case "warning":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getTypeColors = (type) => {
    switch (type) {
      case "success":
        return "bg-green-600/20 text-green-400 border-green-500/30";
      case "error":
        return "bg-red-600/20 text-red-400 border-red-500/30";
      case "warning":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-blue-600/20 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 hover:bg-slate-800 rounded-lg transition-all"
        title="Notifiche"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPanel(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-slate-900 border border-blue-800/30 rounded-xl shadow-2xl max-h-[500px] overflow-hidden z-50 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-blue-800/30 flex items-center justify-between bg-slate-900 sticky top-0">
              <div>
                <h3 className="font-bold">Notifiche</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-gray-400">
                    {unreadCount} non {unreadCount === 1 ? "letta" : "lette"}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {permission !== "granted" && (
                  <button
                    onClick={requestPermission}
                    className="text-xs px-3 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-all"
                  >
                    Abilita Push
                  </button>
                )}
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs px-3 py-1 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-all"
                  >
                    Segna tutte
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs px-3 py-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-all"
                  >
                    Cancella
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Nessuna notifica</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Le notifiche appariranno qui
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-blue-800/10 hover:bg-slate-800/50 transition-all ${
                      !notif.read ? "bg-blue-900/20" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg border ${getTypeColors(
                          notif.type
                        )}`}
                      >
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-medium text-sm">
                            {notif.title}
                          </div>
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="p-1 hover:bg-slate-800 rounded transition-all flex-shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {notif.message}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-gray-500">
                            {notif.time}
                          </div>
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              Segna come letta
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-blue-800/30 bg-slate-900 text-center">
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Cancella tutte le notifiche
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Hook per usare le notifiche
export const useNotifications = () => {
  const [notificationComponent, setNotificationComponent] = useState(null);

  const addNotification = (type, title, message) => {
    if (notificationComponent) {
      notificationComponent.addNotification(type, title, message);
    }
  };

  return {
    NotificationSystem: (props) => (
      <NotificationSystem ref={setNotificationComponent} {...props} />
    ),
    addNotification,
  };
};

export default NotificationSystem;
