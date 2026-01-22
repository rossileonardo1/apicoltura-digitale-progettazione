import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function AdminAddHive() {
  const nav = useNavigate();
  const { addHive } = useContext(AppContext);

  const [id, setId] = useState("");
  const [location, setLocation] = useState("");

  const submit = () => {
    if (!id.trim() || !location.trim()) return alert("Compila ID e località");
    addHive({ id: id.trim(), location: location.trim() });
    nav("/admin/home");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center text-gray-900">Aggiungi una nuova Arnia</h2>

      <div className="card-white rounded-2xl p-4 space-y-3">
        <div>
          <div className="text-xs text-gray-600 font-semibold mb-2">ID arnia</div>
          <input 
            className="input-honey w-full h-10 rounded-xl px-3 text-sm text-gray-900" 
            value={id} 
            onChange={(e) => setId(e.target.value)} 
            placeholder="Es. A3"
          />
        </div>

        <div>
          <div className="text-xs text-gray-600 font-semibold mb-2">Località</div>
          <input 
            className="input-honey w-full h-10 rounded-xl px-3 text-sm text-gray-900" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            placeholder="Es. Roma"
          />
        </div>

        <button onClick={submit} className="btn-honey w-full h-12 rounded-xl font-bold">
          ✓ Aggiungi
        </button>

        <button onClick={() => nav("/admin/home")} className="btn-white w-full h-11 rounded-xl">
          ← Indietro
        </button>
      </div>
    </div>
  );
}