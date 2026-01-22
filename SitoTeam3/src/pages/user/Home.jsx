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
  } = useContext(AppContext);

  const StatTile = ({ icon, label, value, unit, to }) => (
    <div
      onClick={() => nav(to)}
      className="card-white rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-4xl">{icon}</div>
        <div className="text-xs text-gray-600 font-medium">Apri →</div>
      </div>

      <div className="text-xs text-gray-600 font-semibold mb-1">{label}</div>

      <div className="text-2xl font-bold text-gray-900">
        {showValues ? (
          <>
            {value}
            <span className="text-gray-600 text-lg"> {unit}</span>
          </>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Selezione arnia */}
      <div className="card-white rounded-xl p-4">
        <div className="text-sm font-bold text-gray-900 mb-3">Seleziona Arnia</div>

        <select
          className="select-honey h-10 w-full rounded-xl px-3 text-sm font-medium text-gray-900"
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

      {/* Toggle valori */}
      <div className="card-white rounded-xl p-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-gray-900">Mostra valori</div>
          <div className="text-xs text-gray-600">
            Nasconde o mostra i valori numerici
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 font-semibold">
            {showValues ? "ON" : "OFF"}
          </span>
          <button
            onClick={() => setShowValues(!showValues)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showValues ? 'bg-amber-400' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showValues ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatTile icon="💧" label="Umidità" value={sensorValues.hum} unit="%" to="/user/hum" />
        <StatTile icon="🌡️" label="Temperatura" value={sensorValues.temp} unit="°C" to="/user/temp" />
        <StatTile icon="⚖️" label="Peso" value={sensorValues.weight} unit="kg" to="/user/weight" />
      </div>

      {/* Notifiche */}
      <button
        className="btn-honey w-full h-12 rounded-xl"
        onClick={() => nav("/user/notif")}
      >
        🔔 Centro notifiche
      </button>
    </div>
  );
}