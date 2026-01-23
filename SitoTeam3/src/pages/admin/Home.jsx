import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function AdminHome() {
  const nav = useNavigate();
  const {
    apiari,
    hives,
    selectedApiarioId,
    setSelectedApiarioId,
    selectedHiveId,
    setSelectedHiveId,
  } = useContext(AppContext);

  const [showApiarioSelector, setShowApiarioSelector] = useState(false);

  // ✅ Filtra arnie per apiario selezionato
  const arnieDelApiario = selectedApiarioId
    ? hives.filter((h) => Number(h.apiarioId) === Number(selectedApiarioId))
    : hives;

  const apiarioSelezionato = apiari.find((a) => a.api_id === selectedApiarioId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-8xl mb-4">🛠️</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Area Admin</h1>
        <p className="text-sm text-gray-600">Gestione apiario e arnie</p>
      </div>

      {/* Selezione Apiario */}
      <div className="card-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Seleziona Apiario</h2>
            <p className="text-sm text-gray-600">
              {apiarioSelezionato
                ? `Stai gestendo:  ${apiarioSelezionato. api_nome || apiarioSelezionato.api_luogo}`
                : "Nessun apiario selezionato"}
            </p>
          </div>
          <button
            onClick={() => setShowApiarioSelector(! showApiarioSelector)}
            className="px-4 py-2 rounded-xl bg-amber-400 text-white font-semibold hover:bg-amber-500 transition-all"
          >
            {showApiarioSelector ? "Nascondi" : "Cambia Apiario"}
          </button>
        </div>

        {showApiarioSelector && (
          <div className="space-y-3">
            {apiari.map((apiario) => (
              <button
                key={apiario.api_id}
                onClick={() => {
                  setSelectedApiarioId(apiario.api_id);
                  setShowApiarioSelector(false);
                }}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedApiarioId === apiario.api_id
                    ?  "bg-amber-400 text-white shadow-lg"
                    : "bg-white border-2 border-amber-200 hover:border-amber-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🍯</div>
                  <div className="flex-1">
                    <div className="font-bold text-lg">
                      {apiario.api_nome || `Apiario ${apiario.api_id}`}
                    </div>
                    <div className="text-sm opacity-75">
                      📍 {apiario.api_luogo || "Posizione non specificata"}
                    </div>
                    {apiario. api_lat && apiario.api_lon && (
                      <div className="text-xs opacity-60 mt-1">
                        🗺️ {parseFloat(apiario.api_lat).toFixed(4)}, {parseFloat(apiario. api_lon).toFixed(4)}
                      </div>
                    )}
                  </div>
                  {selectedApiarioId === apiario.api_id && (
                    <div className="text-2xl">✓</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selezione Arnia */}
      {selectedApiarioId && (
        <div className="card-white rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Seleziona Arnia</h2>

          {arnieDelApiario.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-xl">
              <div className="text-6xl mb-3">🐝</div>
              <p className="text-gray-600 mb-4">Nessuna arnia in questo apiario</p>
              <button
                onClick={() => nav("/admin/addHive")}
                className="px-6 py-3 rounded-xl bg-amber-400 text-white font-semibold hover:bg-amber-500 transition-all"
              >
                + Aggiungi Prima Arnia
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {arnieDelApiario.map((hive) => (
                <button
                  key={hive.id}
                  onClick={() => setSelectedHiveId(hive.id)}
                  className={`p-4 rounded-xl transition-all ${
                    selectedHiveId === hive.id
                      ? "bg-amber-400 text-white shadow-lg scale-105"
                      :  "bg-white border-2 border-amber-200 hover: border-amber-400"
                  }`}
                >
                  <div className="text-3xl mb-2">🐝</div>
                  <div className="font-bold">{hive.name}</div>
                  <div className="text-xs opacity-75 mt-1">ID: {hive.id}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pulsanti Azioni */}
<div className="grid grid-cols-2 gap-4">
  {/* AGGIUNGI ARNIA - sempre attivo */}
  <button
    onClick={() => nav("/admin/addHive")}
    className="card-white rounded-2xl p-6 hover:shadow-lg transition-all text-center group"
  >
    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">➕</div>
    <div className="font-bold text-gray-900">Aggiungi Arnia</div>
    <div className="text-xs text-gray-600 mt-1">Nuova arnia nell'apiario</div>
  </button>

  {/* GESTISCI ARNIA - attivo solo se hai selezionato un'arnia */}
  {selectedHiveId ? (
    <button
      onClick={() => nav("/admin/hive")}
      className="card-white rounded-2xl p-6 hover:shadow-lg transition-all text-center group cursor-pointer"
    >
      <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🔧</div>
      <div className="font-bold text-gray-900">Gestisci Arnia</div>
      <div className="text-xs text-gray-600 mt-1">
        Configurazione arnia {selectedHiveId}
      </div>
    </button>
  ) : (
    <div className="card-white rounded-2xl p-6 text-center opacity-50 cursor-not-allowed border-2 border-dashed border-gray-300">
      <div className="text-5xl mb-3 opacity-30">🔧</div>
      <div className="font-bold text-gray-900">Gestisci Arnia</div>
      <div className="text-xs text-red-600 mt-1 font-semibold">
        ⚠️ Seleziona prima un'arnia sopra
      </div>
    </div>
  )}
</div>

      {/* Soglie */}
      <div className="card-white rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Gestione Soglie</h2>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => nav("/admin/th-temp")}
            className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 hover:border-red-400 transition-all"
          >
            <div className="text-3xl mb-2">🌡️</div>
            <div className="font-semibold text-gray-900">Temperatura</div>
          </button>

          <button
            onClick={() => nav("/admin/th-hum")}
            className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 hover:border-blue-400 transition-all"
          >
            <div className="text-3xl mb-2">💧</div>
            <div className="font-semibold text-gray-900">Umidità</div>
          </button>

          <button
            onClick={() => nav("/admin/th-weight")}
            className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400 transition-all"
          >
            <div className="text-3xl mb-2">⚖️</div>
            <div className="font-semibold text-gray-900">Peso</div>
          </button>
        </div>
      </div>

      {/* Torna Indietro */}
      <button
        onClick={() => nav("/user/home")}
        className="w-full btn-white h-12 rounded-xl"
      >
        ← Torna alla Home Utente
      </button>
    </div>
  );
}