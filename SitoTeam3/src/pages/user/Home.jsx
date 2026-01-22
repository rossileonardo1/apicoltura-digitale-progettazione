import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function Home() {
  const nav = useNavigate();
  const {
    hives,
    selectedHiveId,
    setSelectedHiveId,
    showValues,
    setShowValues,
    sensorValues,
    thresholds // <--- ORA PRENDIAMO LE SOGLIE DA QUI
  } = useContext(AppContext);

  // Funzione che calcola lo stato basandosi sulle soglie dell'Admin
  const getStatus = (type, value) => {
    const val = parseFloat(value);
    const th = thresholds[type]; // Prende min/max per temp, hum o weight

    // Se per qualche motivo le soglie non sono caricate, torna N/A
    if (!th) return { icon: "❓", color: "text-gray-400", label: "N/A" };

    switch (type) {
      case "temp":
        if (val > th.max) return { icon: "🔥", color: "text-red-500", label: "Surriscaldata" };
        if (val < th.min) return { icon: "❄️", color: "text-blue-500", label: "Troppo Fredda" };
        return { icon: "✅", color: "text-green-600", label: "Temp. Ottimale" };

      case "hum":
        if (val > th.max) return { icon: "💧", color: "text-blue-600", label: "Troppo Umida" };
        if (val < th.min) return { icon: "🌵", color: "text-orange-500", label: "Troppo Secca" };
        return { icon: "✅", color: "text-green-600", label: "Umidità Ok" };

      case "weight":
        // Per il peso, il pericolo principale è scendere sotto il minimo (fame)
        if (val < th.min) return { icon: "⚠️", color: "text-red-500", label: "Scorte Critiche" };
        // Opzionale: se supera il max, magari è piena zeppa (non è un errore ma una notifica positiva)
        if (val > th.max) return { icon: "🍯", color: "text-amber-500", label: "Arnia Piena" };
        return { icon: "✅", color: "text-green-600", label: "Peso Regolare" };

      default:
        return { icon: "❓", color: "text-gray-400", label: "N/A" };
    }
  };

  const StatTile = ({ icon, label, value, unit, to, type }) => {
    // Calcolo stato dinamico
    const status = getStatus(type, value);

    return (
      <div
        onClick={() => nav(to)}
        className="card-white rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-4xl">{icon}</div>
          <div className="text-xs text-gray-600 font-medium">Apri →</div>
        </div>

        <div className="text-xs text-gray-600 font-semibold mb-1">{label}</div>

        <div className="text-2xl font-bold text-gray-900 min-h-[32px] flex items-center">
          {showValues ? (
            // VISTA NUMERICA
            <>
              {value}
              <span className="text-gray-600 text-lg ml-1">{unit}</span>
            </>
          ) : (
            // VISTA PRIVACY (STATUS)
            <div className={`flex items-center gap-2 ${status.color}`}>
              <span className="text-2xl">{status.icon}</span>
              <span className="font-bold text-sm uppercase tracking-wide opacity-90">
                {status.label}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Selezione arnia */}
      <div className="card-white rounded-xl p-4">
        <div className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
          Seleziona Arnia
        </div>

        <select
          className="select-honey h-10 w-full rounded-xl px-3 text-sm font-medium text-gray-900 border-amber-200 focus:border-amber-400"
          value={selectedHiveId}
          onChange={(e) => setSelectedHiveId(e.target.value)}
        >
          {hives.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name} — {h.location}
            </option>
          ))}
        </select>
      </div>

      {/* Toggle Privacy */}
      <div className="card-white rounded-xl p-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-gray-900">Modalità Privacy</div>
          <div className="text-xs text-gray-500">
            {showValues ? "Stai vedendo i valori esatti" : "Vedi solo lo stato di salute"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 font-semibold uppercase">
            {showValues ? "Valori" : "Stato"}
          </span>
          <button
            onClick={() => setShowValues(!showValues)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showValues ? 'bg-amber-400' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                showValues ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Griglia Statistiche */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatTile 
          type="hum"
          icon="💧" 
          label="Umidità" 
          value={sensorValues.hum} 
          unit="%" 
          to="/user/hum" 
        />
        <StatTile 
          type="temp"
          icon="🌡️" 
          label="Temperatura" 
          value={sensorValues.temp} 
          unit="°C" 
          to="/user/temp" 
        />
        <StatTile 
          type="weight"
          icon="⚖️" 
          label="Peso" 
          value={sensorValues.weight} 
          unit="kg" 
          to="/user/weight" 
        />
      </div>

      {/* Notifiche */}
      <button
        className="btn-honey w-full h-12 rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
        onClick={() => nav("/user/notif")}
      >
        <span>🔔</span> 
        <span className="font-semibold">Centro notifiche</span>
      </button>
    </div>
  );
}