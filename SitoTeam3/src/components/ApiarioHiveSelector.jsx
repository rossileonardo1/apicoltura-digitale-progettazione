import { useContext, useEffect } from "react";
import { AppContext } from "../App";

export default function ApiarioHiveSelector() {
  const {
    apiari,
    hives,
    selectedApiarioId,
    setSelectedApiarioId,
    selectedHiveId,
    setSelectedHiveId,
  } = useContext(AppContext);

  // ✅ Quando apri il menu, seleziona automaticamente il primo apiario
  useEffect(() => {
    if (!selectedApiarioId && apiari. length > 0) {
      setSelectedApiarioId(apiari[0].api_id);
    }
  }, [apiari, selectedApiarioId, setSelectedApiarioId]);

  // ✅ Filtra le arnie in base all'apiario selezionato
  const arnieDelApiario = selectedApiarioId
    ? hives.filter((h) => Number(h.apiarioId) === Number(selectedApiarioId))
    : [];

  // ✅ Quando cambia l'apiario, seleziona automaticamente la prima arnia
  useEffect(() => {
    if (arnieDelApiario.length > 0) {
      const primaArnia = arnieDelApiario[0];
      if (! selectedHiveId || ! arnieDelApiario.find((a) => a.id === selectedHiveId)) {
        setSelectedHiveId(primaArnia.id);
      }
    }
  }, [selectedApiarioId, arnieDelApiario, selectedHiveId, setSelectedHiveId]);

  return (
    <div className="space-y-4">
      {/* Dropdown Apiario */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Seleziona Apiario
        </label>
        <select
          value={selectedApiarioId || ""}
          onChange={(e) => setSelectedApiarioId(Number(e.target.value))}
          className="w-full h-12 px-4 rounded-xl border-2 border-amber-200 bg-white text-gray-900 font-medium focus:border-amber-400 focus:outline-none"
        >
          {apiari.map((apiario) => (
            <option key={apiario.api_id} value={apiario. api_id}>
              🍯 {apiario.api_nome || apiario.api_luogo || `Apiario ${apiario.api_id}`}
            </option>
          ))}
        </select>
      </div>

      {/* Griglia Arnie */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Seleziona Arnia
        </label>
        
        {arnieDelApiario.length === 0 ? (
          <div className="text-center p-6 rounded-xl bg-gray-100 text-gray-500">
            <div className="text-4xl mb-2">🐝</div>
            <div className="text-sm">Nessuna arnia in questo apiario</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {arnieDelApiario.map((hive) => (
              <button
                key={hive.id}
                onClick={() => setSelectedHiveId(hive.id)}
                className={`p-4 rounded-xl text-sm font-medium transition-all ${
                  selectedHiveId === hive.id
                    ?  "bg-amber-400 text-white shadow-lg scale-105"
                    : "bg-white border-2 border-amber-200 text-gray-700 hover:border-amber-400 hover:scale-102"
                }`}
              >
                <div className="text-2xl mb-1">🐝</div>
                <div className="font-bold">{hive.name}</div>
                <div className="text-xs opacity-75 mt-1">ID: {hive.id}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}