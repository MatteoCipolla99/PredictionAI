import { createContext, useContext, useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

// Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve essere usato dentro ThemeProvider");
  }
  return context;
};

// Theme Provider
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

    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }

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

// Theme Toggle Button Component
const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-all ${className}`}
      title={theme === "dark" ? "Modalità chiara" : "Modalità scura"}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600" />
      )}
    </button>
  );
};

// Theme Switch Component (con animazione)
export const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400">
        {theme === "dark" ? "Scura" : "Chiara"}
      </span>
      <button
        onClick={toggleTheme}
        className={`relative w-14 h-7 rounded-full transition-colors ${
          theme === "dark" ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform flex items-center justify-center ${
            theme === "dark" ? "translate-x-7" : "translate-x-0"
          }`}
        >
          {theme === "dark" ? (
            <Moon className="w-3 h-3 text-blue-600" />
          ) : (
            <Sun className="w-3 h-3 text-yellow-500" />
          )}
        </div>
      </button>
    </div>
  );
};

// CSS per i temi (da aggiungere al tuo CSS globale)
export const themeStyles = `
  /* Dark Theme (default) */
  :root {
    --bg-primary: 15 23 42;        /* slate-900 */
    --bg-secondary: 30 41 59;      /* slate-800 */
    --bg-tertiary: 51 65 85;       /* slate-700 */
    --text-primary: 248 250 252;   /* slate-50 */
    --text-secondary: 148 163 184; /* slate-400 */
    --border-primary: 59 130 246;  /* blue-500 */
    --accent: 168 85 247;          /* purple-500 */
  }

  /* Light Theme */
  .light {
    --bg-primary: 248 250 252;     /* slate-50 */
    --bg-secondary: 241 245 249;   /* slate-100 */
    --bg-tertiary: 226 232 240;    /* slate-200 */
    --text-primary: 15 23 42;      /* slate-900 */
    --text-secondary: 100 116 139; /* slate-500 */
    --border-primary: 37 99 235;   /* blue-600 */
    --accent: 147 51 234;          /* purple-600 */
  }

  /* Background utilities */
  .bg-primary {
    background-color: rgb(var(--bg-primary));
  }
  .bg-secondary {
    background-color: rgb(var(--bg-secondary));
  }
  .bg-tertiary {
    background-color: rgb(var(--bg-tertiary));
  }

  /* Text utilities */
  .text-primary {
    color: rgb(var(--text-primary));
  }
  .text-secondary {
    color: rgb(var(--text-secondary));
  }

  /* Border utilities */
  .border-primary {
    border-color: rgb(var(--border-primary));
  }

  /* Smooth transitions */
  * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }

  /* Scrollbar styling per dark/light */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: rgb(var(--bg-secondary));
  }

  ::-webkit-scrollbar-thumb {
    background: rgb(var(--text-secondary));
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgb(var(--border-primary));
  }
`;

export default ThemeToggle;
