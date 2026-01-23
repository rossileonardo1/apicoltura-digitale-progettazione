import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function AdminAccess() {
  const nav = useNavigate();
  const { setAdminAuthed } = useContext(AppContext);

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || password.trim() === "") {
      setError("Inserisci la password");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (password === "admin123") {
        localStorage.setItem("adminAuthed", "true");
        localStorage.removeItem("userApiarioId");  // ✅ Admin non ha limiti
        localStorage.removeItem("userApiKey");
        setAdminAuthed(true);
        nav("/admin/home");
      } else {
        setError("❌ Password errata!");
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card-white rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">🛠️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Access</h1>
            <p className="text-sm text-gray-600">
              Area riservata agli amministratori
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Errore */}
            {error && (
              <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700 text-center font-semibold">
                {error}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Password Admin
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-medium focus:border-amber-400 focus:outline-none text-center text-lg"
                disabled={loading}
                autoFocus
              />
            </div>

            {/* Info password (solo per test) */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-xs text-blue-800 font-semibold mb-1">🔑 Password di test:</p>
              <div className="text-xs text-blue-700">
                <span className="font-mono font-bold">admin123</span>
              </div>
            </div>

            {/* Pulsante Accedi */}
            <button
              type="submit"
              className="w-full h-14 rounded-xl bg-gray-800 text-white font-bold text-lg hover:bg-gray-900 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Verifica in corso...
                </span>
              ) : (
                <>🔓 Accedi come Admin</>
              )}
            </button>

            {/* Link Utente */}
            <button
              type="button"
              onClick={() => nav("/user/login")}
              className="w-full h-12 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-all"
              disabled={loading}
            >
              👤 Torna al Login Utente
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            🛠️ Pannello di Amministrazione
          </div>
        </div>
      </div>
    </div>
  );
}