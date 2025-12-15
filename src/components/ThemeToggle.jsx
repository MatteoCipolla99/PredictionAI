import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Theme Toggle Button Component (pulsante semplice)
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

// Theme Switch Component (switch animato usato nell'Header)
export const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-3">
      <span className="hidden md:block text-sm text-gray-400">
        {theme === "dark" ? "Scura" : "Chiara"}
      </span>
      <button
        onClick={toggleTheme}
        className={`relative w-14 h-7 rounded-full transition-colors focus:outline-none ${
          theme === "dark" ? "bg-blue-600" : "bg-gray-300"
        }`}
        aria-label="Cambia tema"
      >
        <div
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform flex items-center justify-center shadow-sm ${
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

export default ThemeToggle;
