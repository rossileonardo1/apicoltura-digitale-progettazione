import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function AdminThreshold({ tipo, titolo, unita }) {
  const nav = useNavigate();
  const { thresholds, saveThresholds } = useContext(AppContext);

  const initial = thresholds[tipo];
  const [min, setMin] = useState(initial.min);
  const [max, setMax] = useState(initial.max);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const nMin = Number(min);
    const nMax = Number(max);
    if (Number.isNaN(nMin) || Number.isNaN(nMax)) return alert("Inserisci numeri validi");
    if (nMin >= nMax) return alert("La soglia minima deve essere < soglia massima");

    try {
      setSaving(true);
      await saveThresholds(tipo, { min: nMin, max: nMax });
      alert("✅ Soglie salvate correttamente!");
      nav("/admin/hive");
    } catch (e) {
      alert(`❌ Errore:  ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center text-gray-900">{titolo}</h2>

      <div className="card-white rounded-2xl p-4 space-y-3">
        <div>
          <div className="text-xs text-gray-600 font-semibold mb-2">
            Soglia minima ({unita})
          </div>
          <input 
            className="input-honey w-full h-10 rounded-xl px-3 text-sm text-gray-900" 
            type="number"
            value={min} 
            onChange={(e) => setMin(e.target.value)} 
            disabled={saving}
          />
        </div>

        <div>
          <div className="text-xs text-gray-600 font-semibold mb-2">
            Soglia massima ({unita})
          </div>
          <input 
            className="input-honey w-full h-10 rounded-xl px-3 text-sm text-gray-900" 
            type="number"
            value={max} 
            onChange={(e) => setMax(e.target.value)} 
            disabled={saving}
          />
        </div>

        <button 
          onClick={submit} 
          className="btn-honey w-full h-12 rounded-xl font-bold"
          disabled={saving}
        >
          {saving ? "⏳ Salvataggio..." : "✓ Conferma"}
        </button>

        <button 
          onClick={() => nav("/admin/hive")} 
          className="btn-white w-full h-11 rounded-xl"
          disabled={saving}
        >
          ← Indietro
        </button>
      </div>
    </div>
  );
}