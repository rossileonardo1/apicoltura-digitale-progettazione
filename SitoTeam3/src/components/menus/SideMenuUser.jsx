import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function SideMenuUser({ open, onClose }) {
  const nav = useNavigate();
  const { userAuthed, setUserAuthed, setAdminAuthed } = useContext(AppContext);

  if (!open || !userAuthed) return null;

  const Item = ({ emoji, label, to, onClick, danger }) => (
    <button
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
        transition-all duration-200 group
        ${danger 
          ? 'hover:bg-red-500/20 text-red-900 hover:text-red-950' 
          : 'hover: bg-white/40 text-gray-900 hover:shadow-sm'
        }
      `}
      onClick={() => {
        if (onClick) onClick();
        if (to) nav(to);
        onClose();
      }}
    >
      <span className="text-2xl group-hover:scale-110 transition-transform">
        {emoji}
      </span>
      <span className="font-semibold text-sm">
        {label}
      </span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      {/* Backdrop con blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      {/* Menu laterale */}
      <div 
        className="absolute left-6 top-20 w-72 menu-honey rounded-2xl p-3 shadow-2xl border-2 border-amber-400/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del menu */}
        <div className="px-4 py-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🐝</span>
            <div>
              <div className="text-lg font-bold text-gray-900">Area Utente</div>
              <div className="text-xs text-gray-700">Gestione arnie</div>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/30 mb-2" />

        {/* Voci principali */}
        <div className="space-y-1">
          <Item emoji="🏠" label="Home utente" to="/user/home" />
          <Item emoji="🗺️" label="Mappa Arnie" to="/user/map" />
        </div>

        <div className="h-px bg-white/30 my-2" />

        {/* Sensori */}
        <div className="px-2 py-1">
          <div className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
            Sensori
          </div>
          <div className="space-y-1">
            <Item emoji="🌡️" label="Temperatura" to="/user/temp" />
            <Item emoji="💧" label="Umidità" to="/user/hum" />
            <Item emoji="⚖️" label="Peso" to="/user/weight" />
          </div>
        </div>

        <div className="h-px bg-white/30 my-2" />

        {/* Altre funzioni */}
        <div className="space-y-1">
          <Item emoji="🔔" label="Centro Notifiche" to="/user/notif" />
          <Item emoji="🛠️" label="Accesso Admin" to="/admin/access" />
        </div>

        <div className="h-px bg-white/30 my-2" />

        {/* Logout */}
        <Item 
          emoji="🚪" 
          label="Logout" 
          danger
          onClick={() => {
            setUserAuthed(false);
            setAdminAuthed(false);
            nav("/user/login");
          }}
        />
      </div>
    </div>
  );
}