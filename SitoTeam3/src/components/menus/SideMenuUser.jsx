import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function SideMenuUser({ open, onClose }) {
  const nav = useNavigate();
  const { userAuthed, setUserAuthed, setAdminAuthed } = useContext(AppContext);

  // 🔒 se non loggato utente, menu non appare proprio
  if (!open || !userAuthed) return null;

  const Item = ({ label, to, onClick }) => (
    <button
      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/60 text-sm"
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
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="absolute left-6 top-20 w-60 rounded-xl border bg-orange-200 p-2 shadow">
        <Item label="Home utente" to="/user/home" />
        <Item label="Temperatura" to="/user/temp" />
        <Item label="Umidità" to="/user/hum" />
        <Item label="Peso" to="/user/weight" />
        <Item label="Centro Notifiche" to="/user/notif" />
        <div className="my-2 h-px bg-black/10" />
        <Item label="Accesso Admin" to="/admin/access" />
        <Item
          label="Logout"
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
