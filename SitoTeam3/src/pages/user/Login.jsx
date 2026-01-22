import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function Login() {
  const nav = useNavigate();
  const { setUserAuthed } = useContext(AppContext);
  const [key, setKey] = useState("");

  return (
    <div className="min-h-[520px] flex items-center justify-center">
      <div className="w-full max-w-[420px] card-white rounded-2xl p-6 space-y-5">
        <div className="text-center space-y-3">
          <div className="text-7xl">🐝</div>
          <h1 className="text-2xl font-bold text-gray-900">Benvenuto</h1>
          <p className="text-sm text-gray-600">
            Inserisci la key dell'arnia per accedere
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-gray-600 font-semibold">Key Arnia</div>
          <input
            className="input-honey w-full h-11 rounded-xl px-3 text-sm text-gray-900"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Es. A1"
          />
        </div>

        <button
          className="btn-honey w-full h-12 rounded-xl"
          onClick={() => {
            setUserAuthed(true);
            nav("/user/home");
          }}
        >
          🔓 Accedi
        </button>

        <button
          className="btn-white w-full h-11 rounded-xl text-sm"
          onClick={() => nav("/admin/access")}
        >
          🛠️ Accesso Admin
        </button>
      </div>
    </div>
  );
}