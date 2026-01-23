import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function Weight() {
  const { selectedHive, thresholds, sensorValues } = useContext(AppContext);
  const nav = useNavigate();  // ✅ AGGIUNTO

  console.log("🐝 selectedHive:", selectedHive);

  // ✅ Dati peso con fallback
  const weightData = useMemo(() => {
    // Se c'è weightHistory, usala
    if (selectedHive?.weightHistory && selectedHive.weightHistory.length > 0) {
      return selectedHive.weightHistory.map((v) => ({
        time: new Date(v.timestamp).toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        peso: v.value || 0,
      }));
    }
    
    // ✅ FALLBACK: se c'è solo il peso corrente, crea un punto
    if (selectedHive?.weight && selectedHive.weight > 0) {
      return [
        {
          time: new Date().toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          peso: selectedHive.weight,
        }
      ];
    }
    
    return [];
  }, [selectedHive]);

  // ✅ Valore corrente - Prendi dall'ultimo punto dello storico o da sensorValues
  const currentWeight = useMemo(() => {
    // Se c'è weightHistory, prendi l'ultimo valore
    if (selectedHive?.weightHistory && selectedHive.weightHistory.length > 0) {
      const last = selectedHive.weightHistory[selectedHive.weightHistory.length - 1];
      return last.value || 0;
    }
    
    // Altrimenti usa selectedHive.weight
    return selectedHive?.weight ?? sensorValues?.weight ?? 0;
  }, [selectedHive, sensorValues]);

  // ✅ Soglie
  const weightMin = thresholds?.weight?.min ?? 20;
  const weightMax = thresholds?.weight?.max ?? 80;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-8xl mb-4">⚖️</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Peso Arnia</h1>
        <p className="text-sm text-gray-600">Monitoraggio peso dell'arnia</p>
      </div>

      {/* Valore corrente */}
      <div className="card-white rounded-2xl p-6 text-center">
        <div className="text-sm text-gray-600 mb-2">Peso Attuale</div>
        <div className="text-6xl font-bold text-gray-900 mb-2">
          {currentWeight.toFixed(1)} kg
        </div>
        <div className="text-sm text-gray-600">
          Range ottimale: {weightMin}kg - {weightMax}kg
        </div>
      </div>

      {/* Grafico */}
      <div className="card-white rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Andamento Peso</h2>
        {weightData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  border: "2px solid #a855f7",
                  borderRadius: "12px",
                }}
              />
              <ReferenceLine 
                y={weightMax} 
                stroke="#ef4444" 
                strokeDasharray="5 5"
                label={{ value: `Max ${weightMax}kg`, fill: "#ef4444", fontSize: 12 }}
              />
              <ReferenceLine 
                y={weightMin} 
                stroke="#f59e0b" 
                strokeDasharray="5 5"
                label={{ value: `Min ${weightMin}kg`, fill: "#f59e0b", fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="peso"
                stroke="#a855f7"
                strokeWidth={3}
                dot={{ fill: "#a855f7", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Nessun dato disponibile per l'arnia selezionata
          </div>
        )}
      </div>

      {/* Statistiche */}
      {weightData.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card-white rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">📈</div>
            <div className="text-sm text-gray-600">Massimo</div>
            <div className="text-xl font-bold text-purple-600">
              {Math.max(...weightData.map((d) => d.peso)).toFixed(1)} kg
            </div>
          </div>
          <div className="card-white rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm text-gray-600">Medio</div>
            <div className="text-xl font-bold text-gray-900">
              {(
                weightData.reduce((sum, d) => sum + d.peso, 0) /
                weightData.length
              ).toFixed(1)}{" "}
              kg
            </div>
          </div>
          <div className="card-white rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">📉</div>
            <div className="text-sm text-gray-600">Minimo</div>
            <div className="text-xl font-bold text-orange-600">
              {Math.min(...weightData.map((d) => d.peso)).toFixed(1)} kg
            </div>
          </div>
        </div>
      )}

      {/* Pulsante indietro */}
      <button
        onClick={() => nav("/user/home")}
        className="w-full btn-white h-12 rounded-xl font-semibold"
      >
        ← Indietro
      </button>
    </div>
  );
}