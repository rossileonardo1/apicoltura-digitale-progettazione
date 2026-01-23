import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function Notifications() {
  const nav = useNavigate();
  const { notifications, hives } = useContext(AppContext);
  
  // ✅ Stato per tracciare quale notifica è aperta
  const [expandedId, setExpandedId] = useState(null);

  // ✅ Trova l'arnia dalla notifica
  const getHiveInfo = (notifica) => {
    if (notifica.arniaId) {
      const hive = hives.find((h) => h.id === String(notifica.arniaId));
      if (hive) return hive;
    }
    return hives[0] || null;
  };

  // ✅ Toggle espansione
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-8xl mb-4">🔔</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Centro Notifiche</h1>
        <p className="text-sm text-gray-600">
          {notifications.length > 0
            ? `${notifications.length} notifiche totali`
            : "Nessuna notifica disponibile"}
        </p>
      </div>

      {/* Lista Notifiche */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="card-white rounded-2xl p-8 text-center">
            <div className="text-6xl mb-3">✅</div>
            <div className="text-lg font-bold text-gray-900 mb-2">Tutto OK!</div>
            <div className="text-sm text-gray-600">
              Nessuna notifica da visualizzare
            </div>
          </div>
        ) : (
          notifications.map((notif) => {
            const hive = getHiveInfo(notif);
            const isExpanded = expandedId === notif.id;
            
            // ✅ Estrai titolo e descrizione
            const titolo = notif.rawData?.not_titolo || "";
            const descrizione = notif.rawData?.not_desc || 
                              notif.rawData?.not_messaggio || 
                              notif.rawData?.not_descrizione || 
                              notif.text || "";
            
            // ✅ Determina il tipo di notifica
            const testoCompleto = (titolo + " " + descrizione).toLowerCase();
            const isWarning = testoCompleto.includes("soglia") || 
                            testoCompleto.includes("allarme") ||
                            testoCompleto.includes("attenzione") ||
                            testoCompleto.includes("elevata") ||
                            testoCompleto.includes("bassa") ||
                            testoCompleto.includes("superato");
            
            const isInfo = testoCompleto.includes("regolare") ||
                          testoCompleto.includes("ok") ||
                          testoCompleto.includes("norma");

            return (
              <div
                key={notif.id}
                className={`card-white rounded-2xl overflow-hidden border-l-4 shadow-md transition-all ${
                  isWarning
                    ? "border-l-red-500 bg-red-50"
                    : isInfo
                    ? "border-l-green-500 bg-green-50"
                    : "border-l-blue-500 bg-blue-50"
                }`}
              >
                {/* ✅ HEADER CLICCABILE */}
                <button
                  onClick={() => toggleExpand(notif.id)}
                  className="w-full p-5 text-left hover:bg-white/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Icona */}
                    <div className="text-4xl flex-shrink-0">
                      {isWarning ? "⚠️" : isInfo ? "✅" : "📢"}
                    </div>

                    {/* Contenuto */}
                    <div className="flex-1 min-w-0">
                      {/* Info Arnia e Data */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-bold text-gray-900 bg-amber-200 px-2 py-1 rounded-lg">
                          🐝 Arnia {hive?.id || notif.arniaId || "?"}
                        </span>
                        <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded-lg">
                          🍯 {hive?.apiarioNome || "Apiario sconosciuto"}
                        </span>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-lg">
                          📅 {notif.date}
                        </span>
                      </div>

                      {/* Titolo */}
                      <div className="text-base font-bold text-gray-900">
                        {titolo || "Notifica"}
                      </div>

                      {/* Preview descrizione (solo se chiusa) */}
                      {!isExpanded && descrizione && (
                        <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {descrizione}
                        </div>
                      )}
                    </div>

                    {/* Icona Espandi/Comprimi */}
                    <div className={`text-2xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </div>
                  </div>
                </button>

                {/* ✅ DETTAGLI ESPANDIBILI */}
                {isExpanded && (
                  <div className="px-5 pb-5 space-y-4 border-t-2 border-white/50 pt-4">
                    {/* Descrizione completa */}
                    {descrizione && (
                      <div>
                        <div className="text-xs font-bold text-gray-600 mb-1">
                          📝 Descrizione Completa
                        </div>
                        <div className="text-sm text-gray-900 bg-white/70 p-3 rounded-xl leading-relaxed">
                          {descrizione}
                        </div>
                      </div>
                    )}

                    {/* Info Arnia Dettagliate */}
                    <div>
                      <div className="text-xs font-bold text-gray-600 mb-2">
                        🐝 Informazioni Arnia
                      </div>
                      <div className="bg-white/70 p-3 rounded-xl space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">ID Arnia:</span>
                          <span className="font-semibold text-gray-900">
                            {hive?.id || notif.arniaId || "N/D"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Apiario:</span>
                          <span className="font-semibold text-gray-900">
                            {hive?.apiarioNome || "N/D"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Posizione:</span>
                          <span className="font-semibold text-gray-900">
                            {hive?.location || "N/D"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div>
                      <div className="text-xs font-bold text-gray-600 mb-2">
                        🕒 Data e Ora
                      </div>
                      <div className="bg-white/70 p-3 rounded-xl text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Data:</span>
                          <span className="font-semibold text-gray-900">
                            {notif.date}
                          </span>
                        </div>
                        {notif.rawData?._created && (
                          <div className="flex justify-between mt-1">
                            <span className="text-gray-600">Ora:</span>
                            <span className="font-semibold text-gray-900">
                              {new Date(notif.rawData._created).toLocaleTimeString('it-IT')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dati grezzi (opzionale) */}
                    {notif.rawData && (
                      <details className="bg-gray-100 rounded-xl overflow-hidden">
                        <summary className="cursor-pointer p-3 text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors">
                          🔍 Dati tecnici completi
                        </summary>
                        <div className="p-3 bg-gray-800 text-green-400 font-mono text-xs overflow-auto max-h-64">
                          {Object.entries(notif.rawData).map(([key, value]) => (
                            <div key={key} className="mb-1">
                              <span className="text-yellow-300">{key}</span>:{" "}
                              <span className="text-white">
                                {typeof value === 'object' 
                                  ? JSON.stringify(value, null, 2) 
                                  : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pulsante indietro */}
      <button
        onClick={() => nav("/user/home")}
        className="w-full btn-white h-12 rounded-xl font-semibold"
      >
        ← Indietro
      </button>
    </div>
  );
}