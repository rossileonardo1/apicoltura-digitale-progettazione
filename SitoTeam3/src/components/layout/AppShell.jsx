import { useContext } from "react";
import { AppContext } from "../../App";

export default function AppShell({ children, title, subtitle, onMenu, onProfile }) {
  const { userAuthed } = useContext(AppContext);

  return (
    <div className="min-h-screen w-full bg-bee">
      {/* HEADER */}
      <header className="sticky top-0 z-40">
        <div className="glass-dark bee-stripes">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <button
                className="icon-btn"
                disabled={!userAuthed}
                onClick={userAuthed ? onMenu : undefined}
                title={userAuthed ? "Menu" : "Fai login per usare il menu"}
              >
                ☰
              </button>

              <div className="min-w-0 text-center">
                <div className="text-[15px] font-semibold tracking-tight truncate">
                  {title}
                </div>
                {subtitle && (
                  <div className="text-[12px] text-white/60 truncate">
                    {subtitle}
                  </div>
                )}
              </div>

              <button className="icon-btn" onClick={onProfile}>
                👤
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="glass-dark rounded-2xl p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
