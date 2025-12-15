import { useState, useEffect } from "react";
import { Bell, X, CheckCircle, AlertCircle, Info } from "lucide-react";

const NotificationSystem = ({ userId, onAddNotification }) => {
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState("default");
  const [showPanel, setShowPanel] = useState(false);

  // Controlla permessi notifiche browser
  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Carica notifiche salvate
  useEffect(() => {
    const saved = localStorage.getItem(`notifications_${userId}`);
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, [userId]);

  // Salva notifiche
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem(
        `notifications_${userId}`,
        JSON.stringify(notifications)
      );
    }
  }, [notifications, userId]);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      setPermission(perm);
    }
  };

  const sendPushNotification = (title, options) => {
    if (permission === "granted" && "Notification" in window) {
      try {
        new Notification(title, {
          icon: "/vite.svg",
          badge: "/vite.svg",
          ...options,
        });
      } catch (err) {
        console.warn("Push notification failed:", err);
      }
    }
  };

  const addNotification = (type, title, message) => {
    const notif = {
      id: Date.now(),
      type,
      title,
      message,
      time: new Date().toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
    };
    setNotifications((prev) => [notif, ...prev].slice(0, 50));
    sendPushNotification(title, { body: message, tag: type });

    // Callback se fornito
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

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem(`notifications_${userId}`);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      success: { Icon: CheckCircle, color: "text-green-400" },
      warning: { Icon: AlertCircle, color: "text-yellow-400" },
      error: { Icon: AlertCircle, color: "text-red-400" },
      info: { Icon: Info, color: "text-blue-400" },
    };
    const config = icons[type] || icons.info;
    return <config.Icon className={`w-4 h-4 ${config.color}`} />;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 hover:bg-slate-800 rounded-lg transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPanel(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-slate-900 border border-blue-800/30 rounded-xl shadow-xl max-h-[32rem] overflow-y-auto z-50">
            {/* Header */}
            <div className="sticky top-0 bg-slate-900 p-4 border-b border-blue-800/30 flex items-center justify-between z-10">
              <div>
                <h3 className="font-bold">Notifiche</h3>
                {unreadCount > 0 && (
                  <span className="text-xs text-gray-400">
                    {unreadCount} non {unreadCount === 1 ? "letta" : "lette"}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {permission !== "granted" && (
                  <button
                    onClick={requestPermission}
                    className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-all"
                  >
                    Abilita Push
                  </button>
                )}
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-all"
                  >
                    Leggi Tutto
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs px-2 py-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-all"
                  >
                    Cancella
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nessuna notifica</p>
              </div>
            ) : (
              <div>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-4 border-b border-blue-800/10 hover:bg-slate-800/50 cursor-pointer transition-all ${
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
                            : notif.type === "error"
                            ? "bg-red-600/20"
                            : "bg-blue-600/20"
                        }`}
                      >
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{notif.title}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {notif.message}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {notif.time}
                        </div>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Hook personalizzato per usare le notifiche
export const useNotifications = (userId) => {
  const [notificationSystem, setNotificationSystem] = useState(null);

  const addNotification = (type, title, message) => {
    if (notificationSystem && notificationSystem.addNotification) {
      notificationSystem.addNotification(type, title, message);
    }
  };

  return {
    addNotification,
    setNotificationSystem,
  };
};

export default NotificationSystem;
