import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function AdminHive() {
  const nav = useNavigate();
  const { selectedHive, thresholds } = useContext(AppContext);

  if (!selectedHive) {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl border bg-white/55 p-3">
          <div className="text-sm font-semibold">Nessuna arnia selezionata</div>
          <div className="text-[12px] text-black/60">Torna alla home admin e seleziona un’arnia.</div>
        </div>

        <button onClick={() => nav("/admin/home")} className="w-full rounded-2xl border bg-white/70 py-3">
          Vai a Home Admin
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-white/55 p-3">
        <div className="text-sm font-semibold">Arnia selezionata</div>
        <div className="text-[12px] text-black/70">ID: {selectedHive.id}</div>
        <div className="text-[12px] text-black/70">Località: {selectedHive.location}</div>
      </div>

      <div className="rounded-2xl border bg-white/55 p-3 space-y-2">
        <div className="text-sm font-semibold mb-1">Parametri configurabili</div>

        <button onClick={() => nav("/admin/th-temp")} className="w-full rounded-2xl border bg-white py-3 text-left px-4">
          🌡️ Temperatura — {thresholds.temp.min}°C / {thresholds.temp.max}°C
        </button>

        <button onClick={() => nav("/admin/th-hum")} className="w-full rounded-2xl border bg-white py-3 text-left px-4">
          💧 Umidità — {thresholds.hum.min}% / {thresholds.hum.max}%
        </button>

        <button onClick={() => nav("/admin/th-weight")} className="w-full rounded-2xl border bg-white py-3 text-left px-4">
          ⚖️ Peso — {thresholds.weight.min}KG / {thresholds.weight.max}KG
        </button>
      </div>

      <button onClick={() => nav("/admin/home")} className="w-full rounded-2xl border bg-white/70 py-3">
        Indietro
      </button>
    </div>
  );
}
