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
      <h2 className="text-lg font-semibold text-center">Aggiungi una nuova Arnia</h2>

      <div className="rounded-2xl border bg-white/55 p-3 space-y-3">
        <div>
          <div className="text-xs mb-1">ID arnia</div>
          <input className="w-full h-10 rounded-xl border bg-white px-3 text-sm" value={id} onChange={(e) => setId(e.target.value)} />
        </div>

        <div>
          <div className="text-xs mb-1">Località</div>
          <input className="w-full h-10 rounded-xl border bg-white px-3 text-sm" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <button onClick={submit} className="w-full rounded-2xl border bg-yellow-300 hover:bg-yellow-400 py-3 font-semibold">
          Aggiungi
        </button>

        <button onClick={() => nav("/admin/home")} className="w-full rounded-2xl border bg-white/70 py-3">
          Indietro
        </button>
      </div>
    </div>
  );
}
