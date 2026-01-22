import { useContext } from "react";
import { AppContext } from "../../App";

// SVG Effetto Miele che Gocciola
function HoneyDrip() {
  return (
    <svg 
      className="honey-drip" 
      viewBox="0 0 1200 80" 
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="honeyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FFD54F', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FFC107', stopOpacity: 0.95 }} />
        </linearGradient>
      </defs>
      
      {/* Miele che gocciola */}
      <path
        d="M0,0 L0,30 Q50,35 100,30 T200,30 Q250,32 300,30 T400,30 Q450,35 500,30 T600,30 Q650,32 700,30 T800,30 Q850,35 900,30 T1000,30 Q1050,32 1100,30 T1200,30 L1200,0 Z"
        fill="url(#honeyGradient)"
      />
      
      {/* Gocce di miele */}
      <ellipse cx="150" cy="40" rx="8" ry="12" fill="url(#honeyGradient)" opacity="0.9" />
      <ellipse cx="350" cy="45" rx="6" ry="10" fill="url(#honeyGradient)" opacity="0.85" />
      <ellipse cx="550" cy="42" rx="7" ry="11" fill="url(#honeyGradient)" opacity="0.9" />
      <ellipse cx="750" cy="47" rx="6" ry="9" fill="url(#honeyGradient)" opacity="0.85" />
      <ellipse cx="950" cy="43" rx="7" ry="10" fill="url(#honeyGradient)" opacity="0.9" />
      <ellipse cx="1100" cy="46" rx="6" ry="10" fill="url(#honeyGradient)" opacity="0.85" />
      
      {/* Gocce più piccole */}
      <ellipse cx="250" cy="55" rx="4" ry="7" fill="url(#honeyGradient)" opacity="0.7" />
      <ellipse cx="650" cy="58" rx="4" ry="6" fill="url(#honeyGradient)" opacity="0.7" />
      <ellipse cx="850" cy="56" rx="5" ry="7" fill="url(#honeyGradient)" opacity="0.75" />
    </svg>
  );
}

export default function AppShell({ children, title, subtitle, onMenu, onProfile }) {
  const { userAuthed } = useContext(AppContext);

  return (
    <div className="min-h-screen w-full bg-bee">
      {/* HEADER */}
      <header className="sticky top-0 z-40">
        <div className="header-glass relative">
          {/* Effetto miele che gocciola */}
          <HoneyDrip />
          
          <div className="mx-auto max-w-6xl px-4 py-4 relative z-20">
            <div className="flex items-center justify-between gap-3">
              <button
                className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/70 hover:bg-white border border-amber-300 text-xl disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!userAuthed}
                onClick={userAuthed ? onMenu : undefined}
                title={userAuthed ? "Menu" : "Fai login per usare il menu"}
              >
                ☰
              </button>

              <div className="min-w-0 text-center">
                <div className="text-[16px] font-bold tracking-tight truncate text-gray-900">
                  {title}
                </div>
                {subtitle && (
                  <div className="text-[12px] text-gray-700 truncate">
                    {subtitle}
                  </div>
                )}
              </div>

              <button 
                className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/70 hover:bg-white border border-amber-300 text-xl"
                onClick={onProfile}
              >
                👤
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="glass-light rounded-2xl p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}