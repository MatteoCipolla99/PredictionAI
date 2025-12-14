import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState("free");
  const [dailyAnalysisCount, setDailyAnalysisCount] = useState(0);
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString());

  useEffect(() => {
    // Carica user da localStorage
    const savedUser = localStorage.getItem("user");
    const savedSubscription = localStorage.getItem("subscription");
    const savedCount = localStorage.getItem("dailyAnalysisCount");
    const savedResetDate = localStorage.getItem("lastResetDate");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setSubscription(savedSubscription || "free");
    }

    // Reset conteggio giornaliero
    const today = new Date().toDateString();
    if (savedResetDate !== today) {
      setDailyAnalysisCount(0);
      localStorage.setItem("lastResetDate", today);
      localStorage.setItem("dailyAnalysisCount", "0");
    } else {
      setDailyAnalysisCount(Number(savedCount) || 0);
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simula login API
      const mockUser = {
        id: Date.now(),
        email,
        name: email.split("@")[0],
        avatar: `https://ui-avatars.com/api/?name=${email}&background=3b82f6&color=fff`,
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, name) => {
    try {
      const mockUser = {
        id: Date.now(),
        email,
        name,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=3b82f6&color=fff`,
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setSubscription("free");
    setDailyAnalysisCount(0);
    localStorage.removeItem("user");
    localStorage.removeItem("subscription");
    localStorage.removeItem("dailyAnalysisCount");
  };

  const upgradeToPremium = () => {
    setSubscription("premium");
    localStorage.setItem("subscription", "premium");
  };

  const incrementAnalysisCount = () => {
    const newCount = dailyAnalysisCount + 1;
    setDailyAnalysisCount(newCount);
    localStorage.setItem("dailyAnalysisCount", newCount.toString());
  };

  const canUseAnalysis = () => {
    if (subscription === "premium") return true;
    return dailyAnalysisCount < 5;
  };

  const getRemainingAnalyses = () => {
    if (subscription === "premium") return "Illimitate";
    return Math.max(0, 5 - dailyAnalysisCount);
  };

  const value = {
    user,
    loading,
    subscription,
    dailyAnalysisCount,
    login,
    register,
    logout,
    upgradeToPremium,
    incrementAnalysisCount,
    canUseAnalysis,
    getRemainingAnalyses,
    isPremium: subscription === "premium",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
