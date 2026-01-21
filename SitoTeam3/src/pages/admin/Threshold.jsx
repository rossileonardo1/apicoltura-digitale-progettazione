import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function AdminThreshold({ tipo, titolo, unita }) {
  const nav = useNavigate();
  const { thresholds, setThresholds } = useContext(AppContext);

  const initial = thresholds[tipo];
  const [min, setMin] = useState(initial.min);
  const [max, setMax] = useState(initial.max);

  const submit = () => {
    const nMin = Number(min);
    const nMax = Number(max);
    if (Number.isNaN(nMin) || Number.isNaN(nMax)) return alert("Inserisci numeri validi");
    if (nMin >= nMax) return alert("La soglia minima deve essere < soglia massima");

    setThresholds((prev) => ({ ...prev, [tipo]: { min: nMin, max: nMax } }));
    nav("/admin/hive");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-center">{titolo}</h2>

      <div className="rounded-2xl border bg-white/55 p-3 space-y-3">
        <div>
          <div className="text-xs mb-1">Soglia minima ({unita})</div>
          <input className="w-full h-10 rounded-xl border bg-white px-3 text-sm" value={min} onChange={(e) => setMin(e.target.value)} />
        </div>

        <div>
          <div className="text-xs mb-1">Soglia massima ({unita})</div>
          <input className="w-full h-10 rounded-xl border bg-white px-3 text-sm" value={max} onChange={(e) => setMax(e.target.value)} />
        </div>

        <button onClick={submit} className="w-full rounded-2xl border bg-yellow-300 hover:bg-yellow-400 py-3 font-semibold">
          Conferma
        </button>

        <button onClick={() => nav("/admin/hive")} className="w-full rounded-2xl border bg-white/70 py-3">
          Indietro
        </button>
      </div>
    </div>
  );
}
