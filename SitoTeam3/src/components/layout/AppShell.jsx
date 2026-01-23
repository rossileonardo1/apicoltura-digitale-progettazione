export default function AppShell({ onMenu, showMenuButton = true, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* ✅ SOLO IL PULSANTE HAMBURGER (se showMenuButton = true) */}
          {showMenuButton && (
            <button
              onClick={onMenu}
              className="w-10 h-10 rounded-xl bg-amber-400 hover:bg-amber-500 flex items-center justify-center text-white transition-all shadow-md hover:shadow-lg"
            >
              <span className="text-xl font-bold">☰</span>
            </button>
          )}

          {/* ✅ SPAZIO VUOTO - niente titolo, niente profilo */}
          <div className="flex-1"></div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}