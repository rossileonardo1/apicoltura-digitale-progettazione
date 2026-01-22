import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function Notifications() {
  const nav = useNavigate();
  const { notifications } = useContext(AppContext);
  const [date, setDate] = useState("");

  const filtered = useMemo(() => {
    if (!date) return notifications;
    return notifications.filter((n) => n.date === date);
  }, [date, notifications]);

  return (
    <div className="space-y-4">
      <div className="text-center text-8xl mb-4">🗓️</div>

      <div className="card-white rounded-2xl p-4">
        <div className="text-sm font-bold text-gray-900 mb-3">Seleziona Data</div>
        <input
          type="date"
          className="input-honey w-full h-10 rounded-xl px-3 text-sm text-gray-900"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="text-xs text-gray-600 mt-2">
          {date ? `Filtrate per: ${date}` : "Mostro tutte le notifiche"}
        </div>
      </div>

      <div className="card-white rounded-2xl p-4">
        <div className="text-sm font-bold text-gray-900 mb-3">Notifiche</div>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-sm text-gray-600 text-center py-4">
              Nessuna notifica per la data selezionata.
            </div>
          ) : (
            filtered.map((n) => (
              <div key={n.id} className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="text-xs text-gray-600 font-semibold">{n.date}</div>
                <div className="text-sm text-gray-900 font-medium mt-1">{n.text}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <button onClick={() => nav("/user/home")} className="btn-white w-full h-12 rounded-xl">
        ← Indietro
      </button>
    </div>
  );
}