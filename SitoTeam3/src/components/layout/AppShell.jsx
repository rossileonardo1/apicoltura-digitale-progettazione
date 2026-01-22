import { useContext } from "react";
import { useLocation } from "react-router-dom";
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
          <stop offset="100%" style={{ stopColor:  '#FFC107', stopOpacity: 0.95 }} />
        </linearGradient>
      </defs>
      <path d="M0,0 L0,30 Q50,35 100,30 T200,30 Q250,32 300,30 T400,30 Q450,35 500,30 T600,30 Q650,32 700,30 T800,30 Q850,35 900,30 T1000,30 Q1050,32 1100,30 T1200,30 L1200,0 Z" fill="url(#honeyGradient)" />
      <ellipse cx="150" cy="40" rx="8" ry="12" fill="url(#honeyGradient)" opacity="0.9" />
      <ellipse cx="350" cy="45" rx="6" ry="10" fill="url(#honeyGradient)" opacity="0.85" />
      <ellipse cx="550" cy="42" rx="7" ry="11" fill="url(#honeyGradient)" opacity="0.9" />
      <ellipse cx="750" cy="47" rx="6" ry="9" fill="url(#honeyGradient)" opacity="0.85" />
      <ellipse cx="950" cy="43" rx="7" ry="10" fill="url(#honeyGradient)" opacity="0.9" />
      <ellipse cx="1100" cy="46" rx="6" ry="10" fill="url(#honeyGradient)" opacity="0.85" />
    </svg>
  );
}

export default function AppShell({ children, onMenu }) {
  const { userAuthed, adminAuthed } = useContext(AppContext);
  const { pathname } = useLocation();
  
  // ✅ Pagine dove il menu NON deve apparire (pagine di login)
  const isLoginPage = pathname === "/user/login" || pathname === "/admin/access";
  
  // ✅ Mostra il menu se:  NON sei in una pagina di login E almeno uno dei due è autenticato
  const showMenu = !isLoginPage && (userAuthed || adminAuthed);

  return (
    <div className="min-h-screen w-full bg-bee">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40">
        <div className="header-glass relative">
          <HoneyDrip />
          
          <div className="mx-auto max-w-6xl px-4 py-4 relative z-20">
            <div className="flex items-center">
              
              {/* Menu hamburger */}
              {showMenu && (
                <button
                  className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/70 hover:bg-white border border-amber-300 text-xl transition-all"
                  onClick={onMenu}
                >
                  ☰
                </button>
              )}
              
            </div>
          </div>
        </div>
      </header>

      {/* CONTENUTO */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="glass-light rounded-2xl p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}