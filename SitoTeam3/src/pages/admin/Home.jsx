import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function AdminHome() {
  const nav = useNavigate();
  const { hives = [], selectedHiveId, setSelectedHiveId } = useContext(AppContext);

  const openHive = () => {
    if (!selectedHiveId) return alert("Seleziona un'arnia prima di aprirla.");
    nav("/admin/hive");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-white/55 p-3">
        <div className="text-sm font-semibold mb-2">Seleziona Arnia</div>

        <select
          className="w-full h-10 rounded-xl border bg-white px-3 text-sm"
          value={selectedHiveId}
          onChange={(e) => setSelectedHiveId(e.target.value)}
        >
          {hives.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name} — {h.location}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <button onClick={openHive} className="rounded-2xl border bg-white/70 py-3 font-semibold">
            Apri Arnia
          </button>

          <button onClick={() => nav("/admin/addHive")} className="rounded-2xl border bg-yellow-300 hover:bg-yellow-400 py-3 font-semibold">
            Aggiungi Arnia
          </button>
        </div>
      </div>
    </div>
  );
}
