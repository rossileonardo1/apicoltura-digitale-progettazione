import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../App";

export default function SideMenuUser({ open, onClose }) {
  const nav = useNavigate();
  const location = useLocation();
  const { setUserAuthed } = useContext(AppContext);

  const handleLogout = () => {
  localStorage.removeItem("userApiarioId");
  localStorage.removeItem("userApiKey");
  localStorage.removeItem("userAuthed");
  setUserAuthed(false);
  nav("/user/login");
};

  const menuItems = [
    { icon: "🏠", label: "Home", path: "/user/home" },
    { icon: "🌡️", label: "Temperatura", path: "/user/temp" },
    { icon: "💧", label: "Umidità", path: "/user/hum" },
    { icon: "⚖️", label: "Peso", path: "/user/weight" },
    { icon: "🔔", label: "Notifiche", path: "/user/notif" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Menu laterale */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-amber-50 to-yellow-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🐝</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">BeeMonitor</h2>
                  <p className="text-xs text-gray-600">Area Utente</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    nav(item.path);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    isActive(item.path)
                      ? "bg-amber-100 text-amber-900 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* ✅ PULSANTE LOGOUT */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all"
            >
              <span className="text-xl">🚪</span>
              <span>Logout</span>
            </button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              🐝 Apicoltura Digitale v1.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
}