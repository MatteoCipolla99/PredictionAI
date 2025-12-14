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

  useEffect(() => {
    // Carica user da localStorage
    const savedUser = localStorage.getItem("user");
    const savedSubscription = localStorage.getItem("subscription");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setSubscription(savedSubscription || "free");
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
    localStorage.removeItem("user");
    localStorage.removeItem("subscription");
  };

  const upgradeToPremium = () => {
    setSubscription("premium");
    localStorage.setItem("subscription", "premium");
  };

  const value = {
    user,
    loading,
    subscription,
    login,
    register,
    logout,
    upgradeToPremium,
    isPremium: subscription === "premium",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
