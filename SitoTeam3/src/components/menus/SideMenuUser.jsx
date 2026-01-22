import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function SideMenuUser({ open, onClose }) {
  const nav = useNavigate();
  const { userAuthed, setUserAuthed, setAdminAuthed } = useContext(AppContext);

  if (!open || !userAuthed) return null;

  const Item = ({ label, to, onClick }) => (
    <button
      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/30 text-sm font-medium text-gray-900 transition-all"
      onClick={() => {
        if (onClick) onClick();
        if (to) nav(to);
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
        <Item label="🏠 Home utente" to="/user/home" />
        <Item label="🌡️ Temperatura" to="/user/temp" />
        <Item label="💧 Umidità" to="/user/hum" />
        <Item label="⚖️ Peso" to="/user/weight" />
        <Item label="🔔 Centro Notifiche" to="/user/notif" />
        <div className="my-2 h-px bg-white/20" />
        <Item label="🛠️ Accesso Admin" to="/admin/access" />
        <Item
          label="🚪 Logout"
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