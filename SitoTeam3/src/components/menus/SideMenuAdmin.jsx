import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function SideMenuAdmin({ open, onClose }) {
  const nav = useNavigate();
  const { adminAuthed } = useContext(AppContext);

  if (!open) return null;

  const Item = ({ label, to, disabled }) => (
    <button
      disabled={disabled}
      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        disabled ? "opacity-40 cursor-not-allowed text-gray-700" : "hover:bg-white/30 text-gray-900"
      }`}
      onClick={() => {
        if (disabled) return;
        nav(to);
        onClose();
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div 
        className="absolute left-6 top-20 w-60 menu-honey rounded-xl p-2 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Item label="🔐 Accesso Admin" to="/admin/access" />
        <div className="my-2 h-px bg-white/20" />
        <Item label="🏠 Home Admin" to="/admin/home" disabled={!adminAuthed} />
        <Item label="➕ Aggiungi Arnia" to="/admin/addHive" disabled={!adminAuthed} />
        <Item label="🐝 Arnia Selezionata" to="/admin/hive" disabled={!adminAuthed} />
        <div className="my-2 h-px bg-white/20" />
        <Item label="👤 Torna Area Utente" to="/user/home" />
      </div>
    </div>
  );
}