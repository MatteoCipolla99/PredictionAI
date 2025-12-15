const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-primary/30 bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                StatsCalcio AI Pro
              </h1>
              <div className="text-xs text-muted">Complete Platform</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-surface-light rounded-lg transition-all"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <NotificationSystem userId="demo" />
          </div>
        </div>
      </div>
    </header>
  );
};
