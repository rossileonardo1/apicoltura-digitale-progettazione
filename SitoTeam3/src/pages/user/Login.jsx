import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function Login() {
  const nav = useNavigate();
  const { setUserAuthed } = useContext(AppContext);

  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ API KEY CORRETTA (dalla variabile ambiente)
  const CORRECT_API_KEY = import.meta.env.VITE_USER_API_KEY || "A1";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!apiKey || apiKey.trim() === "") {
      setError("Inserisci la tua API Key");
      return;
    }

    setLoading(true);

    // ✅ VERIFICA API KEY
    setTimeout(() => {
      if (apiKey.trim() === CORRECT_API_KEY) {
        setUserAuthed(true);
        nav("/user/home");
      } else {
        setError("❌ API Key non valida!");
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
            <div className="text-8xl mb-4">🐝</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Benvenuto</h1>
            <p className="text-sm text-gray-600">
              Inserisci la key dell'arnia per accedere
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Errore */}
            {error && (
              <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700 text-center font-semibold">
                {error}
              </div>
            )}

            {/* API Key */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Key Arnia
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Es. A1"
                className="w-full h-14 px-4 rounded-xl border-2 border-amber-200 bg-white text-gray-900 font-medium focus:border-amber-400 focus:outline-none text-center text-lg uppercase"
                disabled={loading}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                La key ti è stata fornita dal tuo apicoltore
              </p>
            </div>

            {/* Pulsante Accedi */}
            <button
              type="submit"
              className="w-full h-14 rounded-xl bg-amber-400 text-white font-bold text-lg hover:bg-amber-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Verifica in corso...
                </span>
              ) : (
                <>🔓 Accedi</>
              )}
            </button>

            {/* Link Admin */}
            <button
              type="button"
              onClick={() => nav("/admin/access")}
              className="w-full h-12 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-all"
              disabled={loading}
            >
              🛠️ Accesso Admin
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            🐝 Apicoltura Digitale - Sistema di Monitoraggio
          </div>
        </div>
      </div>
    </div>
  );
}