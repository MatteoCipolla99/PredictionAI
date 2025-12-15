import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve essere usato dentro ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Carica tema salvato o usa system preference
    const saved = localStorage.getItem("theme");
    if (saved) return saved;

    // Controlla preferenze sistema
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    // Salva tema
    localStorage.setItem("theme", theme);

    // Applica tema al document
    const root = document.documentElement;

    // Rimuovi entrambe le classi per evitare conflitti e aggiungi quella corrente
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Aggiorna meta theme-color per mobile
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "dark" ? "#0f172a" : "#f8fafc"
      );
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setDarkTheme = () => setTheme("dark");
  const setLightTheme = () => setTheme("light");

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setDarkTheme,
        setLightTheme,
        isDark: theme === "dark",
        isLight: theme === "light",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
