import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function SideMenuUser({ open, onClose }) {
  const nav = useNavigate();
  
  // ✅ PRENDI TUTTO DAL CONTEXT
  const { 
    setUserAuthed, 
    setAdminAuthed,
    hives,
    selectedHiveId,
    setSelectedHiveId 
  } = useContext(AppContext);

  const handleLogout = () => {
    setUserAuthed(false);
    setAdminAuthed(false);
    localStorage.removeItem("userAuthed");
    localStorage.removeItem("adminAuthed");
    onClose();
    nav("/user/login");
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Menu laterale */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-amber-200 bg-white/50">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🐝</div>
              <div>
                <div className="text-lg font-bold text-gray-900">Menu Utente</div>
                <div className="text-xs text-gray-600">Gestione Arnie</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white hover:bg-amber-100 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Selezione Arnia */}
          <div className="p-4 border-b border-amber-200 bg-white/30">
            <div className="text-xs font-semibold text-gray-600 mb-2">
              Arnia Selezionata
            </div>
            {hives && hives.length > 0 ? (
              <select
                value={selectedHiveId || ""}
                onChange={(e) => setSelectedHiveId(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border-2 border-amber-200 bg-white text-gray-900 font-medium focus:border-amber-400 focus:outline-none"
              >
                {hives.map((hive) => (
                  <option key={hive.id} value={hive.id}>
                    🐝 {hive.name} — {hive.apiarioNome}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-center p-3 bg-gray-100 rounded-xl text-gray-500 text-sm">
                Nessuna arnia disponibile
              </div>
            )}
          </div>

          {/* Menu items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <button
              onClick={() => {
                nav("/user/home");
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/70 transition-all text-left group"
            >
              <div className="text-2xl">🏠</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Home</div>
                <div className="text-xs text-gray-600">Dashboard principale</div>
              </div>
            </button>

            <button
              onClick={() => {
                nav("/user/map");
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/70 transition-all text-left group"
            >
              <div className="text-2xl">🗺️</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Mappa</div>
                <div className="text-xs text-gray-600">Posizione arnie</div>
              </div>
            </button>

            <button
              onClick={() => {
                nav("/user/temp");
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/70 transition-all text-left group"
            >
              <div className="text-2xl">🌡️</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Temperatura</div>
                <div className="text-xs text-gray-600">Monitoraggio termico</div>
              </div>
            </button>

            <button
              onClick={() => {
                nav("/user/hum");
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/70 transition-all text-left group"
            >
              <div className="text-2xl">💧</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Umidità</div>
                <div className="text-xs text-gray-600">Livello umidità</div>
              </div>
            </button>

            <button
              onClick={() => {
                nav("/user/weight");
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/70 transition-all text-left group"
            >
              <div className="text-2xl">⚖️</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Peso</div>
                <div className="text-xs text-gray-600">Peso arnia</div>
              </div>
            </button>

            <button
              onClick={() => {
                nav("/user/notif");
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/70 transition-all text-left group"
            >
              <div className="text-2xl">🔔</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Notifiche</div>
                <div className="text-xs text-gray-600">Avvisi e allarmi</div>
              </div>
            </button>
          </div>

          {/* Footer con logout e admin */}
          <div className="p-4 border-t border-amber-200 bg-white/50 space-y-2">
            <button
              onClick={() => {
                nav("/admin/access");
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all text-left"
            >
              <div className="text-2xl">🛠️</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Area Admin</div>
                <div className="text-xs text-gray-600">Gestione avanzata</div>
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-100 hover:bg-red-200 transition-all text-left"
            >
              <div className="text-2xl">🚪</div>
              <div className="flex-1">
                <div className="font-semibold text-red-900">Logout</div>
                <div className="text-xs text-red-700">Esci dall'applicazione</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}