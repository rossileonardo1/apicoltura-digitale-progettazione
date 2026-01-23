import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function AdminAddHive() {
  const nav = useNavigate();
  const { apiari, addHive } = useContext(AppContext);

  const [arniaId, setArniaId] = useState("");
  const [selectedApiarioId, setSelectedApiarioId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ VALIDAZIONE
    if (!arniaId || arniaId.trim() === "") {
      setError("Inserisci un ID arnia valido");
      return;
    }

    if (!selectedApiarioId) {
      setError("Seleziona un apiario");
      return;
    }

    const id = Number(arniaId);
    if (!Number.isFinite(id) || id <= 0) {
      setError("L'ID deve essere un numero positivo");
      return;
    }

    try {
      setLoading(true);
      
      // ✅ PASSA L'APIARIO SELEZIONATO
      await addHive({ 
        id: id, 
        apiarioId: Number(selectedApiarioId)
      });

      alert(`✅ Arnia ${id} aggiunta con successo!`);
      nav("/admin/home");
    } catch (err) {
      setError(err.message || "Errore durante l'aggiunta dell'arnia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-8xl mb-4">➕</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Aggiungi Arnia</h1>
        <p className="text-sm text-gray-600">Crea una nuova arnia in un apiario</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card-white rounded-2xl p-6 space-y-6">
        {/* Errore */}
        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* Selezione Apiario */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            🍯 Seleziona Apiario
          </label>
          <select
            value={selectedApiarioId}
            onChange={(e) => setSelectedApiarioId(e.target.value)}
            className="w-full h-14 px-4 rounded-xl border-2 border-amber-200 bg-white text-gray-900 font-medium focus:border-amber-400 focus:outline-none"
            required
          >
            <option value="">-- Scegli un apiario --</option>
            {apiari.map((apiario) => (
              <option key={apiario.api_id} value={apiario.api_id}>
                {apiario.api_nome || apiario.api_luogo || `Apiario ${apiario.api_id}`}
                {apiario.api_luogo && ` - ${apiario.api_luogo}`}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-600 mt-2">
            L'arnia verrà aggiunta all'apiario selezionato
          </p>
        </div>

        {/* ID Arnia */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            🐝 ID Arnia
          </label>
          <input
            type="number"
            min="1"
            value={arniaId}
            onChange={(e) => setArniaId(e.target.value)}
            placeholder="Es. 10"
            className="w-full h-14 px-4 rounded-xl border-2 border-amber-200 bg-white text-gray-900 font-medium focus:border-amber-400 focus:outline-none"
            required
          />
          <p className="text-xs text-gray-600 mt-2">
            Inserisci un numero unico per identificare l'arnia (deve essere maggiore di 0)
          </p>
        </div>

        {/* Anteprima */}
        {arniaId && selectedApiarioId && (
          <div className="rounded-xl bg-amber-50 border-2 border-amber-200 p-4">
            <div className="text-sm font-bold text-gray-900 mb-2">📋 Anteprima</div>
            <div className="space-y-1 text-sm">
              <div>
                <span className="text-gray-600">Arnia ID:</span>{" "}
                <span className="font-bold text-gray-900">{arniaId}</span>
              </div>
              <div>
                <span className="text-gray-600">Apiario:</span>{" "}
                <span className="font-bold text-gray-900">
                  {apiari.find((a) => a.api_id === Number(selectedApiarioId))?.api_nome || "Sconosciuto"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bottoni */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => nav("/admin/home")}
            className="flex-1 h-14 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-all"
            disabled={loading}
          >
            Annulla
          </button>
          <button
            type="submit"
            className="flex-1 h-14 rounded-xl bg-amber-400 text-white font-semibold hover:bg-amber-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Aggiunta in corso..." : "✅ Aggiungi Arnia"}
          </button>
        </div>
      </form>
    </div>
  );
}