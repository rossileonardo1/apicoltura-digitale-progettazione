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
      <h1 className="text-xl font-semibold">Accesso Admin</h1>

      <input
        className="w-full max-w-[280px] border bg-white h-10 px-3 text-sm rounded-xl"
        placeholder="Password speciale"
        type="password"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
      />

      <button onClick={tryAccess} className="px-10 py-3 rounded-2xl border bg-yellow-300 hover:bg-yellow-400 font-semibold">
        Entra
      </button>

      <button onClick={() => nav("/user/login")} className="text-xs underline">
        Torna al Login
      </button>
    </div>
  );
}
