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
      <div className="text-center text-6xl">🗓️</div>

      <div className="rounded-2xl border bg-white/55 p-3">
        <div className="text-sm font-semibold mb-2">Seleziona Data</div>
        <input
          type="date"
          className="w-full h-10 rounded-xl border bg-white px-3 text-sm"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="text-[11px] text-black/60 mt-2">
          {date ? `Filtrate per: ${date}` : "Mostro tutte le notifiche"}
        </div>
      </div>

      <div className="rounded-2xl border bg-white/55 p-3">
        <div className="text-sm font-semibold mb-2">Notifiche</div>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-sm text-black/60">Nessuna notifica per la data selezionata.</div>
          ) : (
            filtered.map((n) => (
              <div key={n.id} className="rounded-xl border bg-white p-3">
                <div className="text-[11px] text-black/60">{n.date}</div>
                <div className="text-sm font-medium">{n.text}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <button onClick={() => nav("/user/home")} className="w-full rounded-2xl border bg-white/70 py-3">
        Indietro
      </button>
    </div>
  );
}
