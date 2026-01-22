import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function AdminHive() {
  const nav = useNavigate();
  const { selectedHive, thresholds } = useContext(AppContext);

  if (!selectedHive) {
    return (
      <div className="space-y-3">
        <div className="card-white rounded-2xl p-4">
          <div className="text-sm font-bold text-gray-900">Nessuna arnia selezionata</div>
          <div className="text-xs text-gray-600">Torna alla home admin e seleziona un'arnia.</div>
        </div>

        <button onClick={() => nav("/admin/home")} className="btn-white w-full h-12 rounded-xl">
          Vai a Home Admin
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card-white rounded-2xl p-4">
        <div className="text-sm font-bold text-gray-900 mb-2">Arnia selezionata</div>
        <div className="text-sm text-gray-600">ID: {selectedHive.id}</div>
        <div className="text-sm text-gray-600">Località: {selectedHive.location}</div>
      </div>

      <div className="card-white rounded-2xl p-4 space-y-2">
        <div className="text-sm font-bold text-gray-900 mb-3">Parametri configurabili</div>

        <button 
          onClick={() => nav("/admin/th-temp")} 
          className="w-full rounded-xl border border-amber-200 bg-amber-50 p-3 text-left hover:bg-amber-100 transition-colors"
        >
          <div className="text-gray-900 font-medium">
            🌡️ Temperatura — {thresholds.temp.min}°C / {thresholds.temp.max}°C
          </div>
        </button>

        <button 
          onClick={() => nav("/admin/th-hum")} 
          className="w-full rounded-xl border border-amber-200 bg-amber-50 p-3 text-left hover:bg-amber-100 transition-colors"
        >
          <div className="text-gray-900 font-medium">
            💧 Umidità — {thresholds.hum.min}% / {thresholds.hum.max}%
          </div>
        </button>

        <button 
          onClick={() => nav("/admin/th-weight")} 
          className="w-full rounded-xl border border-amber-200 bg-amber-50 p-3 text-left hover:bg-amber-100 transition-colors"
        >
          <div className="text-gray-900 font-medium">
            ⚖️ Peso — {thresholds.weight.min}KG / {thresholds.weight.max}KG
          </div>
        </button>
      </div>

      <button onClick={() => nav("/admin/home")} className="btn-white w-full h-12 rounded-xl">
        ← Indietro
      </button>
    </div>
  );
}