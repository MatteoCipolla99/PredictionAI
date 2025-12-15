import { defaultAllowedOrigins } from "vite";

const NotificationSystem = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState("default");
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      setPermission(perm);
    }
  };

  const sendPushNotification = (title, options) => {
    if (permission === "granted") {
      new Notification(title, {
        icon: "/vite.svg",
        badge: "/vite.svg",
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
      time: new Date().toLocaleTimeString(),
      read: false,
    };
    setNotifications((prev) => [notif, ...prev].slice(0, 50));
    sendPushNotification(title, { body: message, tag: type });
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => setNotifications([]);

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 hover:bg-surface-light rounded-lg transition-all"
      >
        <Bell className="w-5 h-5" />
        {notifications.filter((n) => !n.read).length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {showPanel && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPanel(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-surface border border-primary/30 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">
            <div className="p-4 border-b border-primary/30 flex items-center justify-between sticky top-0 bg-surface">
              <h3 className="font-bold">Notifiche</h3>
              <div className="flex gap-2">
                {permission !== "granted" && (
                  <button
                    onClick={requestPermission}
                    className="text-xs px-2 py-1 bg-primary/20 text-primary rounded"
                  >
                    Abilita Push
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="text-xs px-2 py-1 bg-red-600/20 text-red-400 rounded"
                >
                  Cancella
                </button>
              </div>
            </div>
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted">Nessuna notifica</div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 border-b border-primary/10 hover:bg-surface-light cursor-pointer ${
                    !notif.read ? "bg-primary/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        notif.type === "success"
                          ? "bg-green-600/20 text-green-400"
                          : notif.type === "warning"
                          ? "bg-yellow-600/20 text-yellow-400"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{notif.title}</div>
                      <div className="text-xs text-muted mt-1">
                        {notif.message}
                      </div>
                      <div className="text-xs text-muted mt-1">
                        {notif.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationSystem;
