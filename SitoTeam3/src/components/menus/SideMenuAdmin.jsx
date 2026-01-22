import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function SideMenuAdmin({ open, onClose }) {
  const nav = useNavigate();
  const { adminAuthed } = useContext(AppContext);

  if (!open) return null;

  const Item = ({ emoji, label, to, disabled }) => (
    <button
      disabled={disabled}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
        transition-all duration-200 group
        ${disabled 
          ? 'opacity-40 cursor-not-allowed text-gray-700' 
          : 'hover:bg-white/40 text-gray-900 hover:shadow-sm'
        }
      `}
      onClick={() => {
        if (disabled) return;
        nav(to);
        onClose();
      }}
    >
      <span className={`text-2xl ${! disabled && 'group-hover:scale-110'} transition-transform`}>
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
            <span className="text-3xl">🔐</span>
            <div>
              <div className="text-lg font-bold text-gray-900">Area Admin</div>
              <div className="text-xs text-gray-700">Configurazione avanzata</div>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/30 mb-2" />

        {/* Login */}
        <Item emoji="🔐" label="Accesso Admin" to="/admin/access" />
        
        <div className="h-px bg-white/30 my-2" />

        {/* Gestione arnie */}
        <div className="px-2 py-1">
          <div className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
            Gestione
          </div>
          <div className="space-y-1">
            <Item emoji="🏠" label="Home Admin" to="/admin/home" disabled={!adminAuthed} />
            <Item emoji="➕" label="Aggiungi Arnia" to="/admin/addHive" disabled={!adminAuthed} />
            <Item emoji="🐝" label="Arnia Selezionata" to="/admin/hive" disabled={!adminAuthed} />
          </div>
        </div>

        <div className="h-px bg-white/30 my-2" />

        {/* Torna indietro */}
        <Item emoji="👤" label="Torna Area Utente" to="/user/home" />
      </div>
    </div>
  );
}