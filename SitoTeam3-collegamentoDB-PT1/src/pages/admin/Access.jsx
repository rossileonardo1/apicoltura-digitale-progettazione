import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function AdminAccess() {
  const nav = useNavigate();
  const { setAdminAuthed } = useContext(AppContext);
  const [pwd, setPwd] = useState("");

  const tryAccess = () => {
    if (pwd === "admin") {
      setAdminAuthed(true);
      nav("/admin/home");
    } else {
      alert("Password admin errata (demo: admin)");
    }
  };

  return (
    <div className="min-h-[520px] flex flex-col items-center justify-center gap-4">
      <div className="text-6xl mb-2">🔐</div>
      <h1 className="text-2xl font-bold text-gray-900">Accesso Admin</h1>

      <input
        className="input-honey w-full max-w-[280px] h-11 px-3 text-sm rounded-xl text-gray-900"
        placeholder="Password speciale"
        type="password"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
      />

      <button onClick={tryAccess} className="btn-honey px-10 py-3 rounded-xl font-bold">
        Entra
      </button>

      <button onClick={() => nav("/user/login")} className="text-xs text-gray-600 underline hover:text-gray-900">
        ← Torna al Login
      </button>
    </div>
  );
}