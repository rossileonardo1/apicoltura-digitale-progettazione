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
      <div className="card-white rounded-2xl p-4">
        <div className="text-sm font-bold text-gray-900 mb-3">Seleziona Arnia</div>

        <select
          className="select-honey w-full h-10 rounded-xl px-3 text-sm font-medium text-gray-900"
          value={selectedHiveId}
          onChange={(e) => setSelectedHiveId(e.target.value)}
        >
          {hives.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name} — {h.location}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button onClick={openHive} className="btn-white h-11 rounded-xl font-semibold">
            Apri Arnia
          </button>

          <button onClick={() => nav("/admin/addHive")} className="btn-honey h-11 rounded-xl font-semibold">
            Aggiungi Arnia
          </button>
        </div>
      </div>
    </div>
  );
}